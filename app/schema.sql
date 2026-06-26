-- ════════════════════════════════════════════════════════════════
--  AXE MENTAL PERFORMANCE® — SCHÉMA SUPABASE
--  À coller dans : Supabase → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════

-- ── 1. PROFIL PILOTE ────────────────────────────────────────────
create table if not exists profils (
  id uuid primary key references auth.users(id) on delete cascade,
  email          text,
  telephone      text,
  prenom         text,
  nom            text,
  tranche_age    text,          -- '10-12' | '12-15' | '15-18'
  genre          text,          -- 'homme' | 'femme'
  sport          text,
  niveau         text,          -- 'departemental'|'regional'|'national'|'international'
  is_admin       boolean default false,
  questionnaire_ok boolean default false,
  diagnostic_ok    boolean default false,
  date_debut_programme timestamptz,   -- sert au déblocage hebdo
  cree_le        timestamptz default now()
);
-- Si la table profils existait déjà, ajoute la colonne téléphone :
alter table profils add column if not exists telephone text;

-- ── 2. RÉSULTAT DU DIAGNOSTIC ───────────────────────────────────
create table if not exists diagnostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  -- scores mentaux (sur 100)
  score_stress     int,
  score_peur       int,
  score_confiance  int,
  score_plaisir    int,
  score_compet     int,
  -- synthèse
  profil_id        text,        -- stress|peur|confiance|plaisir|compet
  point_fort_mental    text,
  point_faible_mental  text,
  point_fort_physique  text,
  point_faible_physique text,
  rapport_json     jsonb,       -- rapport complet généré
  cree_le          timestamptz default now()
);

-- ── 3. PROGRESSION HEBDOMADAIRE ─────────────────────────────────
-- une ligne par (pilote × semaine), stocke notes, ressentis, cases cochées
create table if not exists progression (
  id uuid primary key default gen_random_uuid(),
  user_id   uuid references auth.users(id) on delete cascade,
  semaine   int,                 -- 1..24
  mental_fait     boolean default false,
  seance_lundi_fait  boolean default false,
  seance_jeudi_fait  boolean default false,
  note_mental     text,          -- prise de notes exercice mental
  ressenti        text,          -- ressenti global de la semaine
  intensite_ressentie int,       -- 1..10 auto-évaluation
  maj_le    timestamptz default now(),
  unique(user_id, semaine)
);

-- ── 4. MESSAGERIE (pilote ↔ Fabien) ─────────────────────────────
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id   uuid references auth.users(id) on delete cascade,  -- le pilote concerné
  auteur    text,                -- 'pilote' | 'coach'
  contenu   text,
  lu        boolean default false,
  cree_le   timestamptz default now()
);

-- ── 5. DEMANDES DE PRÉSENTIEL ───────────────────────────────────
create table if not exists presentiels (
  id uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  competition text,
  adresse     text,
  distance_km int,
  tarif_eur   int,
  statut      text default 'demande',  -- demande|confirme|annule
  cree_le     timestamptz default now()
);

-- ── 6. DÉBRIEFS VISIO (tous les 8 semaines : S8, S16, S24) ──────
create table if not exists debriefs (
  id uuid primary key default gen_random_uuid(),
  user_id   uuid references auth.users(id) on delete cascade,
  jalon     int,                 -- 8 | 16 | 24
  statut    text default 'demande',  -- demande|confirme|fait
  cree_le   timestamptz default now(),
  unique(user_id, jalon)
);

-- ── 7. ACCÈS AUTORISÉS (liste blanche : emails ayant payé) ──────
-- Make ajoute ici l'email du client après paiement Stripe.
-- L'app vérifie cette liste avant d'autoriser la création de compte.
create table if not exists acces_autorises (
  id uuid primary key default gen_random_uuid(),
  email     text unique not null,
  source    text default 'stripe_997',  -- d'où vient l'autorisation
  utilise   boolean default false,       -- passé à true quand le compte est créé
  cree_le   timestamptz default now()
);

-- Fonction publique : un email est-il autorisé ? (renvoie true/false)
-- SECURITY DEFINER = s'exécute avec les droits du créateur, donc lisible
-- même par un visiteur non connecté, sans exposer toute la table.
create or replace function email_autorise(p_email text) returns boolean as $$
  select exists(
    select 1 from acces_autorises
    where lower(email) = lower(p_email)
  );
$$ language sql security definer stable;

-- ════════════════════════════════════════════════════════════════
--  SÉCURITÉ (Row Level Security) — chaque pilote ne voit QUE ses données
--  L'admin (is_admin=true) voit tout.
-- ════════════════════════════════════════════════════════════════
alter table profils      enable row level security;
alter table diagnostics  enable row level security;
alter table progression  enable row level security;
alter table messages     enable row level security;
alter table presentiels  enable row level security;
alter table debriefs     enable row level security;
alter table acces_autorises enable row level security;
-- Aucune policy publique sur acces_autorises : la table n'est lisible/écrivable
-- que par la clé service_role (utilisée par Make). La vérification côté client
-- passe uniquement par la fonction email_autorise() ci-dessus.

-- fonction utilitaire : suis-je admin ?
create or replace function est_admin() returns boolean as $$
  select coalesce((select is_admin from profils where id = auth.uid()), false);
$$ language sql security definer stable;

-- PROFILS
create policy "lire son profil ou admin" on profils for select
  using (id = auth.uid() or est_admin());
create policy "creer son profil" on profils for insert
  with check (id = auth.uid());
create policy "maj son profil" on profils for update
  using (id = auth.uid() or est_admin());

-- DIAGNOSTICS
create policy "lire ses diagnostics ou admin" on diagnostics for select
  using (user_id = auth.uid() or est_admin());
create policy "creer son diagnostic" on diagnostics for insert
  with check (user_id = auth.uid());

-- PROGRESSION
create policy "lire sa progression ou admin" on progression for select
  using (user_id = auth.uid() or est_admin());
create policy "creer sa progression" on progression for insert
  with check (user_id = auth.uid());
create policy "maj sa progression" on progression for update
  using (user_id = auth.uid());

-- MESSAGES
create policy "lire ses messages ou admin" on messages for select
  using (user_id = auth.uid() or est_admin());
create policy "ecrire un message" on messages for insert
  with check (user_id = auth.uid() or est_admin());
create policy "maj message (lu) admin ou proprio" on messages for update
  using (user_id = auth.uid() or est_admin());

-- PRESENTIELS
create policy "lire ses presentiels ou admin" on presentiels for select
  using (user_id = auth.uid() or est_admin());
create policy "creer un presentiel" on presentiels for insert
  with check (user_id = auth.uid());
create policy "maj presentiel admin" on presentiels for update
  using (est_admin());

-- DEBRIEFS
create policy "lire ses debriefs ou admin" on debriefs for select
  using (user_id = auth.uid() or est_admin());
create policy "creer un debrief" on debriefs for insert
  with check (user_id = auth.uid());
create policy "maj debrief proprio ou admin" on debriefs for update
  using (user_id = auth.uid() or est_admin());

-- ════════════════════════════════════════════════════════════════
--  POUR TE DÉSIGNER ADMIN (Fabien) :
--  1. Crée ton compte normalement via l'app
--  2. Reviens ici et lance (en remplaçant ton email) :
--     update profils set is_admin = true where email = 'fabien@exemple.com';
-- ════════════════════════════════════════════════════════════════
