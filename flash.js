/* =====================================================================================
   PROTOCOLE FLASH · la banque d'actions
   -------------------------------------------------------------------------------------
   Vingt blocages, six moments. À chaque croisement, une ou deux actions concrètes :
   une respiration, un mouvement, une visualisation ou une parole. Rien à lire pendant
   des minutes, des choses à FAIRE.

     ACTION 1  vient du BLOCAGE   · 20 textes
     ACTION 2  vient du MOMENT    ·  6 textes

   Vingt-six textes pour une centaine de combinaisons. L'âge change le registre et la
   dose, le sport remplace des mots par LEX, le niveau ajuste une ligne. Un blocage de
   plus coûte un texte, pas six.

   RÈGLE D'ÉCRITURE, et elle n'est pas négociable : on ne promet jamais que ça marche,
   on ne dit jamais que ça va partir, et un moment raté est toujours de la matière.
   L'échec apporte un bénéfice, c'est la méthode, elle est partout ici.
   ===================================================================================== */
(function(){
'use strict';

/* ---------------------------------------------------------------- les familles */
var FAMILLES = [
  { cle:'a', nom:'Avant, quand ça monte' },
  { cle:'b', nom:'Pendant, quand ça tourne en boucle' },
  { cle:'c', nom:'Quand je ne me sens pas à la hauteur' },
  { cle:'d', nom:'Après, quand ça ne redescend pas' }
];

/* ---------------------------------------------------------------- les vingt blocages */
var BLOCAGES = [
  { k:'a_rater',      f:'a', t:"J'ai peur de rater devant tout le monde" },
  { k:'a_mal',        f:'a', t:"J'ai peur de me faire mal" },
  { k:'a_decevoir',   f:'a', t:"J'ai peur de décevoir quelqu'un" },
  { k:'a_nouveau',    f:'a', t:"C'est nouveau, je ne sais pas à quoi m'attendre" },
  { k:'a_vite',       f:'a', t:"Je suis surexcité, je pars toujours trop vite" },
  { k:'a_concentre',  f:'a', t:"Je n'arrive pas à me concentrer, je pense à autre chose" },
  { k:'a_ventre',     f:'a', t:"J'ai mal au ventre, j'ai envie de vomir" },

  { k:'b_erreur',     f:'b', t:"Je repasse mon erreur en boucle" },
  { k:'b_injustice',  f:'b', t:"Je rumine une injustice, un arbitrage, une sélection" },
  { k:'b_colere',     f:'b', t:"Je suis en colère contre quelqu'un" },
  { k:'b_abandon',    f:'b', t:"J'ai envie de tout arrêter là, maintenant" },
  { k:'b_relance',    f:'b', t:"Je n'arrive pas à me remettre dedans après la pause" },

  { k:'c_compare',    f:'c', t:"Je me compare aux autres" },
  { k:'c_echauffement',f:'c',t:"Mon corps ne répond pas, je me sens lourd" },
  { k:'c_blessure',   f:'c', t:"Je reviens de blessure et j'ai peur" },
  { k:'c_niveau',     f:'c', t:"On m'a dit que je n'avais pas le niveau" },
  { k:'c_serie',      f:'c', t:"J'enchaîne les mauvais résultats, je n'y crois plus" },
  { k:'c_pression',   f:'c', t:"On me met la pression, mes parents ou mon coach" },

  { k:'d_honte',      f:'d', t:"Je m'en veux, j'ai honte de ce que j'ai fait" },
  { k:'d_dormir',     f:'d', t:"Je n'arrive pas à dormir après" }
];

/* ---------------------------------------------------------------- les six moments */
var MOMENTS = [
  { k:'veille',      t:"La veille, dans la journée" },
  { k:'veille_soir', t:"La veille au soir" },
  { k:'jour',        t:"Le jour même, avant" },
  { k:'pendant',     t:"Pendant, ou entre deux" },
  { k:'apres',       t:"Juste après" },
  { k:'lendemain',   t:"Le lendemain" }
];

/* La grille est creuse, et c'est voulu. Une peur d'avant n'existe plus le lendemain :
   elle est devenue autre chose, et cette autre chose a son propre protocole. La page ne
   dit jamais non, elle redirige. */
var GRILLE = {
  a_rater:        ['veille','veille_soir','jour','pendant'],
  a_mal:          ['veille','veille_soir','jour','pendant','apres'],
  a_decevoir:     ['veille','veille_soir','jour','pendant','apres','lendemain'],
  a_nouveau:      ['veille','veille_soir','jour','pendant'],
  a_vite:         ['jour','pendant','apres'],
  a_concentre:    ['veille_soir','jour','pendant'],
  a_ventre:       ['veille_soir','jour','pendant'],
  b_erreur:       ['jour','pendant','apres','lendemain'],
  b_injustice:    ['pendant','apres','lendemain'],
  b_colere:       ['pendant','apres','lendemain'],
  b_abandon:      ['jour','pendant','apres','lendemain'],
  b_relance:      ['pendant'],
  c_compare:      ['veille','veille_soir','jour','pendant','lendemain'],
  c_echauffement: ['jour','pendant'],
  c_blessure:     ['veille','veille_soir','jour','pendant','apres'],
  c_niveau:       ['veille','veille_soir','jour','pendant','apres','lendemain'],
  c_serie:        ['veille','veille_soir','jour','pendant','apres','lendemain'],
  c_pression:     ['veille','veille_soir','jour','pendant','apres','lendemain'],
  d_honte:        ['apres','lendemain'],
  d_dormir:       ['veille_soir','apres','lendemain']
};
var RENVOI = {
  a_rater:    { apres:'d_honte', lendemain:'b_erreur' },
  a_mal:      { lendemain:'c_blessure' },
  a_nouveau:  { apres:'d_honte', lendemain:'b_erreur' },
  a_vite:     { veille:'a_rater', veille_soir:'a_rater', lendemain:'b_erreur' },
  a_concentre:{ veille:'a_rater', apres:'d_honte', lendemain:'b_erreur' },
  a_ventre:   { veille:'a_rater', apres:'d_honte', lendemain:'b_erreur' },
  b_erreur:   { veille:'a_rater', veille_soir:'a_rater' },
  b_injustice:{ veille:'a_rater', veille_soir:'a_rater', jour:'c_pression' },
  b_colere:   { veille:'a_rater', veille_soir:'a_rater', jour:'c_pression' },
  b_abandon:  { veille:'c_serie', veille_soir:'c_serie' },
  b_relance:  { veille:'a_rater', veille_soir:'a_rater', jour:'a_concentre',
                apres:'d_honte', lendemain:'b_erreur' },
  c_compare:  { apres:'d_honte' },
  c_echauffement:{ veille:'a_rater', veille_soir:'a_rater', apres:'d_honte', lendemain:'b_erreur' },
  c_blessure: { lendemain:'b_erreur' },
  d_honte:    { veille:'a_rater', veille_soir:'a_rater', jour:'a_rater', pendant:'b_erreur' },
  d_dormir:   { veille:'a_rater', jour:'a_rater', pendant:'b_relance' }
};

/* ---------------------------------------------------------------- le lexique du sport */
var LEX = {
  defaut:  { action:"ta première action", lieu:"le terrain", depart:"le départ", pairs:"les autres",
             unite:"ton épreuve", risque:"le geste que tu redoutes", court:"les deux premières minutes" },
  bmx:     { action:"ta sortie de gate", lieu:"la piste", depart:"la gate", pairs:"les autres pilotes",
             unite:"ta manche", risque:"le saut ou le virage que tu redoutes", court:"la première ligne droite" },
  motocross:{action:"ta sortie de grille", lieu:"la piste", depart:"la grille", pairs:"les autres pilotes",
             unite:"ta manche", risque:"le saut que tu redoutes", court:"le premier virage" },
  football:{ action:"ton premier ballon", lieu:"le terrain", depart:"le coup d'envoi", pairs:"les autres joueurs",
             unite:"ton match", risque:"le duel que tu redoutes", court:"les cinq premières minutes" },
  rugby:   { action:"ton premier plaquage", lieu:"le terrain", depart:"le coup d'envoi", pairs:"les autres joueurs",
             unite:"ton match", risque:"le contact que tu redoutes", court:"les cinq premières minutes" },
  handball:{ action:"ton premier ballon", lieu:"le terrain", depart:"le coup d'envoi", pairs:"les autres joueurs",
             unite:"ton match", risque:"le contact que tu redoutes", court:"les cinq premières minutes" },
  basket:  { action:"ta première passe", lieu:"le parquet", depart:"l'entre-deux", pairs:"les autres joueurs",
             unite:"ton match", risque:"le duel que tu redoutes", court:"les trois premières minutes" },
  volley:  { action:"ton premier service", lieu:"le terrain", depart:"le premier point", pairs:"les autres joueurs",
             unite:"ton set", risque:"le geste que tu rates en ce moment", court:"les cinq premiers points" },
  tennis:  { action:"ton premier service", lieu:"le court", depart:"le premier point", pairs:"ton adversaire",
             unite:"ton match", risque:"le coup que tu rates en ce moment", court:"le premier jeu" },
  pingpong:{ action:"ton premier service", lieu:"la table", depart:"le premier point", pairs:"ton adversaire",
             unite:"ton set", risque:"le coup que tu rates en ce moment", court:"les cinq premiers points" },
  natation:{ action:"ton départ du plot", lieu:"le bassin", depart:"le signal", pairs:"les autres nageurs",
             unite:"ta course", risque:"le virage que tu redoutes", court:"la première longueur" },
  athletisme:{action:"ton premier appui", lieu:"la piste", depart:"le coup de pistolet", pairs:"les autres",
             unite:"ta course", risque:"le départ que tu redoutes", court:"les trente premiers mètres" },
  judo:    { action:"ta première saisie", lieu:"le tatami", depart:"le hajime", pairs:"ton adversaire",
             unite:"ton combat", risque:"la projection que tu redoutes", court:"les trente premières secondes" },
  gym:     { action:"ton premier élément", lieu:"le praticable", depart:"le signal du juge", pairs:"les autres",
             unite:"ton passage", risque:"l'élément que tu redoutes", court:"la première série" },
  escalade:{ action:"ton premier mouvement", lieu:"le mur", depart:"le départ de la voie", pairs:"les autres grimpeurs",
             unite:"ta voie", risque:"le pas que tu redoutes", court:"les trois premières prises" },
  equitation:{action:"ton premier obstacle", lieu:"la carrière", depart:"l'entrée en piste", pairs:"les autres cavaliers",
             unite:"ton parcours", risque:"l'obstacle que tu redoutes", court:"les trois premiers obstacles" },
  danse:   { action:"ton premier mouvement", lieu:"la scène", depart:"la première mesure", pairs:"les autres",
             unite:"ton passage", risque:"le passage que tu redoutes", court:"les huit premiers temps" },
  ski:     { action:"ta première porte", lieu:"la piste", depart:"le portillon", pairs:"les autres",
             unite:"ta manche", risque:"le passage que tu redoutes", court:"les cinq premières portes" }
};
function sportKey(s){
  var t=String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
  if(/bmx/.test(t)) return 'bmx';
  if(/moto/.test(t)) return 'motocross';
  if(/foot|futsal/.test(t)) return 'football';
  if(/rugby/.test(t)) return 'rugby';
  if(/hand/.test(t)) return 'handball';
  if(/basket/.test(t)) return 'basket';
  if(/volley/.test(t)) return 'volley';
  if(/ping|tennis de table/.test(t)) return 'pingpong';
  if(/tennis|badmin|squash/.test(t)) return 'tennis';
  if(/natation|nage|swim/.test(t)) return 'natation';
  if(/athle|course a pied|sprint|demi.fond|trail/.test(t)) return 'athletisme';
  if(/judo|karate|lutte|boxe|combat|taekwon/.test(t)) return 'judo';
  if(/gym|trampoline|cheer/.test(t)) return 'gym';
  if(/escalade|grimpe|bloc/.test(t)) return 'escalade';
  if(/equit|cheval|poney|cso/.test(t)) return 'equitation';
  if(/danse|patin/.test(t)) return 'danse';
  if(/ski|snow|surf/.test(t)) return 'ski';
  return 'defaut';
}

/* ---------------------------------------------------------------- ACTION 1, par blocage
   Chaque entrée : type, titre, durée en secondes, texte.
   {action} {lieu} {depart} {pairs} {unite} {risque} {court} sont remplacés par le sport. */
var A1 = {
  a_rater: { type:'parole', titre:'Compte ceux qui comptent', sec:45,
    txt:"Tu n'as pas peur de rater. Tu as peur qu'on te voie rater. Alors compte, sur tes doigts, les gens dont l'avis compte vraiment pour toi. Pas ceux qui regardent : ceux dont l'avis compte. Tu vas t'arrêter à un, deux, rarement trois. Les autres ne te regardent pas, ils attendent leur tour." },
  a_mal: { type:'mouvement', titre:'Refais le geste en petit', sec:60,
    txt:"Dis à voix basse ce que tu crains précisément : {risque}. Puis fais-le en petit, trois fois. La moitié du mouvement, au ralenti, sans engagement. Ton corps a besoin de refaire le geste avant d'y croire, et il n'a pas besoin de le faire en entier pour ça." },
  a_decevoir: { type:'attention', titre:'Trouve-la des yeux', sec:30,
    txt:"Nomme la personne dans ta tête, en entier. Puis tourne-toi, trouve-la des yeux, deux secondes, et reviens. Ne lui fais pas signe. Tu viens de vérifier qu'elle est là, et ta tête n'a plus besoin d'y retourner toutes les trente secondes." },
  a_nouveau: { type:'visualisation', titre:'Fabrique-toi une image', sec:60,
    txt:"Tu n'as peur de rien de précis, tu as du vide. Alors remplis-le. Les yeux fermés, fabrique l'image de {court} seulement : où tu es, ce que tu fais en premier, qui est à côté. Pas la fin, pas le résultat. Une tête qui a une image arrête d'en inventer des mauvaises." },
  a_vite: { type:'mouvement', titre:'Brûle le trop-plein', sec:45,
    txt:"Ce n'est pas de la peur, c'est du carburant mal rangé. Serre les poings à fond cinq secondes, puis relâche d'un coup. Trois fois. Ensuite, et seulement ensuite, décide à voix basse la seule chose que tu feras sur {court}." },
  a_concentre: { type:'attention', titre:'Trois choses, puis une', sec:45,
    txt:"Nomme à voix basse trois choses que tu vois sur {lieu}, puis deux que tu entends, puis une que tu sens sous tes pieds. Quand tu as fini, choisis un seul point devant toi et reste dessus cinq secondes. Ta tête n'était pas ailleurs par hasard : elle cherchait où se poser." },
  a_ventre: { type:'respiration', titre:'Vide, puis laisse revenir', sec:60,
    txt:"Ce que tu sens au ventre, c'est ton corps qui se prépare, pas un problème de digestion. Debout, expire à fond en rentrant le ventre, vide tout, et attends deux secondes avant de laisser l'air revenir tout seul. Six fois. Ne force jamais l'inspiration." }
  ,
  b_erreur: { type:'parole', titre:'Trois phrases, dans l\'ordre', sec:60,
    txt:"Dis trois choses à voix basse, dans cet ordre. Ce qui s'est passé, en une phrase, sans adjectif. Ce que tu feras différemment la prochaine fois, une action. Et une chose que tu as bien faite dans la même {unite}. La troisième est obligatoire : sans elle tu ne construis rien, tu te punis." },
  b_injustice: { type:'mouvement', titre:'Serre dix secondes', sec:45,
    txt:"Tu as raison d'être en colère, et ça ne changera pas la décision. Les deux sont vrais en même temps. Serre quelque chose de toutes tes forces pendant dix secondes pleines, une serviette, le bord d'une table, tes propres mains. Puis relâche. Cette colère-là est physique avant d'être mentale." },
  b_colere: { type:'parole', titre:'Dis-la une fois, pour toi', sec:45,
    txt:"Dis à voix basse la phrase entière que tu aurais voulu lui dire. En entier, sans la filtrer, pour toi seul. Puis pose-toi une question : est-ce que tu veux vraiment la lui dire, ou est-ce que tu voulais juste la formuler une fois ? Les trois quarts du temps, la formuler suffit." },
  b_abandon: { type:'attention', titre:'Réduis à la prochaine', sec:45,
    txt:"Ne décide rien maintenant. Une envie d'arrêter au milieu de {unite} n'est pas une décision, c'est de la fatigue qui parle. Réduis tout à la prochaine action, une seule : {action}. Tu décideras du reste ce soir, à froid, et tu auras le droit de décider d'arrêter. Mais pas ici." },
  b_relance: { type:'mouvement', titre:'Réveille avant de repartir', sec:60,
    txt:"Un corps qui s'est arrêté ne redémarre pas en y pensant. Dix sauts sur place, puis dix montées de genoux, puis deux accélérations de cinq mètres. Ensuite seulement, redis-toi ce que tu fais sur {court}. L'ordre compte : le corps d'abord, la consigne après." }
  ,
  c_compare: { type:'parole', titre:'Rends la comparaison honnête', sec:60,
    txt:"Reprends celui à qui tu te compares et compte ce que tu avais oublié : depuis quand il pratique, combien de séances par semaine, quel âge. Tu vas trouver au moins un écart. Puis change la question : au lieu de savoir si tu es meilleur que lui, demande-toi si tu es meilleur que toi il y a trois mois. À celle-là, tu peux répondre." },
  c_echauffement: { type:'mouvement', titre:'Monte en température', sec:90,
    txt:"Un corps qui ne répond pas n'est pas un mauvais présage, c'est une question de température. Trente secondes de montées de genoux, dix fentes, puis deux accélérations progressives. Pas d'intensité, du mouvement. Et sur {court}, pars plus prudemment que prévu, c'est une décision, pas un renoncement." },
  c_blessure: { type:'mouvement', titre:'Reprends possession', sec:60,
    txt:"Ton corps est réparé, ta tête ne le sait pas encore, et c'est normal : elle va toujours plus lentement. Pose la main sur l'endroit qui a été blessé, dix secondes, et bouge-le lentement dans l'amplitude qui ne fait pas mal, en le regardant. C'est la façon la plus simple de lui dire que cette partie-là t'appartient de nouveau." },
  c_niveau: { type:'parole', titre:'Transforme la phrase en chiffre', sec:60,
    txt:"« Tu n'as pas le niveau » ne veut rien dire : le niveau de quoi, mesuré comment, sur quelle période. Choisis maintenant un seul chiffre que tu peux suivre toi-même chaque semaine, un temps, un nombre de réussites, une distance. À partir d'aujourd'hui c'est ce chiffre qui répond à cette personne, pas toi." },
  c_serie: { type:'parole', titre:'Sors une preuve datée', sec:60,
    txt:"Une série de mauvais résultats ne dit pas ce que tu vaux, elle dit ce qui s'est passé. Trouve une chose que tu as réussie ces quinze derniers jours, une seule, et redis-la à voix basse avec le jour et l'endroit. Précise. Pas « je roule bien » mais « mardi, au troisième passage, je l'ai eu ». Une preuve datée vaut dix encouragements." },
  c_pression: { type:'parole', titre:'Sépare ce qu'+"'"+'on attend de ce que tu fais', sec:60,
    txt:"Dis à voix basse ce que tu crois qu'on attend de toi aujourd'hui. Puis dis ce que toi tu vas faire sur {court}. Ce sont deux phrases différentes, et seule la deuxième dépend de toi. Tu ne joues pas pour leur attente, tu joues devant eux. Ce n'est pas la même chose, et ça change tout." }
  ,
  d_honte: { type:'parole', titre:'Décris sans te juger', sec:60,
    txt:"La honte, c'est le jugement collé au souvenir. Alors sépare-les. Raconte à voix basse ce qui s'est passé, seulement les faits, sans un seul adjectif sur toi. Puis ajoute une phrase, une seule : ce que ça t'apprend. Ce qui vient de se passer te servira, et c'est maintenant que ça se décide, pas dans six mois." },
  d_dormir: { type:'parole', titre:'Ferme le dossier par écrit', sec:90,
    txt:"Tu ne dors pas parce que ta journée n'est pas finie dans ta tête. Prends ton téléphone ou un papier et écris deux lignes, pas plus : ce qui s'est passé, et la seule chose que tu feras demain à cause de ça. Le dossier est écrit, il n'a plus besoin d'être tenu ouvert. Puis repose le téléphone, écran vers le bas." }
};

/* ---------------------------------------------------------------- ACTION 2, par moment */
var A2 = {
  veille: { type:'respiration', titre:'Pose le rythme', sec:60,
    txt:"Assis, inspire 4 secondes, expire 6, dix fois, en comptant. Si tu perds le compte, tu reprends à un : reprendre à un, c'est l'exercice, ce n'est pas un échec. Tu as encore une nuit devant toi, rien ne se joue aujourd'hui." },
  veille_soir: { type:'respiration', titre:'Redescends par les pieds', sec:90,
    txt:"Allongé, lumière éteinte. Inspire 4, expire 6, douze fois. Puis pose les deux pieds à plat et sens-les pendant trente secondes. Le soir, la tête tourne plus vite que le corps, et c'est par le corps qu'on la rattrape. Le but n'est pas de t'endormir, c'est de faire baisser le rythme avant qu'elle reparte." },
  jour: { type:'respiration', titre:'Debout, cinq souffles', sec:60,
    txt:"Debout, ne t'assieds pas. D'abord dix sauts souples pour réveiller le corps, parce qu'une respiration sur un corps froid ne descend nulle part. Ensuite inspire 4, expire 6, cinq fois, en regardant un point fixe devant toi. Expirer plus longtemps que tu n'inspires fait baisser le cœur : ce n'est pas une croyance, c'est mécanique." },
  pendant: { type:'respiration', titre:'Un souffle, deux relâchements', sec:30,
    txt:"Tu as peu de temps, donc deux choses. Expire à fond une fois, en vidant tout. Puis relâche les épaules et desserre les mâchoires. C'est là que ça se crispe en premier, et une mâchoire serrée tient toute la chaîne jusqu'aux jambes." },
  apres: { type:'mouvement', titre:'Marche trente secondes', sec:45,
    txt:"Marche. Trente secondes, n'importe où, sans parler à personne. Inspire 4, expire 6 en marchant. Juste après, le corps est encore plein : t'asseoir tout de suite enferme tout dedans. Tu parleras après, pas maintenant." },
  lendemain: { type:'parole', titre:'Deux lignes, et c\'est tout', sec:60,
    txt:"Écris deux lignes, où tu veux : ce qui s'est passé, et ce que ça t'a appris. Même si ça s'est mal passé. Surtout si ça s'est mal passé. C'est la seule chose d'hier que tu peux encore transformer en quelque chose d'utile, et après ça, tu passes à autre chose pour de bon." }
};

/* La même seconde action, d'un AUTRE type. On s'en sert quand la première action tombe
   déjà dans la même famille : deux respirations à la suite, ou deux textes à dire, et le
   protocole perd la moitié de son intérêt. Deux leviers différents valent mieux qu'un
   levier appuyé deux fois. */
var A2_BIS = {
  veille: { type:'visualisation', titre:'Vois-toi demain, deux minutes', sec:60,
    txt:"Les yeux fermés, déroule seulement {court} de demain. Où tu es, ce que tu fais en premier, à quoi ça ressemble autour. Pas le résultat, pas la fin. Si l'image part ailleurs, tu la ramènes au début et tu recommences, c'est normal qu'elle parte." },
  veille_soir: { type:'mouvement', titre:'Relâche de haut en bas', sec:90,
    txt:"Allongé, contracte le visage trois secondes puis relâche. Puis les épaules. Puis les mains. Puis les cuisses. Puis les mollets. Trois secondes de contraction, cinq de relâchement, en descendant. On ne demande pas au corps de se détendre, on lui montre la différence." },
  jour: { type:'attention', titre:'Un point, puis ta première action', sec:45,
    txt:"Choisis un point fixe devant toi, loin, qui n'est ni {pairs} ni quelqu'un que tu connais. Un panneau, un poteau, une ligne. Reste dessus cinq secondes pleines. Puis dis à voix basse ce que tu fais en premier : {action}. Ce point devient l'endroit où tu reviens chaque fois que ça repart." },
  pendant: { type:'attention', titre:'Reviens à une seule chose', sec:30,
    txt:"Une chose, pas deux : {action}. Dis-la dans ta tête, regarde l'endroit où elle va se passer, et vas-y. Tout le reste attendra la fin, et la plupart du temps le reste n'existera plus." },
  apres: { type:'parole', titre:'Une phrase pour ce soir', sec:45,
    txt:"Garde une seule phrase en tête pour ce soir : une chose qui a marché, une chose à revoir. Tu ne l'écris pas maintenant, tu y penses juste. Ce qui vient de se passer te servira, que ce soit bien passé ou non, et ce soir tu sauras en quoi." },
  lendemain: { type:'mouvement', titre:'Bouge pour tourner la page', sec:60,
    txt:"Sors et marche cinq minutes, ou fais vingt pas dehors si tu n'as que ça. Pendant ces pas, dis à voix basse la seule consigne que tu gardes pour la prochaine fois, une fois par pas. Un corps qui bouge coupe une boucle mieux que n'importe quelle décision prise assis." }
};

/* ---------------------------------------------------------------- l'âge */
function bande(age){
  var a = Number(age) || 15;
  if(a < 12) return 'enfant';
  if(a <= 15) return 'jeune';
  if(a <= 17) return 'ado';
  return 'adulte';
}
var DOSE = { enfant:0.7, jeune:0.85, ado:1, adulte:1 };
var MOT_AGE = {
  enfant: "Ton enfant a moins de douze ans. Ce protocole s'adresse à vous, pas à lui : à cet âge, ce qui compte, c'est ce qui l'entoure dans les trois minutes qui suivent. Faites les actions avec lui, sans jamais lui expliquer pourquoi, et ne lui demandez pas si ça a marché.",
  jeune:  "Fais-les dans l'ordre et jusqu'au bout. C'est court exprès.",
  ado:    "Dans l'ordre, sans sauter la première : c'est elle qui rend la seconde utile.",
  adulte: "Dans l'ordre. La première nomme, la seconde fait redescendre."
};
var NIVEAU_LIGNE = {
  loisir: "Vise petit aujourd'hui : une seule action réussie suffit à faire de ce jour un bon jour.",
  club:   "Vise juste : deux ou trois actions propres, pas un enchaînement parfait.",
  haut:   "Tiens ton plan sur les deux premières minutes, et réévalue après."
};
function niveauCle(n){
  var t=String(n||'').toLowerCase();
  if(/national|inter|elite|haut/.test(t)) return 'haut';
  if(/regional|régional|departement|département|club/.test(t)) return 'club';
  return 'loisir';
}

/* ---------------------------------------------------------------- composition */
function lex(sport){ return LEX[sportKey(sport)] || LEX.defaut; }
function remplir(txt, sport){
  var l = lex(sport);
  return String(txt||'')
    .replace(/\{action\}/g,l.action).replace(/\{lieu\}/g,l.lieu)
    .replace(/\{depart\}/g,l.depart).replace(/\{pairs\}/g,l.pairs)
    .replace(/\{unite\}/g,l.unite).replace(/\{risque\}/g,l.risque)
    .replace(/\{court\}/g,l.court);
}
function composer(blocage, moment, profil){
  profil = profil || {};
  var b = bande(profil.age), d = DOSE[b] || 1;
  var a1 = A1[blocage], a2 = A2[moment];
  if(!a1 || !a2) return null;
  /* Jamais deux actions du même type : on bascule sur la variante du moment. */
  if(a1.type === a2.type && A2_BIS[moment]) a2 = A2_BIS[moment];
  function faire(a){
    return { type:a.type, titre:a.titre, sec:Math.max(20, Math.round(a.sec*d/5)*5),
             txt:remplir(a.txt, profil.sport) };
  }
  var actions = [faire(a1), faire(a2)];
  /* Un client a déjà écrit son mot et son geste de départ dans son protocole AXE. On les
     lui ressort ici, au moment précis où ils servent. C'est la différence entre un
     protocole générique et le sien. */
  var perso = null;
  if(profil.type === 'client' && (profil.mot || profil.geste)){
    var p = [];
    if(profil.mot)   p.push('ton mot, « ' + profil.mot + ' »');
    if(profil.geste) p.push('ton geste, ' + String(profil.geste).toLowerCase());
    perso = 'Avant de commencer : tu as déjà ' + p.join(' et ')
          + '. Tu les as écrits toi-même. Sers-t\'en maintenant.';
  }
  return { blocage:blocage, moment:moment, actions:actions, perso:perso,
           bande:b, mot:MOT_AGE[b], niveau:NIVEAU_LIGNE[niveauCle(profil.niveau)],
           total: actions.reduce(function(s,a){ return s+a.sec; }, 0) };
}

function momentsDe(b){ return (GRILLE[b]||[]).slice(); }
function renvoiDe(b,m){ return (RENVOI[b]||{})[m] || null; }
function libelle(k){
  if(k === 'libre') return "Ce que tu as écrit";
  var b=BLOCAGES.filter(function(x){return x.k===k;})[0];
  if(b) return b.t;
  var m=MOMENTS.filter(function(x){return x.k===k;})[0];
  return m ? m.t : k;
}
/* ---------------------------------------------------------------- la porte libre

   Vingt-et-unième porte : le sportif écrit sa phrase lui-même. Elle s'ajoute à la
   liste, elle ne la remplace pas. Deux raisons. Il n'est jamais bloqué, même si
   ce qu'il vit n'existe pas encore dans le protocole. Et les mots réels remontent
   dans observateur, ce qui fait grandir la liste avec leur vocabulaire, pas le nôtre.

   Tout se passe sur le téléphone : une table de mots, un score, et un aveu honnête
   quand on ne reconnaît rien. Pas de réseau, pas de modèle de langage, rien qui
   sorte de l'appareil. Mieux vaut dire « je ne suis pas sûr » et demander, que
   proposer le mauvais exercice avec assurance. */

function sansAccent(s){
  return String(s||'').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[’'`]/g,' ').replace(/[^a-z0-9 ]/g,' ')
    .replace(/\s+/g,' ').trim();
}

/* Un motif en plusieurs mots vaut 3, un mot seul vaut 1 : « j'ai mal au ventre »
   est bien plus sûr que « ventre » tout seul. Les motifs sont des débuts de mot,
   donc « rate » attrape raté, ratée, rater, mais pas « arrête ». */
var MOTS = {
  a_rater: ['rate','loupe','louper','foire','me planter','je vais me planter','echoue',
            'tout le monde me regarde','ils me regardent','devant tout le monde','le public',
            'si je rate','peur de rater','me ridiculiser'],
  a_mal: ['me faire mal','faire mal','me blesser','mal au genou','mal au dos','blesse','tomber',
          'chute','me casser','peur de tomber','dangereux','danger','me planter dedans','la gamelle'],
  a_decevoir: ['decevoir','decu','deception','fier de moi','pas fier','je vais les decevoir',
               'mon pere','ma mere','pour eux'],
  a_nouveau: ['nouveau','nouvelle','premiere fois','jamais fait','je connais pas','inconnu',
              'je sais pas a quoi m attendre','je decouvre','je sais pas comment ca se passe'],
  a_vite: ['trop vite','surexcite','excite','survolte','speed','trop d energie','electrique',
           'je tiens pas en place','je pars trop fort','je bouillonne'],
  a_concentre: ['concentre','concentrer','concentration','deconcentre','distrait',
                'je pense a autre chose','la tete ailleurs','j arrive pas a me focaliser',
                'je suis ailleurs','dans la lune'],
  a_ventre: ['ventre','vomir','nausee','mal au coeur','boule au ventre','noeud a l estomac',
             'estomac','gerber','barbouille','envie d aller aux toilettes','les boyaux'],
  b_erreur: ['mon erreur','erreur','ma faute','en boucle','je repense','j arrete pas d y penser',
             'ressasse','je revois','je rejoue','ca tourne dans ma tete','mon rate'],
  b_injustice: ['injuste','injustice','arbitre','arbitrage','selection','pas pris','triche',
                'favoritisme','c est pas normal','je le meritais','ils ont favorise'],
  b_colere: ['colere','enerve','rage','furieux','la haine','je deteste','j en veux a','vener',
             'ca me soule','ca me gave'],
  b_abandon: ['tout arreter','arreter le','abandonner','abandon','laisser tomber','j en peux plus',
              'j en ai marre','plus envie de continuer','envie de tout lacher','ca sert a rien'],
  b_relance: ['la pause','apres la pause','me remettre dedans','repartir','relancer','mi temps',
              'la coupure','je suis refroidi','retrouver le rythme','entre deux'],
  c_compare: ['compare','comparer','meilleur que moi','moins bien que','ils sont tous',
              'je suis le moins','les autres sont','a cote d eux','par rapport aux autres'],
  c_echauffement: ['lourd','raide','mon corps repond pas','mon corps ne repond pas','jambes en coton',
                   'jambes en bois','pas reveille','je me sens mou','pas dans mon corps','engourdi'],
  c_blessure: ['blessure','ma blessure','operation','opere','reprise','rechute','mon genou',
               'ma cheville','mon epaule','peur que ca recommence','peur que ca lache'],
  c_niveau: ['pas le niveau','le niveau','pas capable','je vaux rien','je suis nul','pas fait pour',
             'on m a dit que','pas ma place','je suis pas assez'],
  c_serie: ['j enchaine','serie','toujours pareil','j y crois plus','mes resultats','encore rate',
            'ca marche jamais','ca fait des semaines','je progresse plus','je recule'],
  c_pression: ['pression','mes parents','mon coach','mon entraineur','ils attendent','ils exigent',
               'on me force','on compte sur moi','faut que je fasse','obligation de resultat'],
  d_honte: ['honte','je m en veux','honteux','ridicule','humilie','j ose plus','je peux plus les regarder',
            'devant eux apres','je veux plus y retourner'],
  d_dormir: ['dormir','sommeil','insomnie','la nuit','je me reveille','je tourne dans mon lit',
             'je m endors pas','je rumine le soir','les yeux ouverts']
};

/* Des phrases qui dépassent la compétition. Volontairement peu nombreuses et toutes
   explicites : un faux positif enverrait un message grave à un gamin qui parlait
   seulement de son sport. « J'ai envie de tout arrêter » n'est pas là, c'est b_abandon. */
var ALERTE = ['envie de mourir','veux mourir','envie de disparaitre','suicid','en finir avec',
              'plus envie de vivre','me faire du mal','me fais du mal','me mutiler','scarif',
              'me frappe','me tape dessus','me cogne','harcel'];

function inquiet(phrase){
  var t = sansAccent(phrase);
  return ALERTE.some(function(m){ return t.indexOf(m) >= 0; });
}

function deviner(phrase){
  var t = sansAccent(phrase);
  if(t.length < 4) return [];
  var out = [];
  Object.keys(MOTS).forEach(function(k){
    var s = 0;
    MOTS[k].forEach(function(m){
      var re = new RegExp('(^| )' + m.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '[a-z]*');
      if(re.test(t)) s += (m.indexOf(' ') >= 0 ? 3 : 1);
    });
    if(s >= 2) out.push({ cle:k, score:s });
  });
  out.sort(function(a,b){ return b.score - a.score; });
  if(!out.length) return [];
  /* On ne propose un second choix que s'il est vraiment proche du premier.
     Trois pistes vagues valent moins qu'une seule assumée. */
  return out.length > 1 && out[1].score >= out[0].score * 0.6
       ? out.slice(0, 2) : out.slice(0, 1);
}

/* Les deux actions quand on n'a rien reconnu. Elles valent pour n'importe quel
   blocage : nommer, puis réduire à une seule chose faisable tout de suite. */
GRILLE.libre = ['veille','veille_soir','jour','pendant','apres','lendemain'];
A1.libre = { type:'attention', titre:'Relis ta phrase, puis une seule chose', sec:60,
  txt:"Tu viens de l'écrire, et c'était le plus dur : ce qui n'a pas de nom reste flou et prend toute la place. Relis ta phrase dans ta tête, une fois, lentement, sans la corriger. Puis choisis une seule chose, la plus petite, que tu peux faire dans la minute qui vient : {action}. Pas la suite, pas le reste. Celle-là." };

var ICONE = { respiration:'◉', mouvement:'➤', visualisation:'◆', parole:'❝', attention:'✦' };
var NOM_TYPE = { respiration:'Respiration', mouvement:'Mouvement', visualisation:'Visualisation',
                 parole:'À dire', attention:'Attention' };

window.AxeFlash = {
  FAMILLES:FAMILLES, BLOCAGES:BLOCAGES, MOMENTS:MOMENTS, GRILLE:GRILLE, LEX:LEX,
  ICONE:ICONE, NOM_TYPE:NOM_TYPE,
  composer:composer, momentsDe:momentsDe, renvoiDe:renvoiDe,
  libelle:libelle, sportKey:sportKey, bande:bande,
  deviner:deviner, inquiet:inquiet, sansAccent:sansAccent
};
})();
