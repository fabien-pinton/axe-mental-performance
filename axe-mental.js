/* ═══ AXE · DONNÉES MENTALES ═══
   25 questions + adaptations par tranche d'âge + 5 profils mentaux.
   Extrait de diagnostic.html (version payante) — contenu inchangé. */

// ══ QUESTIONS ══
const Q_BASE = [
  // ── GESTION DU STRESS (réaction au stress · relaxation · activation) ──
  {cat:"Gestion du stress · Réaction au stress",text:"La nuit avant une grosse manche, comment dors-tu ?",opts:[
    {t:"Comme d'habitude — ma routine d'avant-course est rodée.",s:{stress:4,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Un peu moins bien, mais ça ne m'affecte pas le lendemain au portillon.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Difficilement — je repasse les départs et les lignes dans ma tête.",s:{stress:1,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Très peu — l'anxiété de la course prend toute la place.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}},
  ]},
  {cat:"Gestion du stress · Activation",text:"Sur le portillon, dans les secondes avant que la grille tombe, ton état mental est :",opts:[
    {t:"Focalisé et calme — je suis dans ma bulle, prêt à pédaler.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
    {t:"Une excitation maîtrisée qui me met en alerte positive.",s:{stress:3,peur:3,confiance:3,plaisir:4,compet:3}},
    {t:"Une anxiété nette que je gère tant bien que mal.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Un stress intense — le cœur s'emballe, mes appuis se figent.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}},
  ]},
  {cat:"Gestion du stress · Récupération",text:"Après un mauvais départ ou une faute sur la première ligne droite, ta récupération mentale prend :",opts:[
    {t:"Quelques mètres — j'efface et je joue la relance dans la bosse suivante.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"Un virage ou deux — je reviens vite dans ma course.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Le reste de la manche — je rumine la faute en pédalant.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Toute la journée — le mauvais départ me hante manche après manche.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
  ]},
  {cat:"Gestion du stress · Relaxation",text:"Ton niveau en course par rapport à l'entraînement sur la piste est :",opts:[
    {t:"Supérieur — le jour de la course me révèle et m'élève.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
    {t:"Similaire — je reproduis fidèlement mes départs et mes trajectoires.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Légèrement inférieur — la pression grignote mon explosivité.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Nettement inférieur — je ne retrouve jamais mes sensations d'entraînement en manche.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}},
  ]},

  // ── RAPPORT À LA PEUR (contrôle de la peur · activation) ──
  {cat:"Rapport à la peur · Contrôle de la peur",text:"Quand tu as l'occasion de doubler dans un virage relevé serré, tu penses d'abord à :",opts:[
    {t:"Ce que je dois faire — la trajectoire, le point de corde, le timing.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
    {t:"L'opportunité de prendre la place et de me distinguer.",s:{stress:3,peur:4,confiance:3,plaisir:4,compet:3}},
    {t:"Ce qui pourrait mal tourner — la chute, l'accrochage.",s:{stress:2,peur:1,confiance:2,plaisir:2,compet:2}},
    {t:"Le risque de tomber devant tout le monde — je laisse passer.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
  ]},
  {cat:"Rapport à la peur · Contrôle de la peur",text:"Face à un pilote clairement plus fort sur la grille, tu ressens :",opts:[
    {t:"De l'envie — une chance de me mesurer et de me dépasser.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
    {t:"Du respect, mais je roule ma course sans me comparer.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Une pression en plus qui me crispe sur le portillon.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Un sentiment de course perdue avant même que la grille tombe.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
  ]},
  {cat:"Rapport à la peur · Engagement",text:"En manche, je me surprends parfois à rouler pour ne pas chuter plutôt que pour gagner :",opts:[
    {t:"Jamais — je suis toujours dans une dynamique offensive, à l'attaque.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:4}},
    {t:"Rarement — seulement sur des sections vraiment piégeuses.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Souvent — surtout quand l'enjeu de la course monte.",s:{stress:2,peur:1,confiance:2,plaisir:2,compet:2}},
    {t:"Presque toujours — la prudence est mon mode par défaut en course.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
  ]},
  {cat:"Rapport à la peur · Contrôle de la peur",text:"Après une grosse chute douloureuse, je reviens sur la piste :",opts:[
    {t:"Motivé — la chute m'a donné une info utile sur ma trajectoire.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"Neutre — je tourne la page assez vite et je repédale.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Un peu marqué — j'appréhende la section où je suis tombé.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Avec une vraie appréhension qui dure longtemps.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
  ]},

  // ── CONFIANCE EN SOI (confiance · préparation · imagerie · pratique mentale) ──
  {cat:"Confiance en soi · Confiance",text:"D'où vient principalement ta confiance avant une course ?",opts:[
    {t:"De mon travail et de mes départs répétés — je me connais.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"De mes bons résultats récents en manche.",s:{stress:3,peur:3,confiance:2,plaisir:3,compet:3}},
    {t:"Du regard positif de mon coach ou de mes parents au bord de piste.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
    {t:"Je ne sais pas vraiment — elle est souvent absente sur la grille.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}},
  ]},
  {cat:"Confiance en soi · Confiance",text:"Après 3 mauvaises manches d'affilée, ma confiance :",opts:[
    {t:"Reste stable — je sais que c'est une phase et je continue le travail.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"Baisse un peu mais je garde le cap jusqu'à la prochaine course.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"S'effondre — je commence à douter de mon départ et de mon niveau.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
    {t:"Disparaît complètement — je remets tout en question.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
  ]},
  {cat:"Confiance en soi · Confiance",text:"Le regard et l'approbation de mon coach influencent mes courses :",opts:[
    {t:"Peu — je suis autonome dans l'évaluation de ma course.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"Modérément — c'est une donnée parmi d'autres.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Beaucoup — sa validation conditionne fortement mes manches.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
    {t:"Énormément — une remarque négative peut gâcher toute ma journée de course.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
  ]},
  {cat:"Confiance en soi · Préparation à la compétition",text:"Avant une course, j'ai un rituel de préparation mentale :",opts:[
    {t:"Oui, complet et rodé — il fait partie de ma performance au portillon.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"Quelques habitudes simples mais efficaces avant de m'élancer.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Non vraiment — j'improvise selon comment je me sens ce jour-là.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Non — et ça me manque clairement sur la grille.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}},
  ]},
  {cat:"Confiance en soi · Confiance",text:"Je me compare aux autres pilotes de ma série :",opts:[
    {t:"Rarement — je me mesure surtout à mes propres chronos et sensations.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"Parfois, pour situer mon niveau objectivement.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Souvent — les comparaisons m'obsèdent au portillon.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
    {t:"En permanence — c'est mon référentiel principal avant de partir.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
  ]},
  {cat:"Confiance en soi · Pratique mentale",text:"Quand je rate un geste technique que je réussis d'habitude (un saut, un manual), je me dis :",opts:[
    {t:"Ça arrive — je reste concentré sur la suite de la manche.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"C'est agaçant mais je gère et je relance.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Je commence à douter de moi pour le reste de la course.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
    {t:"Tout s'effondre — je n'arrive plus à enchaîner quoi que ce soit.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:1}},
  ]},

  {cat:"Confiance en soi · Imagerie",text:"La veille d'une course, je me visualise en train de rouler la piste (départ, bosses, virages) :",opts:[
    {t:"Oui, en détail et en sensations — je \"roule\" la piste dans ma tête avant d'y être.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
    {t:"Un peu — je repasse les sections clés mentalement.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Rarement — je n'y pense pas vraiment ou je n'y arrive pas.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Jamais — et quand j'essaie, je ne vois que ce qui peut mal tourner.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}},
  ]},

  // ── RAPPORT AU PLAISIR (engagement · concentration) ──
  {cat:"Rapport au plaisir · Engagement",text:"Pourquoi je fais du BMX Race en compétition ?",opts:[
    {t:"Pour le plaisir et les sensations — le résultat vient après.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
    {t:"Pour progresser et atteindre mes objectifs de saison.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Pour prouver ma valeur à moi-même et aux autres.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Pour gagner — la victoire est la seule chose qui compte.",s:{stress:2,peur:2,confiance:2,plaisir:1,compet:1}},
  ]},
  {cat:"Rapport au plaisir · Engagement",text:"Au fond, ce que tu préfères dans le BMX c'est :",opts:[
    {t:"La sensation de vitesse, le flow quand l'enchaînement de bosses est parfait.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
    {t:"Progresser et voir que mon travail au portillon paie.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Être reconnu et respecté pour mon niveau dans le club.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Gagner la manche — le reste ne compte pas vraiment.",s:{stress:2,peur:2,confiance:2,plaisir:1,compet:1}},
  ]},
  {cat:"Rapport au plaisir · Concentration",text:"À l'entraînement sur la piste, sans enjeu de course, mon engagement est :",opts:[
    {t:"Identique — je m'engage toujours à fond, même sur un tour d'entraînement.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:4}},
    {t:"Légèrement inférieur — c'est normal sans la course.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Nettement supérieur — je roule libéré quand il n'y a pas d'enjeu.",s:{stress:2,peur:2,confiance:2,plaisir:1,compet:2}},
    {t:"La différence est énorme — la course me bloque vraiment.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}},
  ]},
  {cat:"Rapport au plaisir · Concentration",text:"Quand la course devient très intense (départ groupé, bagarre dans le premier virage), je :",opts:[
    {t:"M'élève — l'intensité libère mon meilleur niveau.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
    {t:"Reste stable — je gère la pression et je tiens ma ligne.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Me crispe — l'intensité ajoute une charge mentale.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Perds mes moyens — je ne suis plus moi-même sur le vélo.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}},
  ]},

  // ── RAPPORT À LA COMPÉTITION (établissement de buts · engagement · préparation) ──
  {cat:"Rapport à la compétition · Établissement de buts",text:"Comment je vis une élimination en série ou une défaite ?",opts:[
    {t:"Comme une information — qu'est-ce que j'améliore pour la prochaine ?",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"C'est difficile mais je relativise assez vite.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Très mal — ça me ronge pendant des jours.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:1}},
    {t:"Comme un échec personnel qui remet tout en cause.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
  ]},
  {cat:"Rapport à la compétition · Exigence",text:"Mes exigences envers moi-même en course sont :",opts:[
    {t:"Élevées mais justes — je suis ambitieux sans me maltraiter.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"Normales — j'ai des objectifs de course réalistes.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Très élevées — je me pardonne difficilement la moindre faute de pilotage.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:1}},
    {t:"Impossibles — rien n'est jamais assez bien, même une victoire.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
  ]},
  {cat:"Rapport à la compétition · Engagement",text:"Ma relation avec la victoire est :",opts:[
    {t:"Saine — la victoire est un bonus, pas une obsession.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
    {t:"Positive — je veux gagner mais je gère la défaite.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Tendue — l'absence de podium me pèse beaucoup.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:1}},
    {t:"Obsessionnelle — ne pas gagner la manche est inacceptable.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
  ]},
  {cat:"Rapport à la compétition · Activation",text:"Au moment décisif (le pédalage de départ, le sprint vers la ligne), ton corps réagit :",opts:[
    {t:"En s'activant positivement — je suis fait pour ces moments-là.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:4}},
    {t:"Avec une montée d'adrénaline que je canalise.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Avec une tension physique qui gêne mon explosivité.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"En se bloquant — jambes lourdes, gestes figés au portillon.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}},
  ]},
  {cat:"Rapport à la compétition · Réaction au stress",text:"Quand un coach ou un parent te met de la pression juste avant de t'élancer, tu :",opts:[
    {t:"Restes centré — leur pression ne change pas mon état au portillon.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"L'entends mais tu arrives à te recentrer sur ta course.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Ressens un surcroît de tension qui perturbe ta concentration.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"Te déstabilises complètement — leur pression te bloque.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}},
  ]},
  {cat:"Rapport à la compétition · Préparation à la compétition",text:"Si un travail mental pouvait te faire franchir un palier décisif (mieux partir, oser doubler), tu :",opts:[
    {t:"L'as déjà intégré dans ta préparation de pilote.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
    {t:"Serais partant — je comprends l'importance du mental en BMX.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
    {t:"Hésiterais — je ne sais pas par où commencer.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
    {t:"En aurais vraiment besoin — c'est clairement mon frein principal en course.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:1}},
  ]},
];

const AGE_TWEAKS = {
  '10-12':{
    0:{cat:"Gestion du stress · Réaction au stress",text:"La nuit avant une course, tu dors comment ?",opts:[
      {t:"Super bien, j'ai trop hâte d'y être.",s:{stress:4,peur:3,confiance:4,plaisir:4,compet:3}},
      {t:"Bien, comme les autres nuits.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
      {t:"Un peu moins bien, je pense à la course.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
      {t:"Pas bien, j'ai le ventre tout noué.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}},
    ]},
    1:{cat:"Gestion du stress · Activation",text:"Juste avant que la grille tombe, dans ton corps tu sens :",opts:[
      {t:"Je suis prêt à foncer, tout va bien.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
      {t:"Un peu de stress mais ça va.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
      {t:"Mon cœur bat très fort, je serre le guidon.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
      {t:"J'ai super peur, mes jambes tremblent.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}},
    ]},
    4:{cat:"Rapport à la peur · Contrôle de la peur",text:"Quand tu peux doubler quelqu'un dans un virage, tu penses d'abord à :",opts:[
      {t:"Comment bien passer, ma trajectoire.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
      {t:"Génial, je vais prendre sa place !",s:{stress:3,peur:4,confiance:3,plaisir:4,compet:4}},
      {t:"J'ai peur de tomber ou de m'accrocher.",s:{stress:2,peur:1,confiance:2,plaisir:2,compet:2}},
      {t:"Je préfère rester derrière, c'est plus sûr.",s:{stress:2,peur:1,confiance:1,plaisir:2,compet:1}},
    ]},
    13:{cat:"Confiance en soi · Pratique mentale",text:"Quand tu rates un saut que tu fais d'habitude, tu te dis :",opts:[
      {t:"C'est pas grave, je réessaie tout de suite.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
      {t:"C'est embêtant mais je continue.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
      {t:"J'ai peur de le rater encore après.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
      {t:"Je me dis que je suis nul.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:1}},
    ]},
  },
  '12-15':{
    0:{cat:"Gestion du stress · Réaction au stress",text:"La veille d'une course, comment tu dors ?",opts:[
      {t:"Bien — j'ai mes habitudes et ça marche.",s:{stress:4,peur:3,confiance:3,plaisir:3,compet:3}},
      {t:"Un peu moins mais ça change pas grand-chose au portillon.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
      {t:"Mal — j'arrête pas de penser au départ.",s:{stress:1,peur:2,confiance:2,plaisir:2,compet:2}},
      {t:"Je dors presque pas — le stress de la course est trop fort.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}},
    ]},
    1:{cat:"Gestion du stress · Activation",text:"Sur le portillon, juste avant que la grille tombe, dans ta tête c'est :",opts:[
      {t:"Calme et concentré — je suis dans ma bulle, prêt à pédaler.",s:{stress:4,peur:4,confiance:4,plaisir:4,compet:3}},
      {t:"Excité mais de la bonne façon, ça me réveille.",s:{stress:3,peur:3,confiance:3,plaisir:4,compet:3}},
      {t:"Stressé — j'essaie de me calmer comme je peux.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
      {t:"La panique — mon cœur bat trop fort, je bloque.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:2}},
    ]},
    4:{cat:"Rapport à la peur · Contrôle de la peur",text:"Quand t'as l'occasion de doubler quelqu'un dans un virage, tu penses d'abord à :",opts:[
      {t:"Ce que je dois faire — ma trajectoire, mon timing.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
      {t:"L'occasion de prendre la place et de montrer ce que je sais faire.",s:{stress:3,peur:4,confiance:3,plaisir:4,compet:3}},
      {t:"Ce qui pourrait mal se passer — tomber, m'accrocher.",s:{stress:2,peur:1,confiance:2,plaisir:2,compet:2}},
      {t:"Ce que vont penser mes potes, mon coach, mes parents si je chute.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:1}},
    ]},
    13:{cat:"Confiance en soi · Pratique mentale",text:"Quand tu rates un saut ou un truc que tu fais d'habitude, tu te dis :",opts:[
      {t:"Ça arrive — je me concentre sur la suite de la manche.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
      {t:"C'est énervant mais je relance direct.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
      {t:"Je commence à douter pour le reste de la course.",s:{stress:2,peur:2,confiance:1,plaisir:2,compet:2}},
      {t:"Je suis nul — j'arrive plus à rien enchaîner.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:1}},
    ]},
  },
  '15-18':{
    11:{cat:"Confiance en soi · Préparation à la compétition",text:"Avant une course de sélection (championnat, qualif), j'ai un rituel de préparation mentale :",opts:[
      {t:"Oui, complet et rodé — il fait partie de ma performance, surtout en sélection.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
      {t:"Quelques habitudes simples mais efficaces avant de m'élancer.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
      {t:"Non vraiment — j'improvise, et ça se ressent quand l'enjeu monte.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
      {t:"Non — et en course de sélection ça me manque clairement.",s:{stress:1,peur:1,confiance:1,plaisir:2,compet:2}},
    ]},
    24:{cat:"Rapport à la compétition · Préparation à la compétition",text:"Si un travail mental pouvait te faire passer un cap pour intégrer une structure ou un pôle, tu :",opts:[
      {t:"L'as déjà intégré dans ta préparation de pilote.",s:{stress:4,peur:4,confiance:4,plaisir:3,compet:3}},
      {t:"Serais partant — le mental fait souvent la différence à la sélection.",s:{stress:3,peur:3,confiance:3,plaisir:3,compet:3}},
      {t:"Hésiterais — je ne sais pas par où commencer.",s:{stress:2,peur:2,confiance:2,plaisir:2,compet:2}},
      {t:"En aurais vraiment besoin — c'est ce qui me sépare du niveau visé.",s:{stress:1,peur:1,confiance:1,plaisir:1,compet:1}},
    ]},
  }
};

const PROFILES = {
  stress:{
    id:"stress",name:"L'Hyperstressé",headline:"Le stress te vole ton vrai niveau.",
    desc:{
      default:"Tu as les capacités. Mais avant et pendant la compétition, l'anxiété prend plus de place que ton pilotage. Tu rumines, tu dors mal, et le jour J tu n'es plus tout à fait toi-même.",
      '10-12':"T'as le niveau à l'entraînement, mais le jour de la course, quand tu es sur le portillon, ton ventre se serre et tes jambes ne répondent plus pareil. C'est le stress, et c'est super normal. La bonne nouvelle : ça s'apprend à le calmer.",
'12-15':"T'as clairement le niveau. Mais le soir avant la compet, ta tête tourne. Et le matin du départ, ton ventre se serre. C'est normal — et ça se travaille.",
      '15-18':"Ta préparation physique est là. Mais la pression de la sélection ou du résultat génère un stress qui mange tes ressources mentales exactement quand t'en as le plus besoin.",
      '25+':"Tu as l'expérience. Mais le stress pre-compétition est toujours là — peut-être même plus intense qu'avant parce que les enjeux ont changé. Ce n'est pas une fatalité.",
    },
    exos:{
      default:[
        {t:"La cohérence cardiaque quotidienne",d:"Inspirez 5s par le nez, retenez 5s, expirez 5s par la bouche. 3 fois par jour pendant 21 jours. Cette technique recalibre physiologiquement votre réponse au stress. Le résultat est mesurable en 3 semaines."},
        {t:"Le rituel pré-compétition infaillible",d:"Définissez une séquence de 10-15 minutes toujours identique avant l'échauffement : même musique, mêmes gestes, mêmes mots intérieurs. La répétition crée un réflexe de calme ancré dans votre cerveau."},
        {t:"La technique 5-4-3-2-1 contre l'anxiété",d:"Quand l'anxiété monte : nommez mentalement 5 choses que vous voyez, 4 que vous entendez, 3 que vous ressentez physiquement. Cet ancrage sensoriel coupe le circuit de l'anticipation anxieuse en moins de 2 minutes."},
      ],
      '10-12':[
        {t:"Souffler comme un ballon",d:"Juste avant que la grille tombe, souffle doucement par la bouche comme si tu gonflais un ballon, 2 fois. Ça envoie un message à ton corps : tout va bien, on peut y aller. C'est ton bouton calme."},
        {t:"Ton mot rigolo",d:"Choisis un mot marrant qui te fait sourire (par exemple 'pizza' ou 'banane'). Dis-le dans ta tête juste avant le départ. Ça détend, et un pilote détendu pédale mieux qu'un pilote crispé."},
        {t:"Le plan des 3 images",d:"Avant la course, imagine 3 fois dans ta tête ton départ parfait : la poussée, le premier pédalage, le regard loin devant. Ton cerveau adore les images, il se prépare à réussir."},
      ],
'12-15':[
        {t:"La respiration 4-4-4 avant la compet",d:"4 secondes d'inspiration, 4 secondes de pause, 4 secondes d'expiration. Fais ça 5 fois dans les vestiaires avant de sortir. Ton corps va se calmer automatiquement — essaie-le à l'entraînement d'abord."},
        {t:"Ton rituel à toi",d:"Avant chaque compet, fais toujours la même chose dans le même ordre — ta musique, tes gestes, ta phrase. Ton cerveau va associer cette séquence à l'état 'prêt à performer'. En quelques semaines, ça marche tout seul."},
        {t:"Le scan corporel express",d:"Dans les 10 minutes avant le départ, ferme les yeux 30 secondes et sens où est la tension dans ton corps. Contracte cet endroit fort pendant 5 secondes, puis relâche. Fais-le 2-3 fois. Ça libère beaucoup."},
      ],
      '15-18':[
        {t:"La cohérence cardiaque pré-sélection",d:"5s inspiration, 5s expiration — 5 minutes par jour. En 3 semaines de pratique régulière, ton système nerveux apprend à rester calme sous pression de sélection. Ce n'est pas une technique — c'est un entraînement physiologique."},
        {t:"Décorréler résultat et valeur personnelle",d:"Après chaque compétition, note 3 choses que tu as bien faites — indépendamment du résultat. Ton cerveau a besoin de preuves que tu as de la valeur même sans victoire. Construis ce dossier de preuves."},
        {t:"Le rituel de recentrage entre les efforts",d:"Entre deux efforts ou deux phases, même exercice : 3 respirations lentes, un mot-ancre ('focus', 'moi', 'calme'), regard fixé sur un point précis. 20 secondes. Ça remet le cerveau en mode 'présent'."},
      ],
      '25+':[
        {t:"La cohérence cardiaque — vraiment cette fois",d:"Tu en as peut-être entendu parler. La différence à 25+ ans : pratique-la 3 fois par jour pendant 30 jours consécutifs. Pas 5. Pas 10. 30. C'est là que les changements neurologiques deviennent durables."},
        {t:"Identifier tes déclencheurs précis",d:"Note les 3 situations qui font systématiquement monter ton stress. Ce ne sont pas des situations générales — ce sont des déclencheurs très précis. Les connaître donne un pouvoir immédiat dessus."},
        {t:"Le protocole post-compétition",d:"Dans les 2h après une compétition stressante : 15 min de marche lente, note 3 choses que tu as bien gérées mentalement, 1 chose à améliorer. Ce décompression active évite que le stress s'accumule sur le long terme."},
      ],
    },
    axeMethod:"Dans la méthode AXE Mental Performance®, ton profil travaille d'abord l'Alignement (A) — réconcilier ce que tu ressens avec ce que tu es réellement capable de faire. Ton potentiel réel est nettement supérieur à ce que tu montres sous pression.",
  },
  peur:{
    id:"peur",name:"Le Bloqué par la Peur",headline:"La peur te retient exactement là où tu veux aller.",
    desc:{
      default:"Ce n'est pas un manque de technique ni de condition physique. C'est un frein invisible et puissant : peur de rater, peur de décevoir, peur du jugement des autres. Tu roules en retrait, tu ne t'engages jamais totalement — et tu le sais.",
      '10-12':"T'as le niveau, mais t'as peur : peur de tomber, peur de rater devant les copains ou tes parents. Du coup tu te retiens un peu, tu freines avant les autres. C'est normal d'avoir peur. On va apprendre à oser petit à petit.",
'12-15':"T'as le niveau. Mais t'as peur de te planter devant tes potes, ton coach, tes parents. Du coup tu te retiens. Tu roules la sécurité, tu freines avant les autres. Et au fond tu sais que c'est pas ton vrai jeu.",
      '15-18':"La peur de décevoir ton entraîneur ou de rater une sélection te fait jouer en dessous de ton niveau. Ce mécanisme est très courant à ton âge — et entièrement travaillable.",
      '25+':"Après des années de compétition, certaines blessures mentales se transforment en peur de s'engager pleinement. Tu te protèges. C'est compréhensible. Mais ça te coûte des performances.",
    },
    exos:{
      default:[
        {t:"T'autoriser l'erreur — explicitement",d:"Avant chaque compétition, dis-toi à voix haute ou par écrit : 'Je m'autorise à faire 3 erreurs aujourd'hui.' Non pas en les souhaitant, mais en retirant l'interdit inconscient. Cette phrase simple change ton rapport à la prise de risque."},
        {t:"Distinguer ta valeur de tes résultats",d:"Chaque soir cette semaine, note 3 choses que tu as bien faites dans la journée — indépendamment du résultat final. Reconstruire une identité solide qui ne dépend pas du score est la fondation de tout le reste."},
        {t:"L'exposition progressive à la pression",d:"Crée des situations d'entraînement avec pression artificielle : public de 2-3 personnes, chrono au départ, mini-défi de manche avec un autre pilote. L'exposition progressive et contrôlée est le seul antidote durable à la peur."},
      ],
      '10-12':[
        {t:"Le droit de rater",d:"Avant la course, dis-toi dans ta tête : 'Si je rate, c'est pas grave, tout le monde rate.' Même les champions ratent. Ce qui compte, c'est de réessayer. Ça enlève la pression qui te bloque."},
        {t:"Je roule pour m'amuser",d:"Avant le départ, répète-toi : 'Je roule pour moi, pour le plaisir.' Pas pour faire plaisir aux autres. Quand on s'amuse, on ose plus, et on roule mieux."},
        {t:"Le petit défi courage",d:"À chaque entraînement, fais UNE chose qui te fait un peu peur : un saut, un virage un peu plus fort. Juste une. Petit à petit, ton cerveau apprend que c'est pas si dangereux, et la peur devient plus petite."},
      ],
'12-15':[
        {t:"La permission de rater",d:"Avant la compet, dis-toi dans ta tête : 'Si je rate, c'est ok. Tout le monde rate.' Pas pour baisser tes exigences — pour enlever la pression qui te bloque. Les meilleurs sportifs ratent. La différence c'est qu'ils continuent quand même."},
        {t:"Jouer pour toi, pas pour les autres",d:"Avant le départ, une phrase à te répéter : 'Je roule pour moi aujourd'hui.' Pas pour ton coach, pas pour tes parents, pas pour le classement. Pour toi. Ça change tout à l'intérieur."},
        {t:"Le défi courage",d:"À chaque entraînement cette semaine, fais une chose qui te fait un peu peur sur le vélo. Un saut que tu n'oses pas, un virage attaqué plus fort, un double que tu passes en entier. Petit à petit, ton cerveau apprend que prendre des risques n'est pas dangereux."},
      ],
      '15-18':[
        {t:"Séparer performance et sélection",d:"Note par écrit : qu'est-ce que tu contrôles dans ta performance ? (ton engagement, ta technique, ton attitude) vs qu'est-ce que tu ne contrôles pas ? (la décision du sélectionneur, le niveau des autres). Concentre toute ton énergie sur ce que tu contrôles."},
        {t:"Le journal du courage",d:"Chaque soir, note une chose que t'as faite aujourd'hui malgré une peur ou une hésitation. Même petite. Ton identité de sportif courageux se construit par accumulation de petits actes."},
        {t:"L'engagement total sur une seule action",d:"Choisis une action précise dans ta prochaine compétition où tu vas t'engager à 100% — peu importe le résultat. Une seule. Fais-la vraiment. Observe comment tu te sens après."},
      ],
      '25+':[
        {t:"Identifier les blessures qui bloquent l'engagement",d:"Note les 2-3 situations précises où tu te retiens. Souviens-toi de quand ça a commencé. Les blocages adultes ont une histoire — les identifier est la première étape pour les déconstruire."},
        {t:"La visualisation d'engagement total",d:"10 minutes avant de dormir, 3 fois par semaine : visualise-toi en compétition, t'engageant totalement sur une action qui te fait peur habituellement. Ressens la sensation de liberté après. Ton cerveau apprend même en visualisation."},
        {t:"L'analyse post-retenue",d:"Après chaque compétition où tu t'es retenu : note exactement à quel moment et pourquoi. Ce n'est pas de l'auto-critique — c'est de la data. La conscience précise du blocage est le début de sa dissolution."},
      ],
    },
    axeMethod:"La méthode AXE Mental Performance® travaille ici l'Engagement (E) — s'engager pleinement malgré le risque perçu. Ton blocage est un mécanisme de protection que ton cerveau a construit. Il était utile. Il ne l'est plus.",
  },
  confiance:{
    id:"confiance",name:"Le Sans Confiance",headline:"Ta confiance est conditionnelle. Elle doit devenir fondamentale.",
    desc:{
      default:"Tu performes correctement quand ça va. Mais dès que les résultats résistent, ta confiance s'effondre. Elle est externe — dépendante du regard des autres, des dernières performances, de l'humeur de ton entourage.",
      '10-12':"Tu roules bien quand tout va bien. Mais dès que ça se complique, ou dès que quelqu'un te fait une remarque, tu doutes vite de toi. C'est normal à ton âge. On va construire une confiance qui tient, même les jours moins faciles.",
'12-15':"Tu es bon quand ça va bien. Mais dès qu'il y a une difficulté, le doute arrive vite. Et souvent c'est ce que dit ton coach ou tes parents qui fait monter ou descendre ta confiance. C'est très courant à ton âge.",
      '15-18':"Ta confiance fluctue beaucoup selon les résultats et le regard de ton entourage sportif. En période de sélection, c'est particulièrement fragilisant. Tu as besoin de construire une confiance qui ne dépend pas de ça.",
      '25+':"Tu as eu des hauts et des bas. Et quelque part la confiance n'a jamais vraiment été stable. Elle dépend encore trop de facteurs externes — résultats, regard, validation. À ton stade il est temps de la construire sur autre chose.",
    },
    exos:{
      default:[
        {t:"Construire une confiance sur des preuves internes",d:"Chaque vendredi soir, liste 3 progrès mesurables de la semaine — pas de résultats, de progrès. Un geste mieux exécuté, une réaction plus rapide, une récupération plus courte. Bâtis un dossier de preuves de ton évolution."},
        {t:"Identifier et neutraliser ton discours saboteur",d:"Note les 3 phrases que tu te dis quand ça va mal. Construis leur exact contraire — réaliste et ancré, pas naïvement positif. Entraîne-toi à les substituer automatiquement dès que les premières apparaissent."},
        {t:"Créer des ancres de confiance inconditionnelle",d:"Définis 2-3 constantes qui ne dépendent jamais du résultat : ton niveau d'application, ton attitude face à l'adversité, ton engagement dans l'effort. Ancre ta confiance à ces constants — pas aux variables que sont les scores."},
      ],
      '10-12':[
        {t:"Mon carnet des trucs bien",d:"Chaque soir, note (ou dis à un parent) une chose que t'as bien faite dans la journée sur le vélo. Même toute petite. Ton cerveau a besoin qu'on lui montre que t'es capable."},
        {t:"Mon avis d'abord",d:"Après une course, avant de demander aux autres ce qu'ils en pensent, décide toi-même : est-ce que t'as bien roulé ? C'est TON avis qui compte le plus."},
        {t:"Ma super qualité",d:"Trouve une chose que tu fais bien en BMX (ton départ, ton courage, ton sourire). Rappelle-la-toi avant chaque course. C'est ta force, personne peut te l'enlever."},
      ],
'12-15':[
        {t:"Le carnet de victoires",d:"Chaque soir, note une chose que t'as bien faite aujourd'hui. Même petite. Même si t'as perdu. Il s'est passé quelque chose de bien. Ton cerveau a besoin qu'on lui montre des preuves que t'es capable."},
        {t:"Ta propre opinion d'abord",d:"Après chaque compet, avant de demander à ton coach ou tes parents ce qu'ils pensent — décide toi-même : est-ce que t'as bien joué ? Sur quoi tu te bases ? C'est ton évaluation qui compte le plus."},
        {t:"Une qualité certaine",d:"Note une qualité que tu as pour sûr en tant que sportif — quelque chose que personne ne peut te retirer même si tu perds. Relis-la avant chaque compétition."},
      ],
      '15-18':[
        {t:"La banque de preuves hebdomadaire",d:"Chaque dimanche soir, note 3 preuves concrètes que tu es compétent — des faits, pas des impressions. Cette banque devient ton ancre mentale quand le doute arrive en compétition."},
        {t:"Découpler résultat de sélection et valeur personnelle",d:"Exercice écrit : si tu n'es pas sélectionné, est-ce que tu vaux moins comme sportif ? Non. Rédige la liste de ce qui ne change pas si tu n'es pas pris. C'est ta valeur réelle."},
        {t:"Le protocole pré-compétition de confiance",d:"La veille : relis tes 5 meilleures performances. Le matin : répète ta phrase de confiance à voix haute 3 fois. Avant le départ : rappelle-toi une situation où tu as été vraiment fort. Ce protocole active ta confiance délibérément."},
      ],
      '25+':[
        {t:"L'inventaire de compétence réelle",d:"Assieds-toi et liste tout ce que tu as accompli sportivement — pas les titres, les actes. Les moments où tu as tenu un guidon, gagné un coude-à-coude dans un virage, sorti un départ parfait. C'est ta vraie valeur. Elle est là."},
        {t:"Séparer la confiance des résultats pour de bon",d:"Définis 3 critères de 'bonne performance' qui ne dépendent PAS du score. Engagement, technique, mental. Évalue-toi sur ces critères après chaque compétition — pendant 1 mois."},
        {t:"Le dialogue intérieur de soutien",d:"Note ce que tu te dis quand ça va mal. Maintenant écris ce qu'un entraîneur bienveillant mais honnête te dirait à la place. C'est lui qui doit parler dans ta tête — pas le critique."},
      ],
    },
    axeMethod:"Dans la méthode AXE Mental Performance®, l'Alignement (A) est ton travail prioritaire — mettre en cohérence ce que tu vaux réellement et ce que tu crois valoir. L'écart entre les deux est ton plafond de verre.",
  },
  plaisir:{
    id:"plaisir",name:"Le Performeur Fluide",headline:"L'enjeu tue tes sensations. Il ne devrait pas.",
    desc:{
      default:"Ton moteur est intrinsèque et authentique — tu aimes profondément ton sport. C'est une force rare. Mais quand l'enjeu monte, la pression de résultat écrase ce plaisir naturel, et tes performances chutent avec lui.",
      '10-12':"Tu adores rouler à l'entraînement, tu t'éclates. Mais le jour de la course, dès qu'il y a un enjeu, le plaisir s'en va et tu roules moins bien. On va faire revenir le plaisir dans les courses, parce que c'est là que t'es le plus fort.",
'12-15':"T'adores ton sport. À l'entraînement ou en roue libre avec des potes, tu roules vraiment bien. Mais en compétition, quelque chose change. Le plaisir disparaît. Et ton niveau aussi. C'est pas une fatalité.",
      '15-18':"Tu performes naturellement quand il n'y a pas trop d'enjeu. Mais dès que c'est une sélection ou un résultat important, la pression écrase ton pilotage naturel. Ton talent est là — c'est le cadre qui te bloque.",
      '25+':"Tu performes mieux quand c'est pour le plaisir. Mais les années d'enjeux ont installé une distance entre toi et ton pilotage naturel. Tu cherches à retrouver cette fluidité que tu avais. Elle est encore là.",
    },
    exos:{
      default:[
        {t:"Réintroduire le plaisir comme stratégie",d:"Avant chaque compétition, écris 3 choses que tu aimes dans ton sport. Relis-les juste avant le début. Reconnecte-toi à ça de manière délibérée. Le plaisir n'est pas un luxe — c'est ce qui te permet de performer."},
        {t:"Des objectifs de processus, pas de résultat",d:"Pour ta prochaine compétition, choisis 1 ou 2 objectifs de pilotage uniquement (ex : 'je sors le premier au portillon', 'j'attaque la première bosse'). Ce focus interne te donne un but qui ne dépend pas du score — et libère immédiatement ton naturel."},
        {t:"Apprendre à tolérer l'enjeu",d:"La compétition ne tue pas ton plaisir — c'est ta peur du résultat qui le fait. Avant la compétition, décide consciemment : 'quoi qu'il arrive au score, je m'engage à 100% dans ma course.' Cette décision proactive change tout."},
      ],
      '10-12':[
        {t:"La course = un grand terrain de jeu",d:"Avant de partir, rappelle-toi que la course, c'est juste un entraînement en plus grand, avec des copains. On est là pour s'amuser à pédaler vite. Le jeu d'abord."},
        {t:"Mon sourire de départ",d:"Sur le portillon, souris, même un tout petit peu. Ça paraît bête, mais sourire dit à ton cerveau qu'on est là pour le plaisir, et ça débloque tes sensations."},
        {t:"Le meilleur moment",d:"Après chaque course, trouve le moment que t'as préféré : un saut, une relance, un dépassement. Garde ça en tête. Tu roules pour ces moments-là."},
      ],
'12-15':[
        {t:"Te rappeler pourquoi tu aimes ça",d:"Avant chaque compet, pense à un moment où tu t'es vraiment éclaté dans ton sport — à l'entraînement ou ailleurs. Ressens cette sensation. Emmène-la avec toi dans la compétition."},
        {t:"Un seul objectif de jeu",d:"Choisis une chose que tu veux faire dans cette compet — pas gagner, pas finir premier. Une action précise. Concentre-toi là-dessus. Quand tu t'occupes du jeu au lieu du résultat, ça marche mieux."},
        {t:"Jouer comme si personne ne regardait",d:"Au début de la compet, imagine que t'es seul sur la piste en train de t'entraîner, comme un mardi soir au club. Les enjeux disparaissent 2 minutes dans ta tête. Puis tu repars de là."},
      ],
      '15-18':[
        {t:"La reconnexion au plaisir avant la pression",d:"La veille de chaque compétition importante : 10 minutes à faire quelque chose que tu aimes dans ton sport sans enjeu. Recharger cette ressource modifie ton état mental le lendemain."},
        {t:"Le focus processus en compétition de sélection",d:"Définis 3 intentions de jeu avant la compétition. Pas de résultat, pas de sélection — 3 actions concrètes qui dépendent de toi. En te concentrant là-dessus, tu performes mieux et tu penses moins à la sélection."},
        {t:"L'ancre du plaisir",d:"Identifie un geste ou une sensation qui représente ton meilleur pilotage. Rejoue-la mentalement 3 fois avant la compétition. Ton cerveau active les circuits associés — et tu repartes de là plutôt que de la pression."},
      ],
      '25+':[
        {t:"Retrouver le jeu originel",d:"Souviens-toi pourquoi tu as commencé ce sport. Pas pour les résultats — pour quoi exactement. Écris-le. Relis-le avant chaque compétition pendant 1 mois. Ça réengage un moteur qui s'est peut-être éteint progressivement."},
        {t:"Une compétition pour le plaisir par mois",d:"Inscris-toi à une compétition sans enjeu — niveau inférieur, format différent, juste pour jouer. Observer comment tu performes sans pression est une information précieuse et régénérante."},
        {t:"Séparer performance et résultat une fois pour toutes",d:"Définis par écrit ce qu'est une 'bonne performance' pour toi — indépendamment du résultat. Évalue-toi sur ces critères. C'est ton vrai standard. Pas le classement."},
      ],
    },
    axeMethod:"La méthode AXE Mental Performance® travaille ici l'Exigence (X) — une exigence tournée vers le jeu et le processus, pas vers le résultat. Tu dois apprendre à performer sans éteindre ce qui te fait aimer ton sport.",
  },
  compet:{
    id:"compet",name:"L'Hypercompétiteur",headline:"Tu brûles d'une flamme qui risque de te consumer.",
    desc:{
      default:"La victoire est ton oxygène. Tu ne te pardonnes rien. Chaque défaite est une blessure. Cette exigence extrême génère une tension chronique dans ton corps et ton mental qui finit par brider tes performances — trop de crispation, pas assez de fluidité.",
      '10-12':"T'as super envie de gagner, et c'est une belle force ! Mais des fois, tu veux tellement gagner que tu t'énerves ou que tu te crispes, et ça te fait rouler moins bien. On va apprendre à garder cette envie sans qu'elle te gêne.",
'12-15':"Tu veux gagner — vraiment. Et quand tu perds, ça te bouffe. Tu te repasses la manche dans la tête, virage par virage, et tu t'en veux. C'est une qualité rare. Mais si tu apprends pas à gérer ça, ça risque de te peser de plus en plus avec les années.",
      '15-18':"Ton niveau d'exigence est impressionnant. Mais il génère une tension permanente qui bride ta fluidité au pire moment. La pression de la sélection amplifie encore ça. Apprendre à performer avec fluidité plutôt qu'avec crispation — c'est ton enjeu principal.",
      '25+':"Des années d'exigence ont accumulé une tension mentale chronique. Tu performes encore — mais de moins en moins dans la fluidité. Tes meilleures années ne sont pas derrière toi si tu apprends à réguler cette exigence sans l'éteindre.",
    },
    exos:{
      default:[
        {t:"Performer dans la fluidité, pas dans la crispation",d:"Entre chaque action importante, accorde-toi 3 secondes : une respiration, un repère visuel fixe, puis repars. Ce geste simple casse le cycle de tension qui s'accumule et libère 15 à 20% d'efficacité immédiate."},
        {t:"Distinguer exigence juste et auto-maltraitance",d:"Après chaque compétition, crée deux listes séparées : ce que tu as bien fait (liste 1), ce à améliorer avec un plan précis (liste 2). Tu ne lis probablement jamais la liste 1. Ce déséquilibre te coûte très cher."},
        {t:"Réapprendre à rouler pour le plaisir, pas seulement pour gagner",d:"Une fois par semaine, fais une session avec une règle unique : pas de chrono, pas de comparaison. Juste les sensations, le flow des bosses, le plaisir de piloter. Ça te rend plus durable — pas moins compétitif."},
      ],
      '10-12':[
        {t:"Gagner mon départ à moi",d:"Au lieu de penser 'je dois finir premier', pense 'je fais le meilleur départ possible'. Ça, tu le contrôles. Et souvent, un super départ, ça donne une super course."},
        {t:"Le calme après une erreur",d:"Si tu rates quelque chose, souffle un coup et dis 'la prochaine sera meilleure'. S'énerver fait perdre du temps et de l'énergie. Rester calme, c'est être plus fort."},
        {t:"Content de ma course",d:"Après chaque course, demande-toi : est-ce que j'ai tout donné ? Si oui, sois fier, peu importe la place. Donner le meilleur, c'est ça la vraie victoire à ton âge."},
      ],
'12-15':[
        {t:"L'erreur est une information",d:"Après chaque erreur ou défaite, une seule question : 'qu'est-ce que j'apprends ?' Pas 'pourquoi j'ai raté', pas 'je suis nul'. Une information utile. Ça change comment ton cerveau traite la défaite."},
        {t:"Souffler entre les actions",d:"Entre deux actions importantes, fais une grande respiration et regarde un point fixe 2 secondes. Ça peut sembler petit mais ça casse la tension qui monte action après action."},
        {t:"Une chose que t'as bien faite",d:"Après chaque compet — même perdue — trouve une chose que t'as bien faite. Une seule. Prends-en conscience. Ton cerveau a besoin de ça pour maintenir l'énergie sur le long terme."},
      ],
      '15-18':[
        {t:"Le reset entre les efforts",d:"Entre deux parties ou deux efforts : 3 secondes, souffle fort, un mot-ancre, regard fixe. Ce protocole de 3 secondes t'empêche d'accumuler la tension tout au long de la compétition."},
        {t:"L'analyse post-comp calibrée",d:"Dans les 48h après : note 3 choses bien faites et 1 seule chose à améliorer. Une. Pas cinq. La surcharge de points d'amélioration génère une pression toxique. Un point, un plan, c'est suffisant."},
        {t:"Visualiser la fluidité",d:"3 fois par semaine avant de dormir : visualise-toi en compétition, performant avec légèreté et fluidité — intense mais pas crispé. Ton cerveau mémorise cet état et le rend plus accessible en situation réelle."},
      ],
      '25+':[
        {t:"L'inventaire du coût réel",d:"Estime honnêtement : combien de ton énergie mentale est consommée par l'autocritique et la pression que tu te mets ? 20% ? 40% ? Cette énergie redirigée vers la performance ferait quelle différence ?"},
        {t:"Le protocole de décompression post-défaite",d:"Dans les 2h après une défaite difficile : 20 min de marche, note 3 choses que tu as bien gérées, une chose à améliorer, puis ferme le dossier mentalement. Cette séquence évite que la tension s'accumule sur les semaines."},
        {t:"Performer avec intensité calme",d:"Les meilleurs compétiteurs expérimentés décrivent tous le même état : 'j'étais calme et intense à la fois.' Entraîne-toi à trouver cet état à l'entraînement d'abord — puis tu le transportes en compétition."},
      ],
    },
    axeMethod:"Dans la méthode AXE Mental Performance®, ton travail principal est l'Exigence (X) juste — pas l'exigence toxique. Ta compétitivité est une arme exceptionnelle. Mais une arme mal maniée blesse son porteur.",
  },
};
