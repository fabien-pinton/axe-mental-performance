// ════════════════════════════════════════════════════════════════
//  AXE MENTAL PERFORMANCE® — CONFIGURATION
//  ⚙️  C'EST LE SEUL FICHIER À MODIFIER POUR METTRE EN LIGNE.
// ════════════════════════════════════════════════════════════════

const CFG = {

  // ── 1. SUPABASE (base de données + comptes) ──────────────────
  //  Où trouver : Supabase → ton projet → Settings → API
  //  - SUPABASE_URL  = "Project URL"
  //  - SUPABASE_KEY  = la clé "anon public" (PAS la service_role !)
  SUPABASE_URL: "https://gbkpklvkjrinkijtzfss.supabase.co",
  SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdia3BrbHZranJpbmtpanR6ZnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMDYzOTAsImV4cCI6MjA5NTg4MjM5MH0.SyxTfo90UA280x46X_2IW_GT137AEhA84XdVYge_e2A",

  // ── 2. TIDYCAL (réservation présentiel) ──────────────────────
  //  Reprend ton lien existant
  TIDYCAL_PRESENTIEL: "https://tidycal.com/fpinton/presence-competition",
  TIDYCAL_RDV_PROGRAMME: "https://tidycal.com/fpinton/rdv-module-1-axe-premium",
  TIDYCAL_DEBRIEF_VISIO: "https://tidycal.com/fpinton/seance-debrief",  // débrief toutes les 8 semaines

  // ── 3. GOOGLE MAPS (calcul distance présentiel) ──────────────
  //  Reprend ta clé existante
  GOOGLE_MAPS_KEY: "AIzaSyCmyB9fpUzAJxAsJWmhqlBPNtg6Iwlbv_M",
  ADRESSE_FABIEN: "Lyon, France",          // ton point de départ
  TARIF_KM: 0.55,                          // €/km aller-retour

  // ── 4. STRIPE (paiement déplacement, optionnel) ──────────────
  STRIPE_DEPLACEMENT: "https://buy.stripe.com/3cI6oG9u4dv895j4to8IU03",
};

// Initialisation du client Supabase (ne pas toucher)
let sb = null;
function initSupabase() {
  if (!sb && window.supabase) {
    sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_KEY);
  }
  return sb;
}

// Garde : redirige vers la connexion si pas authentifié
async function exigerConnexion() {
  initSupabase();
  const { data } = await sb.auth.getUser();
  if (!data || !data.user) { window.location.href = "index.html"; return null; }
  return data.user;
}

// Récupère le profil du pilote connecté
async function chargerProfil() {
  const u = await exigerConnexion();
  if (!u) return null;
  const { data } = await sb.from("profils").select("*").eq("id", u.id).single();
  return { user: u, profil: data };
}
