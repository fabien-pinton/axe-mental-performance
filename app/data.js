// ════════════════════════════════════════════════════════════════
//  AXE — DONNÉES DU DIAGNOSTIC (25 questions) + LOGIQUE RAPPORT
//  Mental : reprend la méthode AXE de Fabien (5 dimensions / 5 profils)
//  Physique : dérive 4 axes (explosivité, puissance, gainage, endurance)
// ════════════════════════════════════════════════════════════════

// 25 questions — 5 dimensions mentales notées sur les options
const QUESTIONS = [
 {cat:"Gestion du stress",text:"La nuit avant une compétition importante, comment dors-tu ?",opts:[
   {t:"Comme d'habitude — ma routine est rodée.",s:{stress:4,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Un peu moins, mais ça ne m'affecte pas.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Difficilement — ma tête tourne, je rumine.",s:{stress:1,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Très peu — l'anxiété prend toute la place.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}}]},
 {cat:"Gestion du stress",text:"Dans les secondes avant le début de ta compétition, ton état mental est :",opts:[
   {t:"Focalisé et explosif — je suis dans ma bulle.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
   {t:"Une excitation qui me met en alerte positive.",s:{stress:3,peur:3,confiance:3,plaisir:4,compet:3}},
   {t:"Une anxiété que je gère tant bien que mal.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Un stress intense qui parasite ma concentration.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},
 {cat:"Gestion du stress",text:"Après une erreur en compétition, ta récupération mentale prend :",opts:[
   {t:"Quelques secondes — j'efface et je relance.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Quelques instants — je reviens vite.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Le reste de l'épreuve — je rumine.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Toute la journée — l'erreur me hante.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Gestion du stress",text:"Ton niveau en compétition par rapport à l'entraînement est :",opts:[
   {t:"Supérieur — la compétition me révèle.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
   {t:"Similaire — je reproduis fidèlement mon niveau.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Légèrement inférieur — la pression me grignote.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Nettement inférieur — je ne suis jamais moi-même en compétition.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},
 {cat:"Gestion du stress",text:"Quand un coach ou un parent te met la pression juste avant la finale, tu :",opts:[
   {t:"Restes centré — leur pression ne me touche pas.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"L'entends mais je me recentre sur moi.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Ressens un surcroît de tension.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Me déstabilise complètement.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},

 {cat:"Rapport à la peur",text:"Juste avant de t'élancer, face à l'enjeu, tu penses d'abord à :",opts:[
   {t:"Mon geste, mon timing, mon exécution.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"L'occasion de prendre l'avantage d'entrée.",s:{stress:3,peur:4,confiance:3,plaisir:4,compet:4}},
   {t:"Ce qui peut mal tourner si j'échoue.",s:{stress:2,peur:1,confiance:2,plaisir:2,compet:2}},
   {t:"Le regard des autres si je rate.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la peur",text:"Face à un adversaire clairement plus fort, tu ressens :",opts:[
   {t:"De la motivation — une chance de me dépasser.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
   {t:"Du respect, mais je fais ma compétition.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Une pression qui me crispe avant de commencer.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Un sentiment de défaite avant le départ.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la peur",text:"Face à une situation technique engagée et risquée, tu :",opts:[
   {t:"L'attaques sans hésiter — c'est là qu'on gagne.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
   {t:"L'engages si la compétition s'y prête.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Préfères assurer — trop risqué.",s:{stress:2,peur:1,confiance:2,plaisir:2,compet:2}},
   {t:"N'oses jamais — et je le regrette après.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la peur",text:"Tu te surprends parfois à jouer pour ne pas perdre plutôt que pour gagner :",opts:[
   {t:"Jamais — je suis toujours offensif.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:4}},
   {t:"Rarement — seulement en situation exceptionnelle.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Souvent — surtout quand l'enjeu monte.",s:{stress:2,peur:1,confiance:2,plaisir:2,compet:2}},
   {t:"Presque toujours — c'est mon mode par défaut.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la peur",text:"Après un échec douloureux, tu reviens à la compétition :",opts:[
   {t:"Motivé — l'échec m'a appris quelque chose.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Neutre — je tourne la page assez vite.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Un peu marqué — ça prend quelques sessions.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Avec une appréhension qui dure longtemps.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},

 {cat:"Confiance en soi",text:"D'où vient ta confiance avant une compétition ?",opts:[
   {t:"De mon travail et de ma préparation.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"De mes bons résultats récents.",s:{stress:3,peur:3,confiance:2,plaisir:3,compet:3}},
   {t:"Du regard positif de mon coach/mes proches.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
   {t:"Je ne sais pas — elle est souvent absente.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}}]},
 {cat:"Confiance en soi",text:"Après 3 compétitions ratées d'affilée, ta confiance :",opts:[
   {t:"Reste stable — je sais que c'est une phase.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Baisse un peu mais je garde le cap.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"S'effondre — je doute de tout.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
   {t:"Disparaît — je remets tout en question.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Confiance en soi",text:"L'approbation de ton coach influence tes compétitions :",opts:[
   {t:"Peu — je suis autonome dans mon évaluation.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Modérément — une donnée parmi d'autres.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Beaucoup — sa validation me conditionne.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
   {t:"Énormément — une remarque négative me détruit.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Confiance en soi",text:"Avant une compétition, tu as un rituel de préparation mentale :",opts:[
   {t:"Oui, complet et rodé.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Quelques habitudes simples mais efficaces.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Non — j'improvise selon mon humeur.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Non — et ça me manque.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}}]},
 {cat:"Confiance en soi",text:"Quand tu rates un geste que tu réussis d'habitude, tu te dis :",opts:[
   {t:"Ça arrive — je reste concentré sur la suite.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"C'est agaçant mais je gère.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Je doute de moi pour le reste de la journée.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
   {t:"Tout s'effondre — je ne suis plus capable de rien.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:1}}]},

 {cat:"Rapport au plaisir",text:"Pourquoi fais-tu de la compétition ?",opts:[
   {t:"Pour le plaisir et le dépassement — le résultat vient après.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
   {t:"Pour progresser et atteindre mes objectifs.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Pour prouver ma valeur.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Pour gagner — c'est tout ce qui compte.",s:{stress:2,peur:2,confiance:2,plaisir:1,compet:1}}]},
 {cat:"Rapport au plaisir",text:"Quand la compétition devient très intense (lutte serrée), tu :",opts:[
   {t:"M'élève — l'intensité libère mon meilleur niveau.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
   {t:"Reste stable — je gère la pression.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Me crispe — ça ajoute une charge mentale.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Perds mes moyens.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},
 {cat:"Rapport au plaisir",text:"À l'entraînement sans enjeu, ton engagement est :",opts:[
   {t:"Identique — je m'engage toujours à fond.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:4}},
   {t:"Légèrement inférieur — normal sans compétition.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Nettement supérieur — libéré sans l'enjeu.",s:{stress:2,peur:2,confiance:2,plaisir:1,compet:2}},
   {t:"Énorme différence — la compétition me bloque vraiment.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},
 {cat:"Rapport au plaisir",text:"Ce que tu préfères dans ton sport, c'est :",opts:[
   {t:"La sensation de vitesse, le flow, le geste parfait.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
   {t:"Progresser et voir mon travail payer.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Être reconnu pour mon niveau.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Gagner — le reste ne compte pas.",s:{stress:2,peur:2,confiance:2,plaisir:1,compet:1}}]},

 {cat:"Rapport à la compétition",text:"Comment vis-tu une défaite ?",opts:[
   {t:"Comme une info — qu'est-ce que j'améliore ?",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"C'est dur mais je relativise vite.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Très mal — ça me ronge des jours.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:1}},
   {t:"Comme un échec personnel total.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la compétition",text:"Tes exigences envers toi-même sont :",opts:[
   {t:"Élevées mais justes — ambitieux sans me maltraiter.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Normales — des objectifs réalistes.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Très élevées — je me pardonne mal les erreurs.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:1}},
   {t:"Impossibles — rien n'est jamais assez bien.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la compétition",text:"Ta relation avec la victoire est :",opts:[
   {t:"Saine — un bonus, pas une obsession.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
   {t:"Positive — je veux gagner mais je gère la défaite.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Tendue — l'absence de victoire me pèse.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:1}},
   {t:"Obsessionnelle — ne pas gagner est inacceptable.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la compétition",text:"Au moment décisif (la dernière action qui compte), ton corps réagit :",opts:[
   {t:"En s'activant positivement — je suis fait pour ça.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
   {t:"Avec une montée d'adrénaline que je canalise.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Avec une tension physique qui gêne mes gestes.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"En se bloquant — jambes lourdes, gestes figés.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},
 {cat:"Rapport à la compétition",text:"Si un travail mental pouvait te faire franchir un palier, tu :",opts:[
   {t:"L'ai déjà intégré à ma préparation.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Serais partant — je vois l'importance du mental.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Hésiterais — je ne sais pas par où commencer.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"En aurais vraiment besoin — c'est mon frein principal.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:1}}]},
 {cat:"Confiance en soi",text:"Quand tu te présentes au départ d'une finale, au fond de toi tu penses :",opts:[
   {t:"« Je suis à ma place ici, j'ai travaillé pour ça. »",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"« Je vais donner mon maximum et on verra. »",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"« J'espère ne pas me rater devant tout le monde. »",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
   {t:"« Je ne suis pas au niveau des autres. »",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
];

// Adaptations 12-15 ans (langage)
const AGE_TWEAKS = {
 '12-15':{
   0:{text:"La veille d'une compétition, comment tu dors ?",opts:[
     {t:"Bien — j'ai mes habitudes et ça marche.",s:{stress:4,peur:3,confiance:3,plaisir:3,compet:3}},
     {t:"Un peu moins mais ça change rien.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
     {t:"Mal — j'arrête pas de penser à la compétition.",s:{stress:1,peur:2,confiance:2,plaisir:2,compet:2}},
     {t:"Presque pas — le stress est trop fort.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}}]},
 },
 '15-18':{}
};

// Les 5 profils mentaux (méthode AXE)
const PROFILES = {
 stress:{name:"L'Hyperstressé",dim:"Gestion du stress",
   faible:"La gestion du stress en compétition",
   fort_si:"Tu as les capacités techniques — mais l'anxiété te vole ton vrai niveau le jour J.",
   axe:"Alignement (A)",
   reco:"Réconcilier ce que tu ressens et ce dont tu es réellement capable."},
 peur:{name:"Le Bloqué par la Peur",dim:"Rapport à la peur",
   faible:"L'engagement face au risque",
   fort_si:"Tu as le niveau pour attaquer — mais un mécanisme de protection te retient.",
   axe:"Engagement (E)",
   reco:"T'engager pleinement malgré le risque perçu."},
 confiance:{name:"Le Sans Confiance",dim:"Confiance en soi",
   faible:"La confiance inconditionnelle",
   fort_si:"Ta confiance dépend trop de tes résultats et du regard des autres.",
   axe:"Alignement (A)",
   reco:"Bâtir une confiance ancrée sur des preuves internes, pas sur le score."},
 plaisir:{name:"Le Performeur Fluide",dim:"Rapport au plaisir",
   faible:"Performer sans s'éteindre",
   fort_si:"Tu es naturellement fluide — l'enjeu peut éteindre ce qui te rend bon.",
   axe:"eXigence (X)",
   reco:"Une exigence tournée vers le processus, pas vers le résultat."},
 compet:{name:"L'Hypercompétiteur",dim:"Rapport à la compétition",
   faible:"Canaliser une compétitivité brute",
   fort_si:"Ta compétitivité est une arme exceptionnelle — mal maniée elle te blesse.",
   axe:"eXigence (X)",
   reco:"Transformer une exigence toxique en exigence juste."},
};

const DIM_LABELS = {
 stress:"Gestion du stress",peur:"Rapport à la peur",confiance:"Confiance en soi",
 plaisir:"Rapport au plaisir",compet:"Compétitivité"
};

// ── AXES PHYSIQUES (dérivés) ────────────────────────────────────
// On estime 4 axes physiques à partir du profil mental + niveau.
// Les clés (start/ligne/gainage/endurance) sont techniques : ne pas changer.
const PHYS_LABELS = {
 start:"Explosivité & démarrage",
 ligne:"Puissance & vitesse",
 gainage:"Gainage & stabilité",
 endurance:"Endurance & répétition de l'effort"
};
const PHYS_DESC = {
 start:{fort:"Ta capacité à exploser dès le départ de l'effort est ton arme. On va la rendre redoutable.",
        faible:"Ton explosivité au démarrage est ce qui te coûte le plus. C'est un levier qui change tout."},
 ligne:{fort:"Ta puissance et ta vitesse te mettent devant. On les décuple.",
        faible:"Tu perds du terrain sur la puissance pure. On va la construire."},
 gainage:{fort:"Ton gainage te rend stable et précis dans tes mouvements. On l'exploite à fond.",
          faible:"Un gainage faible = perte de transfert de puissance et de précision. Priorité absolue."},
 endurance:{fort:"Tu tiens ton niveau effort après effort, jusqu'au bout. Un atout rare.",
            faible:"Tu baisses sur la durée. On va construire ta capacité à finir aussi fort que tu commences."}
};

