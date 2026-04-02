const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // clé "service_role", pas la clé publique
);

// Durée d'accès : 13 mois (programme 12 mois + marge)
const ACCESS_MONTHS = 13;

exports.handler = async (event) => {
  // Stripe envoie un POST avec une signature à vérifier
  const sig = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Signature Stripe invalide :", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // On ne traite que les paiements confirmés
  if (stripeEvent.type !== "checkout.session.completed") {
    return { statusCode: 200, body: "Événement ignoré" };
  }

  const session = stripeEvent.data.object;
  const email = session.customer_details?.email || session.customer_email;
  const token = session.id; // ex: cs_live_XXXXXXX
  const stripeCustomerId = session.customer;
  const stripeSubId = session.subscription || null;

  // Date d'expiration : maintenant + 13 mois
  const accessUntil = new Date();
  accessUntil.setMonth(accessUntil.getMonth() + ACCESS_MONTHS);

  // Upsert dans Supabase (crée ou met à jour si l'email existe déjà)
  const { error } = await supabase
    .from("athletes")
    .upsert(
      {
        email,
        token,
        statut_abonnement: "active",
        acces_jusqu_a: accessUntil.toISOString(),
        stripe_customer_id: stripeCustomerId,
        stripe_sub_id: stripeSubId,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

  if (error) {
    console.error("Erreur Supabase :", error.message);
    return { statusCode: 500, body: "Erreur Supabase" };
  }

  // Envoi de l'email avec le lien d'accès
  const programUrl = `${process.env.PROGRAM_URL}?token=${token}`;
  await sendAccessEmail(email, programUrl);

  console.log(`✓ Accès créé pour ${email} — token: ${token}`);
  return { statusCode: 200, body: "OK" };
};

// ─── Envoi email via Brevo (anciennement Sendinblue) ──────────────────────────
// Si tu préfères un autre service (Resend, Mailgun...), adapte cette fonction
async function sendAccessEmail(email, programUrl) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) {
    console.warn("BREVO_API_KEY manquant — email non envoyé");
    return;
  }

  const body = {
    sender: { name: "Fabien Pinton — Méthode AXE", email: "f.pinton@outlook.fr" },
    to: [{ email }],
    subject: "🎯 Ton accès à la Méthode AXE est prêt",
    htmlContent: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #F8F4EE; padding: 48px 40px;">
        <div style="font-family: 'Bebas Neue', Impact, sans-serif; font-size: 48px; letter-spacing: 0.2em; color: #A8852A; margin-bottom: 8px;">AXE</div>
        <div style="width: 40px; height: 1px; background: #A8852A; margin-bottom: 32px;"></div>

        <p style="font-size: 16px; color: #1C1510; line-height: 1.7; margin-bottom: 24px;">
          Ton paiement a bien été confirmé. Ton accès à la <strong>Méthode AXE</strong> est activé.
        </p>

        <p style="font-size: 14px; color: #5A4E3E; line-height: 1.7; margin-bottom: 32px;">
          Ce lien est personnel et unique. Garde-le précieusement — il te permettra d'accéder au programme depuis n'importe quel appareil.
        </p>

        <a href="${programUrl}"
          style="display: inline-block; background: #A8852A; color: #FDFAF5; font-size: 12px; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; padding: 16px 40px; text-decoration: none; margin-bottom: 32px;">
          ACCÉDER AU PROGRAMME →
        </a>

        <p style="font-size: 11px; color: #C8BFB0; margin-top: 32px; border-top: 1px solid #E2D9CC; padding-top: 20px;">
          Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :<br>
          <span style="color: #A8852A;">${programUrl}</span>
        </p>

        <p style="font-size: 11px; color: #C8BFB0; margin-top: 16px;">
          Une question ? Réponds directement à cet email.<br>
          — Fabien
        </p>
      </div>
    `,
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error("Erreur Brevo :", txt);
    } else {
      console.log(`✓ Email envoyé à ${email}`);
    }
  } catch (e) {
    console.error("Erreur envoi email :", e.message);
  }
}
