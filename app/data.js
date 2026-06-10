// ════════════════════════════════════════════════════════════════
//  AXE — DONNÉES DU DIAGNOSTIC (25 questions) + LOGIQUE RAPPORT
//  Mental : reprend la méthode AXE de Fabien (5 dimensions / 5 profils)
//  Physique : dérive 4 axes (explosivité, puissance, gainage, endurance)
// ════════════════════════════════════════════════════════════════

// 25 questions — 5 dimensions mentales notées sur les options
const QUESTIONS = [
 {cat:"Gestion du stress",text:"La nuit avant une grosse manche, comment dors-tu ?",opts:[
   {t:"Comme d'habitude — ma routine d'avant-course est rodée.",s:{stress:4,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Un peu moins, mais ça ne m'affecte pas au portillon.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Difficilement — je repasse les départs dans ma tête.",s:{stress:1,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Très peu — l'anxiété de la course prend toute la place.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}}]},
 {cat:"Gestion du stress",text:"Sur le portillon, dans les secondes avant que la grille tombe, ton état est :",opts:[
   {t:"Focalisé et explosif — je suis dans ma bulle.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
   {t:"Une excitation qui me met en alerte positive.",s:{stress:3,peur:3,confiance:3,plaisir:4,compet:3}},
   {t:"Une anxiété que je gère tant bien que mal.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Un stress intense qui parasite ma concentration.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},
 {cat:"Gestion du stress",text:"Après un mauvais départ ou une faute, ta récupération mentale prend :",opts:[
   {t:"Quelques mètres — j'efface et je relance.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Un virage ou deux — je reviens vite.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Le reste de la manche — je rumine.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Toute la journée — la faute me hante.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Gestion du stress",text:"Ton niveau en course par rapport à l'entraînement sur la piste est :",opts:[
   {t:"Supérieur — la course me révèle.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
   {t:"Similaire — je reproduis fidèlement mes départs.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Légèrement inférieur — la pression me grignote.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Nettement inférieur — je ne suis jamais moi-même en manche.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},
 {cat:"Gestion du stress",text:"Quand un coach ou un parent te met la pression juste avant de t'élancer, tu :",opts:[
   {t:"Restes centré — leur pression ne me touche pas.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"L'entends mais je me recentre sur ma course.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Ressens un surcroît de tension au portillon.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Me déstabilise complètement.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},

 {cat:"Rapport à la peur",text:"Juste avant de t'élancer, face à l'enjeu, tu penses d'abord à :",opts:[
   {t:"Ma poussée, mon timing, mes premiers coups de pédale.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"L'occasion de prendre le holeshot d'entrée.",s:{stress:3,peur:4,confiance:3,plaisir:4,compet:4}},
   {t:"Ce qui peut mal tourner si je rate mon start.",s:{stress:2,peur:1,confiance:2,plaisir:2,compet:2}},
   {t:"Le regard des autres si je chute.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la peur",text:"Face à un pilote clairement plus fort dans ta grille, tu ressens :",opts:[
   {t:"De la motivation — une chance de me dépasser.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
   {t:"Du respect, mais je roule ma course.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Une pression qui me crispe avant le départ.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Un sentiment de course perdue avant la chute de grille.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la peur",text:"Face à une section engagée et risquée (gros saut, virage relevé serré), tu :",opts:[
   {t:"L'attaques sans hésiter — c'est là qu'on gagne.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
   {t:"L'engages si la course s'y prête.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Préfères assurer — trop risqué de tomber.",s:{stress:2,peur:1,confiance:2,plaisir:2,compet:2}},
   {t:"N'oses jamais — et je le regrette après.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la peur",text:"Tu te surprends parfois à rouler pour ne pas chuter plutôt que pour gagner :",opts:[
   {t:"Jamais — je suis toujours à l'attaque.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:4}},
   {t:"Rarement — seulement sur une section piégeuse.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Souvent — surtout quand l'enjeu monte.",s:{stress:2,peur:1,confiance:2,plaisir:2,compet:2}},
   {t:"Presque toujours — la prudence est mon mode par défaut.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la peur",text:"Après une grosse chute douloureuse, tu reviens sur la piste :",opts:[
   {t:"Motivé — la chute m'a appris quelque chose.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Neutre — je tourne la page assez vite.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Un peu marqué — j'appréhende la section.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Avec une appréhension qui dure longtemps.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},

 {cat:"Confiance en soi",text:"D'où vient ta confiance avant une course ?",opts:[
   {t:"De mon travail et de mes départs répétés.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"De mes bons résultats récents en manche.",s:{stress:3,peur:3,confiance:2,plaisir:3,compet:3}},
   {t:"Du regard positif de mon coach/mes proches.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
   {t:"Je ne sais pas — elle est souvent absente sur la grille.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}}]},
 {cat:"Confiance en soi",text:"Après 3 mauvaises manches d'affilée, ta confiance :",opts:[
   {t:"Reste stable — je sais que c'est une phase.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Baisse un peu mais je garde le cap.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"S'effondre — je doute de mon départ.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
   {t:"Disparaît — je remets tout en question.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Confiance en soi",text:"L'approbation de ton coach influence tes courses :",opts:[
   {t:"Peu — je suis autonome dans mon évaluation.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Modérément — une donnée parmi d'autres.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Beaucoup — sa validation me conditionne.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
   {t:"Énormément — une remarque négative me détruit.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Confiance en soi",text:"Avant une course, tu as un rituel de préparation mentale :",opts:[
   {t:"Oui, complet et rodé.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Quelques habitudes simples mais efficaces.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Non — j'improvise selon mon humeur.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Non — et ça me manque sur la grille.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}}]},
 {cat:"Confiance en soi",text:"Quand tu rates un geste que tu réussis d'habitude (un saut, un manual), tu te dis :",opts:[
   {t:"Ça arrive — je reste concentré sur la suite.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"C'est agaçant mais je gère.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Je doute de moi pour le reste de la manche.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
   {t:"Tout s'effondre — je ne suis plus capable de rien.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:1}}]},

 {cat:"Rapport au plaisir",text:"Pourquoi fais-tu du BMX Race en compétition ?",opts:[
   {t:"Pour le plaisir et les sensations — le résultat vient après.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
   {t:"Pour progresser et atteindre mes objectifs.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Pour prouver ma valeur.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Pour gagner — c'est tout ce qui compte.",s:{stress:2,peur:2,confiance:2,plaisir:1,compet:1}}]},
 {cat:"Rapport au plaisir",text:"Quand la course devient très intense (départ groupé, bagarre au premier virage), tu :",opts:[
   {t:"M'élève — l'intensité libère mon meilleur niveau.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
   {t:"Reste stable — je gère la pression.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Me crispe — ça ajoute une charge mentale.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Perds mes moyens.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},
 {cat:"Rapport au plaisir",text:"À l'entraînement sur la piste sans enjeu, ton engagement est :",opts:[
   {t:"Identique — je m'engage toujours à fond.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:4}},
   {t:"Légèrement inférieur — normal sans la course.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Nettement supérieur — libéré sans l'enjeu.",s:{stress:2,peur:2,confiance:2,plaisir:1,compet:2}},
   {t:"Énorme différence — la course me bloque vraiment.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},
 {cat:"Rapport au plaisir",text:"Ce que tu préfères dans le BMX, c'est :",opts:[
   {t:"La sensation de vitesse, le flow, le start parfait.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
   {t:"Progresser et voir mon travail payer.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Être reconnu pour mon niveau.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"Gagner — le reste ne compte pas.",s:{stress:2,peur:2,confiance:2,plaisir:1,compet:1}}]},

 {cat:"Rapport à la compétition",text:"Comment vis-tu une élimination en série ou une défaite ?",opts:[
   {t:"Comme une info — qu'est-ce que j'améliore ?",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"C'est dur mais je relativise vite.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Très mal — ça me ronge des jours.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:1}},
   {t:"Comme un échec personnel total.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la compétition",text:"Tes exigences envers toi-même sont :",opts:[
   {t:"Élevées mais justes — ambitieux sans me maltraiter.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Normales — des objectifs réalistes.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Très élevées — je me pardonne mal la moindre faute.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:1}},
   {t:"Impossibles — rien n'est jamais assez bien.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la compétition",text:"Ta relation avec la victoire est :",opts:[
   {t:"Saine — un bonus, pas une obsession.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
   {t:"Positive — je veux gagner mais je gère la défaite.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Tendue — l'absence de podium me pèse.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:1}},
   {t:"Obsessionnelle — ne pas gagner est inacceptable.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
 {cat:"Rapport à la compétition",text:"Au moment décisif (le pédalage de départ, le sprint vers la ligne), ton corps réagit :",opts:[
   {t:"En s'activant positivement — je suis fait pour ça.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
   {t:"Avec une montée d'adrénaline que je canalise.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Avec une tension physique qui gêne mes gestes.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"En se bloquant — jambes lourdes, gestes figés au portillon.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}}]},
 {cat:"Rapport à la compétition",text:"Si un travail mental pouvait te faire franchir un palier (mieux partir, oser doubler), tu :",opts:[
   {t:"L'ai déjà intégré à ma préparation.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"Serais partant — je vois l'importance du mental en BMX.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"Hésiterais — je ne sais pas par où commencer.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
   {t:"En aurais vraiment besoin — c'est mon frein principal.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:1}}]},
 {cat:"Confiance en soi",text:"Quand tu te présentes au portillon d'une finale, au fond de toi tu penses :",opts:[
   {t:"« Je suis à ma place ici, j'ai travaillé pour ça. »",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
   {t:"« Je vais donner mon maximum et on verra. »",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
   {t:"« J'espère ne pas me rater devant tout le monde. »",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
   {t:"« Je ne suis pas au niveau des autres. »",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
];

// Adaptations 12-15 ans (langage simplifié) et 15-18 ans (contexte sélection)
const AGE_TWEAKS = {
 '12-15':{
   0:{text:"La veille d'une course, comment tu dors ?",opts:[
     {t:"Bien — j'ai mes habitudes et ça marche.",s:{stress:4,peur:3,confiance:3,plaisir:3,compet:3}},
     {t:"Un peu moins mais ça change rien.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
     {t:"Mal — j'arrête pas de penser au départ.",s:{stress:1,peur:2,confiance:2,plaisir:2,compet:2}},
     {t:"Presque pas — le stress de la course est trop fort.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}}]},
   5:{text:"Juste avant que la grille tombe, dans ta tête tu penses surtout à :",opts:[
     {t:"Ma poussée et mes premiers coups de pédale.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
     {t:"L'occasion de sortir devant les autres d'entrée.",s:{stress:3,peur:4,confiance:3,plaisir:4,compet:4}},
     {t:"Ce qui peut mal se passer si je rate mon start.",s:{stress:2,peur:1,confiance:2,plaisir:2,compet:2}},
     {t:"Ce que vont penser mes potes ou mes parents si je tombe.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}}]},
   14:{text:"Quand tu rates un saut ou un truc que tu fais d'habitude, tu te dis :",opts:[
     {t:"Ça arrive — je me concentre sur la suite.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
     {t:"C'est énervant mais je relance direct.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
     {t:"Je doute pour le reste de la manche.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
     {t:"Je suis nul — j'y arrive plus.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:1}}]},
 },
 '15-18':{
   13:{text:"Avant une course de sélection (championnat, qualif), tu as un rituel de préparation mentale :",opts:[
     {t:"Oui, complet et rodé — surtout en sélection.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
     {t:"Quelques habitudes simples mais efficaces.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
     {t:"Non — j'improvise, et ça se ressent quand l'enjeu monte.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
     {t:"Non — et en sélection ça me manque clairement.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}}]},
   23:{text:"Si un travail mental pouvait t'aider à intégrer une structure ou un pôle, tu :",opts:[
     {t:"L'ai déjà intégré à ma préparation.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
     {t:"Serais partant — le mental fait la différence en sélection.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
     {t:"Hésiterais — je ne sais pas par où commencer.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
     {t:"En aurais vraiment besoin — c'est ce qui me sépare du niveau visé.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:1}}]},
 }
};

// Les 5 profils mentaux (méthode AXE)
const PROFILES = {
 stress:{name:"L'Hyperstressé",dim:"Gestion du stress",
   faible:"La gestion du stress en compétition",
   fort_si:"Tu as le pilotage — mais l'anxiété te vole ton vrai niveau au portillon le jour de la course.",
   axe:"Alignement (A)",
   reco:"Réconcilier ce que tu ressens et ce dont tu es réellement capable."},
 peur:{name:"Le Bloqué par la Peur",dim:"Rapport à la peur",
   faible:"L'engagement face au risque",
   fort_si:"Tu as le niveau pour attaquer le start et les sections engagées — mais un mécanisme de protection te retient.",
   axe:"Engagement (E)",
   reco:"T'engager pleinement au portillon et dans les sections risquées, malgré le risque perçu."},
 confiance:{name:"Le Sans Confiance",dim:"Confiance en soi",
   faible:"La confiance inconditionnelle",
   fort_si:"Ta confiance dépend trop de tes résultats et du regard des autres au bord de piste.",
   axe:"Alignement (A)",
   reco:"Bâtir une confiance ancrée sur des preuves internes, pas sur le score."},
 plaisir:{name:"Le Performeur Fluide",dim:"Rapport au plaisir",
   faible:"Performer sans s'éteindre",
   fort_si:"Tu es naturellement fluide sur le vélo — l'enjeu de la course peut éteindre ce qui te rend bon.",
   axe:"eXigence (X)",
   reco:"Une exigence tournée vers le processus, pas vers le résultat."},
 compet:{name:"L'Hypercompétiteur",dim:"Rapport à la compétition",
   faible:"Canaliser une compétitivité brute",
   fort_si:"Ta combativité au portillon est une arme exceptionnelle — mal maniée elle te crispe et te blesse.",
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

