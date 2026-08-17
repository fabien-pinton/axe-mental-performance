-- ============================================================
-- AXE MENTAL PERFORMANCE : suivi des demandes (autorisation)
-- A coller dans Supabase, SQL Editor.
-- Lance les blocs UN PAR UN, dans l'ordre, avec le bouton RUN.
-- ============================================================


-- ---------- BLOC 1 : la table ----------
create table if not exists prospects (
  id bigserial primary key,
  nom_parent text,
  nom_rider text,
  email_parent text,
  parraine_par text,
  clique_le timestamptz default now()
);

alter table prospects enable row level security;


-- ---------- BLOC 2 : enregistrer une demande ----------
create or replace function enregistrer_prospect(
  nom_parent_p text,
  nom_rider_p text,
  email_parent_p text,
  parrain_p text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if length(coalesce(nom_parent_p,'')) < 2 or length(coalesce(email_parent_p,'')) < 5 then
    return;
  end if;

  insert into prospects (nom_parent, nom_rider, email_parent, parraine_par)
  values (
    left(trim(nom_parent_p), 80),
    left(trim(coalesce(nom_rider_p,'')), 80),
    left(lower(trim(email_parent_p)), 120),
    left(trim(coalesce(parrain_p,'')), 40)
  );
end;
$$;


-- ---------- BLOC 3 : autoriser les pages a l'appeler ----------
grant execute on function enregistrer_prospect(text, text, text, text) to anon;


-- ---------- BLOC 4 : lecture reservee a la cle coach ----------
create or replace function liste_prospects(cle text)
returns setof prospects
language plpgsql
security definer
set search_path = public
as $$
begin
  if cle is distinct from 'Linda12aout2006!' then
    raise exception 'acces refuse';
  end if;
  return query select * from prospects order by clique_le desc limit 1000;
end;
$$;


-- ---------- BLOC 5 : autoriser la page coach a l'appeler ----------
grant execute on function liste_prospects(text) to anon;


-- ---------- BLOC 6 : verification ----------
-- Doit renvoyer une table vide, sans erreur.
select * from liste_prospects('Linda12aout2006!');
