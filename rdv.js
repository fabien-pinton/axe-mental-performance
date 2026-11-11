/* =====================================================================================
   LE RENDEZ-VOUS MENTAL DU DIMANCHE
   -------------------------------------------------------------------------------------
   Un seul rendez-vous par semaine, toujours le même jour. Il s'ouvre le vendredi soir,
   il se fait idéalement le dimanche, et s'il n'est pas fait, il reste rattrapable toute
   la semaine suivante avec une alerte qui monte de ton en ton.

   Le principe tient en deux temps, et c'est le deuxième qui fait tout le travail :
     1. il note un moment de la semaine ;
     2. le dimanche suivant, on lui ressort ce qu'il a écrit et on lui demande ce que ça
        a CONCRÈTEMENT changé. Sept jours après, pas sur le moment.

   Les questions ne sont pas génériques : elles sont tirées de l'axe qu'il travaille ce
   mois-ci (son blocage dominant ou celui désigné dans son bilan), du moment qu'il a
   lui-même pointé dans son bilan de fin de mois, et de ce qui revient dans ses propres
   notes quand un mot est déjà apparu trois fois.

   Cette page ne connaît rien du protocole : elle reçoit tout par `init`.
   ===================================================================================== */
(function(){
'use strict';

var C = null;          // le contexte fourni par la page
var PROFIL = 'sportif'; // 'sportif' ou 'parent'
var ZONE = null;       // le conteneur où tout est rendu

/* ---------------------------------------------------------------- dates */
function j0(d){ var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return x; }
function cle(d){ return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0')
                      + '-' + String(d.getDate()).padStart(2,'0'); }
function plus(d, n){ var x = new Date(d); x.setDate(x.getDate()+n); return j0(x); }
var JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
var MOIS  = ['janvier','février','mars','avril','mai','juin','juillet','août',
             'septembre','octobre','novembre','décembre'];
function joli(d){ return JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()]; }

function maintenant(){
  var d = (C && C.date && C.date()) || new Date();
  return d instanceof Date ? d : new Date();
}

/* Le dimanche auquel se rattache le rendez-vous en cours, et où l'on en est.
   La fenêtre d'une semaine court du vendredi soir au jeudi suivant :
     vendredi soir, samedi, dimanche -> à l'heure
     lundi à jeudi                   -> en retard, rattrapable
     vendredi avant 18h              -> encore le retard de la semaine d'avant */
function fenetre(){
  var n = maintenant(), d = j0(n), jour = d.getDay(), h = n.getHours();
  var ouvert = (jour === 5 && h >= 18) || jour === 6 || jour === 0;
  var dim;
  if(ouvert){
    dim = (jour === 0) ? d : plus(d, jour === 5 ? 2 : 1);
    return { dim:dim, statut:'ouvert', retard:0 };
  }
  // sinon on travaille sur le dimanche qui vient de passer
  dim = plus(d, -(jour === 0 ? 0 : jour));
  var retard = Math.round((d - dim) / 86400000);
  return { dim:dim, statut:'retard', retard:retard };
}

/* ---------------------------------------------------------------- données */
function tout(){ return (C && C.lire && C.lire()) || {}; }
function fiche(k){ var t = tout(); return t[k] || null; }
function ecrire(k, champ, val){
  var t = tout();
  t[k] = t[k] || {};
  if(champ === 'note' && val && !t[k].sem && C && C.semaine){
    var sm = C.semaine(); if(sm && sm.n) t[k].sem = sm.n + ' · ' + (sm.titre || '');
  }
  if(val === '' || val === null || val === undefined) delete t[k][champ];
  else t[k][champ] = val;
  if(!t[k].note && !t[k].suite) delete t[k];
  if(C && C.ecrire) C.ecrire(t);
  if(C && C.enregistrer) C.enregistrer();
}
function dimanches(){ return Object.keys(tout()).sort(); }
function dimanchePrecedent(k){
  var l = dimanches().filter(function(x){ return x < k && tout()[x] && tout()[x].note; });
  return l.length ? l[l.length-1] : null;
}
/* Combien de dimanches d'affilée honorés, en remontant depuis celui-ci. */
function serie(){
  var f = fenetre(), d = f.dim, n = 0;
  if(!(fiche(cle(d)) && fiche(cle(d)).note)) d = plus(d, -7);
  while(fiche(cle(d)) && fiche(cle(d)).note){ n++; d = plus(d, -7); }
  return n;
}
/* Nombre de dimanches sautés d'affilée juste avant celui en cours. */
function sautes(){
  var f = fenetre(), d = plus(f.dim, -7), n = 0;
  while(n < 12 && !(fiche(cle(d)) && fiche(cle(d)).note)){ n++; d = plus(d, -7); }
  return n;
}

/* ------------------------------------------------- ce qui revient dans ses notes */
var VIDES = ('alors apres après aussi autre autres avait avant avec avoir bien cela cette ' +
 'chez comme comment dans deja déjà depuis donc elle elles encore entre etait était etre être ' +
 'fait faire fois jamais juste leur leurs mais meme même moins beaucoup pour pourquoi quand ' +
 'quelque quelques sans sous suis sur tout toute toutes tous très trop vers voila voilà vraiment ' +
 'peut peux plus rien parce parce-que quil qu-il elle-meme dont cest c-est jai j-ai etc jour ' +
 'jours semaine fin bien mal moment').split(/\s+/);
function mots(t){
  return String(t||'').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z\s'-]/g,' ').split(/[\s'-]+/)
    .filter(function(m){ return m.length >= 5 && VIDES.indexOf(m) === -1; });
}
/* Un mot qui apparaît dans au moins trois notes différentes mérite d'être renvoyé. */
function recurrent(){
  var t = tout(), cpt = {};
  Object.keys(t).forEach(function(k){
    if(!t[k].note) return;
    var vus = {};
    mots(t[k].note).forEach(function(m){ if(!vus[m]){ vus[m]=1; cpt[m]=(cpt[m]||0)+1; } });
  });
  var best = null;
  Object.keys(cpt).forEach(function(m){ if(cpt[m] >= 3 && (!best || cpt[m] > cpt[best])) best = m; });
  return best ? { mot:best, n:cpt[best] } : null;
}

/* ---------------------------------------------------------------- les questions */
/* Chaque axe donne une consigne d'écriture et une relance. La relance est posée
   sept jours plus tard, sur ce qu'il avait écrit. Elles tournent d'une semaine à
   l'autre pour qu'il ne réponde pas en pilote automatique. */
var BANQUE = {
  portillon: {
    nom: "l'ancrage au départ",
    notes: [
      "Note un moment de la semaine où la pression est montée au mauvais moment.",
      "Note une fois cette semaine où tu étais prêt physiquement, et pas dans ta tête.",
      "Note le moment exact, cette semaine, où tu as senti que ça partait trop vite dans ta poitrine.",
      "Note une situation de la semaine où tu aurais voulu appuyer sur pause deux secondes."
    ],
    suites: [
      "Qu'est-ce que ça t'a CONCRÈTEMENT rapporté ?",
      "Qu'est-ce que tu sais aujourd'hui que tu ne savais pas dimanche dernier ?",
      "Qu'est-ce que tu as fait DIFFÉREMMENT depuis, grâce à ça ?"
    ]
  },
  rumination: {
    nom: "vider le sac après",
    notes: [
      "Note un moment de la semaine où ça s'est mal passé.",
      "Note une chose que tu as ressassée cette semaine plus de deux heures après.",
      "Note l'erreur de la semaine qui t'est restée le plus longtemps dans la tête.",
      "Note un moment où tu es resté énervé alors que c'était déjà fini."
    ],
    suites: [
      "Qu'est-ce que ça t'a CONCRÈTEMENT rapporté ?",
      "Combien de temps ça t'a pris cette fois-ci, et combien la fois d'avant ? Le progrès est là.",
      "Qu'est-ce que tu as trouvé pour sortir de là ? Décris le geste, il te resservira."
    ]
  },
  confiance: {
    nom: "le carnet des preuves",
    notes: [
      "Note un moment de la semaine où tu ne t'es pas fait confiance.",
      "Note une fois cette semaine où tu as reculé alors que tu savais faire.",
      "Note une chose que tu as réussie cette semaine et que personne n'a vue.",
      "Note un moment où tu t'es comparé à quelqu'un d'autre, et ce que ça a donné."
    ],
    suites: [
      "Qu'est-ce que ça t'a CONCRÈTEMENT rapporté ?",
      "Est-ce que tu l'as refait depuis ? Dis où et quand.",
      "Si ça se représentait demain, tu ferais quoi exactement ? Une action, pas une intention."
    ]
  }
};
/* Le parent ne travaille pas un axe mental : il travaille, semaine après semaine, un
   réflexe à lui. La matière n'est donc jamais ce que l'enfant a raté, c'est ce que
   l'adulte a fait. Lui demander l'inverse le remettrait en position de juge, ce que ce
   protocole existe précisément pour défaire. */
var PARENT = {
  consigne: "Notez le moment de la semaine où vous avez fait l'inverse de ce qu'on travaille. "
          + "Pas ce que votre enfant a raté : ce que vous, vous avez fait.",
  amorce:   "Un réflexe qui est revenu, c'est de la matière. Pas une faute.",
  suite:    "Qu'est-ce que ça a <em>CONCRÈTEMENT</em> changé chez ",
  suiteP:   "Pas ce que vous avez ressenti, vous. Ce que vous avez vu chez lui, dans les faits, cette semaine.",
  rappel:   "Je l'ai fait moi-même, et pendant des années. Ce qui n'a pas marché cette semaine "
          + "est la seule chose qui vous apprenne quelque chose, et c'est pour ça qu'on l'écrit. "
          + "Personne ne note personne ici.",
  titreSuite: "CE QUE LA SEMAINE DERNIÈRE VOUS A RAPPORTÉ",
  attente:  "VOTRE RENDEZ-VOUS VOUS ATTEND",
  attenteP: function(j, reste){ return "Celui de " + j + " n'est pas encore fait, et ce n'est pas grave : "
            + "il reste ouvert " + (reste > 0 ? reste + " jour" + (reste > 1 ? "s" : "") : "encore un peu")
            + ". Un quart d'heure, et vous repartez avec quelque chose."; },
  ok1:      "✓ Voilà ce que cette semaine vous a rapporté. C'est exactement ce qu'on cherche.",
  ok2:      "✓ Noté. Dimanche prochain, on regarde ce que ça a changé chez lui."
};

function axe(){
  var a = (C && C.axe && C.axe()) || 'portillon';
  return BANQUE[a] ? a : 'portillon';
}
/* L'index tourne avec le numéro de semaine ISO, donc jamais deux fois de suite pareil. */
function rang(d){ return Math.floor((d.getTime() / 86400000 + 4) / 7); }

function consigne(d){
  if(PROFIL === 'parent') return PARENT.consigne;
  var b = BANQUE[axe()], bloc = (C && C.bloc && C.bloc()) || '';
  var t = b.notes[rang(d) % b.notes.length];
  if(bloc) t += ' Si tu peux, prends-le sur « ' + bloc + ' », c\'est ce que tu travailles ce mois-ci.';
  return t;
}
function relance(d, noteAvant){
  if(PROFIL === 'parent'){
    var pe = (C && C.enfant && C.enfant()) || '';
    return { q: PARENT.suite + (pe || 'lui') + '&nbsp;?', p: PARENT.suiteP };
  }
  var b = BANQUE[axe()];
  var r = recurrent();
  if(r && r.n >= 3 && (rang(d) % 2 === 0)){
    return { q: 'Qu\'est-ce que ça t\'a <em>CONCRÈTEMENT</em> rapporté&nbsp;?',
             p: 'Et une remarque : le mot « ' + r.mot + ' » revient dans ' + r.n
                + ' de tes notes. Tu as mis le doigt sur quelque chose. Tu en penses quoi, toi ?' };
  }
  return { q: b.suites[rang(d) % b.suites.length].replace(/CONCRÈTEMENT|DIFFÉREMMENT/, function(m){ return '<em>'+m+'</em>'; }),
           p: 'Un truc raté, c\'est une information que les autres n\'ont pas. Reste à savoir ce que tu en as fait. '
              + 'Pas ce que tu as ressenti : ce qui a bougé dans les faits.' };
}

/* ---------------------------------------------------------------- rendu */
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

function html(){
  var f = fenetre(), k = cle(f.dim), moi = fiche(k) || {};
  var kAvant = dimanchePrecedent(k), avant = kAvant ? fiche(kAvant) : null;
  var h = '';

  /* --- l'alerte, du plus calme au plus voyant --- */
  if(f.statut === 'retard' && !moi.note){
    var s = sautes();
    var reste = Math.max(0, 5 - f.retard);
    if(s >= 2){
      h += '<div class="rdv-alerte"><b>ON REPART DE CELUI-CI</b>'
         + '<p>Il n\'a pas été fait depuis un moment. On ne rattrape pas les précédents et '
         + 'on ne compte pas les points : celui-ci suffit. Un quart d\'heure, juste en dessous.</p></div>';
    } else {
      h += PROFIL === 'parent'
        ? '<div class="rdv-alerte"><b>' + PARENT.attente + '</b><p>' + PARENT.attenteP(joli(f.dim), reste) + '</p></div>'
        : '<div class="rdv-alerte"><b>TON RENDEZ-VOUS T\'ATTEND</b>'
         + '<p>Celui de ' + joli(f.dim) + ' n\'est pas encore fait, et ce n\'est pas grave : '
         + 'il reste ouvert ' + (reste > 0 ? reste + ' jour' + (reste > 1 ? 's' : '') : 'encore un peu')
         + '. Un quart d\'heure, et tu repars avec quelque chose.</p></div>';
    }
  }

  h += '<div class="rdv' + (moi.note ? ' fait' : '') + (f.statut === 'retard' && !moi.note ? ' tard' : '') + '">';
  h += '<div class="rdv-tete"><div class="q">'
     + (PROFIL === 'parent' ? 'Rendez-vous parent' : 'Rendez-vous mental') + '</div>'
     + '<div class="t">DIMANCHE</div>'
     + '<div class="s">Un quart d\'heure, une fois par semaine. Celui du ' + joli(f.dim) + '.</div>';
  var n = serie(), tot = dimanches().filter(function(k){ var e = tout()[k]; return e && e.note; }).length;
  if(PROFIL === 'parent'){
    var sm = (C && C.semaine && C.semaine()) || {n:1};
    h += '<div class="rdv-serie">';
    for(var i=0;i<4;i++) h += '<i class="' + (i < Math.min(tot,4) ? 'on' : '') + '"></i>';
    h += '<span>Semaine ' + Math.min(sm.n || 1, 4) + ' sur 4 · ' + tot + ' rendez-vous fait'
       + (tot>1?'s':'') + '</span></div>';
  } else if(tot > 0){
    h += '<div class="rdv-serie">';
    for(var i=0;i<7;i++) h += '<i class="' + (i < Math.min(n,7) ? 'on' : '') + '"></i>';
    h += '<span>' + tot + ' rendez-vous fait' + (tot>1?'s':'')
       + (n > 1 ? ' · ' + n + ' d\'affilée' : '') + '</span></div>';
  }
  h += '</div><div class="rdv-corps">';

  /* --- 1. la relance sur la note de la semaine d'avant --- */
  if(avant && avant.note){
    var r = relance(f.dim, avant.note);
    h += '<div class="rdv-bloc' + (avant.suite ? ' ok' : '') + '">'
       + '<h3>' + (PROFIL === 'parent' ? PARENT.titreSuite : 'CE QUE LA SEMAINE DERNIÈRE T\'A RAPPORTÉ') + '</h3>'
       + (avant.sem ? '<div class="rdv-amorce">Semaine ' + esc(avant.sem) + '</div>' : '')
       + '<div class="rdv-cit">«&nbsp;' + esc(avant.note) + '&nbsp;»</div>'
       + '<div class="rdv-q">' + r.q + '</div>'
       + '<div class="rdv-p">' + esc(r.p).replace('&lt;em&gt;','<em>') + '</div>'
       + '<textarea class="rdv-champ" data-rdv="suite" data-cle="' + kAvant + '" '
       + 'placeholder="' + (PROFIL === 'parent' ? 'Ce que vous avez vu, deux ou trois lignes.'
            : 'Écris ici, deux ou trois lignes suffisent.') + '">' + esc(avant.suite || '') + '</textarea>'
       + (avant.suite ? '<div class="rdv-ok">' + (PROFIL === 'parent' ? PARENT.ok1
            : '✓ Voilà ce que cette semaine t\'a rapporté. C\'est exactement ce qu\'on cherche.') + '</div>' : '')
       + '</div>';
  }

  /* --- 2. la note de cette semaine --- */
  h += '<div class="rdv-bloc' + (moi.note ? ' ok' : '') + '">'
     + '<h3>' + (avant && avant.note ? 'ENSUITE, CETTE SEMAINE' : 'CETTE SEMAINE') + '</h3>'
     + (function(){
         if(PROFIL !== 'parent') return '<div class="rdv-amorce">Un moment qui n\'a pas marché, c\'est de la matière. Pas un problème.</div>';
         var sm = (C && C.semaine && C.semaine()) || null;
         return (sm && sm.n ? '<div class="rdv-amorce">Semaine ' + sm.n + ' · ' + esc(sm.titre || '') + '</div>' : '')
              + '<div class="rdv-amorce" style="color:var(--dim);letter-spacing:0;text-transform:none;font-weight:400">'
              + PARENT.amorce + '</div>';
       })()
     + '<div class="rdv-cons">' + esc(consigne(f.dim)) + '</div>'
     + '<textarea class="rdv-champ" data-rdv="note" data-cle="' + k + '" '
     + 'placeholder="' + (PROFIL === 'parent'
          ? 'Le jour, l\'endroit, ce que vous avez dit ou fait. Deux ou trois lignes.'
          : 'Un moment précis. Le jour, l\'endroit, ce qui s\'est passé.') + '">' + esc(moi.note || '') + '</textarea>'
     + (moi.note ? '<div class="rdv-ok">' + (PROFIL === 'parent' ? PARENT.ok2
          : '✓ Noté. Dimanche prochain, on regarde ce que ça t\'a rapporté.') + '</div>' : '')
     + '</div>';

  h += '<div class="rdv-rappel">' + (PROFIL === 'parent' ? PARENT.rappel
     : 'Ici, on ne note rien et on ne juge rien. Ce qui n\'a pas marché cette semaine est la seule '
     + 'chose qui t\'apprenne quelque chose, et c\'est pour ça qu\'on l\'écrit. Fabien lit ces notes : '
     + 'c\'est à partir d\'elles qu\'il construit ton mois suivant.') + '</div>';
  h += '</div></div>';
  return h;
}

function monter(zone){
  ZONE = zone || ZONE;
  if(!ZONE) return;
  ZONE.innerHTML = html();
  ZONE.querySelectorAll('[data-rdv]').forEach(function(t){
    t.addEventListener('input', function(){
      ecrire(t.dataset.cle, t.dataset.rdv, t.value.trim());
    });
    t.addEventListener('blur', function(){
      var av = ZONE.scrollTop; monter(ZONE); ZONE.scrollTop = av;
    });
  });
}

/* Ce que l'accueil du protocole doit savoir pour afficher sa propre ligne de rappel. */
function etat(){
  var f = fenetre(), k = cle(f.dim), m = fiche(k) || {};
  return { dimanche:k, joli:joli(f.dim), statut: m.note ? 'fait' : f.statut,
           retard:f.retard, serie:serie(), sautes:sautes() };
}

window.AxeRdv = { init:function(o){ C = o || {}; PROFIL = (C.profil === 'parent') ? 'parent' : 'sportif'; },
                  monter:monter, html:html, etat:etat,
                  fenetre:fenetre, recurrent:recurrent };
})();
