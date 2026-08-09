/* ═══ AXE · DONNÉES PHYSIQUES ═══
   10 questions physiques + adaptations 10-12 ans + 5 profils physiques.
   Les 5 dimensions : explo (départ) · moteur (résistance) · charpente (gainage)
   appuis (coordination/équilibre) · poigne (force haut du corps).
   Tous les exercices sont au poids du corps, sans aucun accessoire, faisables
   tous les jours dans un couloir ou un bout de jardin. */

const QP_BASE = [
  // ── EXPLOSIVITÉ · le départ ──
  {cat:"Explosivité · Le départ",text:"Sur les trois premiers coups de pédale après la chute de grille, tu es :",opts:[
    {t:"Devant — c'est souvent là que je fais la différence.",s:{explo:4,moteur:3,charpente:3,appuis:3,poigne:4}},
    {t:"Dans le paquet, jamais loin des premiers.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
    {t:"Un peu en retard — je reviens ensuite dans le premier virage.",s:{explo:2,moteur:3,charpente:2,appuis:3,poigne:2}},
    {t:"Nettement derrière — mon départ est mon point noir.",s:{explo:1,moteur:2,charpente:2,appuis:2,poigne:1}},
  ]},
  {cat:"Explosivité · Les relances",text:"Quand il faut remettre de la vitesse en sortie de virage, tes jambes :",opts:[
    {t:"Répondent tout de suite — j'ai de la patate sur deux ou trois coups de pédale.",s:{explo:4,moteur:3,charpente:3,appuis:3,poigne:3}},
    {t:"Répondent correctement, sans être fulgurantes.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
    {t:"Mettent un temps à repartir — je perds du terrain à chaque relance.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:2}},
    {t:"Sont lourdes — relancer me coûte énormément.",s:{explo:1,moteur:1,charpente:2,appuis:2,poigne:2}},
  ]},

  // ── MOTEUR · tenir toute la manche ──
  {cat:"Moteur · La fin de manche",text:"Dans la dernière ligne droite, quand ça se joue à la pédale :",opts:[
    {t:"J'ai encore de la ressource — je peux accélérer sur la fin.",s:{explo:3,moteur:4,charpente:3,appuis:3,poigne:3}},
    {t:"Je tiens mon rythme jusqu'au bout sans faiblir.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
    {t:"Je sens que ça baisse — les jambes brûlent et le rythme tombe.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:2}},
    {t:"Je finis à l'agonie — la fin de manche est un calvaire.",s:{explo:2,moteur:1,charpente:1,appuis:2,poigne:2}},
  ]},
  {cat:"Moteur · L'enchaînement des manches",text:"Entre deux manches, avec une vingtaine de minutes de récupération :",opts:[
    {t:"Je repars comme si c'était la première — je suis frais.",s:{explo:3,moteur:4,charpente:3,appuis:3,poigne:3}},
    {t:"Je récupère bien, la deuxième manche est aussi bonne.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
    {t:"Je sens la fatigue s'accumuler manche après manche.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:2}},
    {t:"Ma dernière manche de la journée est toujours la plus mauvaise.",s:{explo:2,moteur:1,charpente:2,appuis:2,poigne:1}},
  ]},

  // ── CHARPENTE · gainage et transmission ──
  {cat:"Charpente · La tenue du vélo",text:"Sur une section de rythme ou une table, ton corps au-dessus du vélo :",opts:[
    {t:"Reste solide et stable — le vélo bouge, pas moi.",s:{explo:3,moteur:3,charpente:4,appuis:4,poigne:3}},
    {t:"Est plutôt stable, avec quelques flottements.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
    {t:"Se fait secouer — j'encaisse mal les réceptions.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:2}},
    {t:"Part dans tous les sens — je me fais balader par le vélo.",s:{explo:2,moteur:2,charpente:1,appuis:2,poigne:2}},
  ]},
  {cat:"Charpente · La transmission de force",text:"Quand tu pédales debout en force, ton bassin et ton dos :",opts:[
    {t:"Restent fixes — toute la force part dans les pédales.",s:{explo:4,moteur:3,charpente:4,appuis:3,poigne:3}},
    {t:"Bougent un peu, sans que ça me gêne vraiment.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
    {t:"Se balancent d'un côté à l'autre quand je force.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:2}},
    {t:"Me font mal au bas du dos après une grosse séance.",s:{explo:2,moteur:2,charpente:1,appuis:2,poigne:2}},
  ]},

  // ── APPUIS · coordination et équilibre ──
  {cat:"Appuis · Le pumping",text:"Pour passer une section entière en pumping, sans pédaler :",opts:[
    {t:"Je gagne de la vitesse — c'est un point fort chez moi.",s:{explo:3,moteur:3,charpente:4,appuis:4,poigne:3}},
    {t:"Je m'en sors bien, je garde ma vitesse.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
    {t:"Je perds de la vitesse, je préfère pédaler.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:2}},
    {t:"Je n'y arrive pas vraiment — je subis le terrain.",s:{explo:2,moteur:2,charpente:2,appuis:1,poigne:2}},
  ]},
  {cat:"Appuis · L'équilibre",text:"Tenir en équilibre sur une seule jambe, les yeux fermés, pendant 30 secondes :",opts:[
    {t:"Facile — je pourrais tenir bien plus longtemps.",s:{explo:3,moteur:3,charpente:4,appuis:4,poigne:3}},
    {t:"Je tiens, en vacillant un peu.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
    {t:"Je repose le pied avant la fin.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:2}},
    {t:"Je tiens à peine quelques secondes.",s:{explo:2,moteur:2,charpente:2,appuis:1,poigne:2}},
  ]},

  // ── POIGNE · force du haut du corps ──
  {cat:"Poigne · Le tirage au portillon",text:"Au moment de tirer sur le guidon pour lancer ton départ :",opts:[
    {t:"J'arrache — mes bras envoient autant que mes jambes.",s:{explo:4,moteur:3,charpente:4,appuis:3,poigne:4}},
    {t:"Je tire correctement, sans que ce soit ma force.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
    {t:"Je pousse surtout avec les jambes, mes bras suivent mal.",s:{explo:2,moteur:3,charpente:2,appuis:3,poigne:2}},
    {t:"Mes bras lâchent — je n'ai pas la force de tirer fort.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:1}},
  ]},
  {cat:"Poigne · La résistance des avant-bras",text:"En fin de journée de course, tes mains et tes avant-bras :",opts:[
    {t:"Vont bien — je pourrais enchaîner encore des manches.",s:{explo:3,moteur:4,charpente:3,appuis:3,poigne:4}},
    {t:"Sont un peu fatigués, sans plus.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
    {t:"Sont durs et douloureux — j'ai du mal à serrer le guidon.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:2}},
    {t:"Me lâchent complètement — je ne sens plus mes mains.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:1}},
  ]},
];

/* Adaptations 10-12 ans : même logique de score, mots d'enfant. */
const AGE_TWEAKS_PHYS = {
  '10-12':{
    3:{cat:"Moteur · L'enchaînement des manches",text:"Quand tu fais plusieurs manches dans la journée :",opts:[
      {t:"Je suis en forme jusqu'à la dernière, j'en redemande.",s:{explo:3,moteur:4,charpente:3,appuis:3,poigne:3}},
      {t:"Ça va, je récupère bien entre les manches.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
      {t:"Je suis fatigué sur la fin de la journée.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:2}},
      {t:"Ma dernière manche est toujours la moins bonne, je suis épuisé.",s:{explo:2,moteur:1,charpente:2,appuis:2,poigne:1}},
    ]},
    5:{cat:"Charpente · La transmission de force",text:"Quand tu pédales debout de toutes tes forces, ton corps :",opts:[
      {t:"Reste bien droit, tout part dans les pédales.",s:{explo:4,moteur:3,charpente:4,appuis:3,poigne:3}},
      {t:"Bouge un peu, mais ça va.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
      {t:"Se balance beaucoup de gauche à droite.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:2}},
      {t:"J'ai souvent mal au dos après avoir roulé.",s:{explo:2,moteur:2,charpente:1,appuis:2,poigne:2}},
    ]},
    8:{cat:"Poigne · Le tirage au portillon",text:"Quand tu tires sur ton guidon au départ :",opts:[
      {t:"Je tire très fort, mes bras m'aident beaucoup.",s:{explo:4,moteur:3,charpente:4,appuis:3,poigne:4}},
      {t:"Je tire normalement.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
      {t:"Ce sont surtout mes jambes qui font le travail.",s:{explo:2,moteur:3,charpente:2,appuis:3,poigne:2}},
      {t:"Mes bras ne sont pas assez forts pour tirer.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:1}},
    ]},
    9:{cat:"Poigne · La résistance des avant-bras",text:"À la fin d'une journée de BMX, tes mains :",opts:[
      {t:"Vont bien, je pourrais encore rouler longtemps.",s:{explo:3,moteur:4,charpente:3,appuis:3,poigne:4}},
      {t:"Sont un peu fatiguées.",s:{explo:3,moteur:3,charpente:3,appuis:3,poigne:3}},
      {t:"Me font mal, j'ai du mal à serrer le guidon.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:2}},
      {t:"Sont toutes molles, je ne les sens plus.",s:{explo:2,moteur:2,charpente:2,appuis:2,poigne:1}},
    ]},
  },
};

const PROFILS_PHYS = {
  explo:{
    id:"explo",name:"L'Explosivité",court:"Explosivité",
    headline:"Ce qui se joue dans les trois premiers coups de pédale.",
    fort:{
      default:"Ta capacité à produire de la force très vite est ton atout. C'est la qualité la plus rentable en BMX Race : elle décide de la première place au premier virage, et le premier virage décide souvent de la manche.",
      '10-12':"Tu pars vite, et c'est un super point fort. En BMX, celui qui sort devant au premier virage a déjà fait la moitié du travail. Garde ça précieusement.",
      '12-15':"Ton explosivité est ton arme. Sur un sport où la manche se joue en 35 secondes, savoir tout donner sur les trois premiers coups de pédale est ce qui te met devant.",
      '15-18':"Ta puissance sur les premiers appuis est un vrai avantage compétitif. C'est la qualité la plus difficile à développer chez les autres — la tienne est déjà là.",
    },
    faible:{
      default:"Tu perds ta course avant le premier virage. Ce n'est pas un problème de vélo ni de technique de départ : ton corps ne sait pas encore produire beaucoup de force en très peu de temps.",
      '10-12':"Tu sors souvent derrière au départ, et ensuite c'est dur de remonter. Ce n'est pas grave et ce n'est pas parce que tu es « moins fort » : ton corps n'a pas encore appris à pousser très fort d'un coup. Ça s'entraîne, et ça va vite.",
      '12-15':"Ton départ te coûte des places que ton pilotage ne rattrape pas. Tant que ta force n'est pas explosive, tu roules chaque manche avec un handicap dès la chute de grille.",
      '15-18':"À ton niveau, l'écart au départ ne se rattrape plus. Ton explosivité est le facteur limitant le plus direct entre toi et le niveau que tu vises.",
    },
    exos:{
      default:[
        {t:"Le squat sauté",d:"Debout, pieds écartés largeur de bassin. Descends en squat jusqu'à ce que tes cuisses soient à mi-hauteur, puis saute le plus haut possible. Amortis la réception en pliant les genoux et enchaîne. 3 séries de 8 sauts, 1 minute de repos entre les séries. La consigne qui compte : ne cherche pas à en faire beaucoup, cherche à sauter haut à chaque répétition."},
        {t:"La fente sautée alternée",d:"En position de fente, genou arrière proche du sol. Saute et change de jambe en l'air, atterris dans la fente opposée. 3 séries de 10 changements. C'est le mouvement qui ressemble le plus à ta poussée sur le portillon : une jambe devant, une derrière, et toute la force qui part vers l'avant."},
      ],
      '10-12':[
        {t:"Le jeu de la grenouille",d:"Accroupi, mains au sol. Saute le plus loin possible vers l'avant, atterris accroupi, recommence. Fais 10 sauts, repose-toi 1 minute, puis refais 10 sauts. Deux fois. Amuse-toi à marquer où tu atterris et essaie de battre ta marque le lendemain."},
        {t:"Le départ imaginaire",d:"Debout comme sur ton portillon, un pied devant. Compte « 3, 2, 1 » dans ta tête, puis explose vers l'avant en poussant très fort sur ta jambe avant, comme si la grille tombait. Marche pour revenir, et recommence. 8 départs, deux fois dans la journée. Ton corps apprend le geste sans le vélo."},
      ],
      '12-15':[
        {t:"Le squat sauté maximal",d:"Descends en squat à mi-hauteur, puis saute le plus haut possible. 4 séries de 6 sauts, 1 minute 30 de repos. La qualité prime sur la quantité : si tu sautes moins haut à la sixième répétition, arrête la série. Tu entraînes l'explosivité, pas l'endurance."},
        {t:"La poussée de portillon au mur",d:"Face à un mur, mains à plat à hauteur de poitrine, un pied devant l'autre. Pousse le mur de toutes tes forces pendant 5 secondes, comme si tu tirais ton guidon au départ. Relâche 20 secondes. 6 répétitions par jambe avant. Tu apprends à recruter tout ton corps d'un coup — bras et jambes ensemble, exactement comme au portillon."},
      ],
      '15-18':[
        {t:"Le squat sauté avec temps d'arrêt",d:"Descends en squat, marque 2 secondes d'arrêt complet en bas, puis saute le plus haut possible. 4 séries de 5 sauts, 2 minutes de repos. Le temps d'arrêt supprime le rebond élastique et t'oblige à produire la force à partir de zéro — exactement la situation du portillon, où tu pars à l'arrêt."},
        {t:"Le saut en longueur sans élan",d:"Debout, pieds joints, saute le plus loin possible et amortis proprement. 5 séries de 3 sauts, 90 secondes de repos. Mesure ta meilleure distance une fois par semaine, toujours dans les mêmes conditions : c'est ton indicateur d'explosivité, et il doit progresser. Si la distance stagne trois semaines, ta récupération est en cause avant ton entraînement."},
      ],
    },
  },

  moteur:{
    id:"moteur",name:"Le Moteur",court:"Résistance",
    headline:"Tenir la même intensité du portillon à la ligne.",
    fort:{
      default:"Tu tiens l'intensité du début à la fin, et tu enchaînes les manches sans t'écrouler. C'est ce qui te rend fiable sur une journée entière de course, quand les autres baissent en finale.",
      '10-12':"Tu as un bon moteur : tu tiens toute la manche et tu es encore en forme à la fin de la journée. C'est un vrai avantage, parce que beaucoup de pilotes sont fatigués au moment où ça compte le plus.",
      '12-15':"Ta résistance te permet de finir tes manches aussi fort que tu les commences, et d'aborder ta finale avec les mêmes jambes que ton premier tour. Beaucoup de pilotes rapides perdent exactement là.",
      '15-18':"Ta capacité à répéter l'effort est un atout de compétiteur. Sur un format à manches multiples, c'est souvent ce qui sépare celui qui finit sur la boîte de celui qui s'éteint en demi.",
    },
    faible:{
      default:"Tu commences bien et tu finis mal. Ton corps ne tient pas encore l'intensité sur la durée d'une manche, et encore moins sur une journée complète de course.",
      '10-12':"Tu es en forme au début, mais après tu es fatigué et ça se voit sur tes dernières manches. C'est normal, ton corps est en train de grandir. On peut l'aider à tenir plus longtemps avec des exercices courts et rigolos.",
      '12-15':"Ta fin de manche est ton point faible : les jambes brûlent, le rythme tombe, et tu te fais reprendre exactement là où ça se décide. Ta vitesse est là, ta capacité à la tenir ne l'est pas encore.",
      '15-18':"Ton problème n'est pas la vitesse de pointe, c'est de la maintenir. En fin de manche et en fin de journée, tu perds ce que tu as construit — c'est le poste de progression le plus rentable pour toi cette saison.",
    },
    exos:{
      default:[
        {t:"Le format 30/30",d:"30 secondes d'effort maximal (montées de genoux rapides, sur place), 30 secondes de marche lente. 8 répétitions. Total : 8 minutes. Ce format reproduit exactement le rapport effort/récupération d'une manche de BMX. C'est court, c'est dur, et c'est ce qui transforme un moteur."},
        {t:"La chaise contre le mur",d:"Dos plaqué au mur, cuisses à l'horizontale, comme assis sur une chaise invisible. Tiens le plus longtemps possible. 3 séries, 2 minutes de repos. Note ton temps chaque semaine. Tes cuisses apprennent à travailler quand elles brûlent — précisément la sensation de la dernière ligne droite."},
      ],
      '10-12':[
        {t:"Le défi des 30 secondes",d:"Cours sur place en montant les genoux très haut, aussi vite que tu peux, pendant 30 secondes. Puis marche tranquillement 30 secondes. Recommence 6 fois. Ça dure 6 minutes en tout. Demande à quelqu'un de te chronométrer et essaie de garder la même vitesse jusqu'à la dernière fois — c'est ça, le vrai défi."},
        {t:"La chaise invisible",d:"Colle ton dos à un mur et plie les jambes comme si tu étais assis sur une chaise. Tiens aussi longtemps que tu peux. Repose-toi 2 minutes, recommence 3 fois. Écris ton record sur un papier et essaie de le battre chaque semaine. Tes jambes vont apprendre à ne pas abandonner quand ça brûle."},
      ],
      '12-15':[
        {t:"Le 40/20 spécifique",d:"40 secondes d'effort maximal (burpees ou montées de genoux), 20 secondes de repos complet. 8 répétitions. 40 secondes, c'est la durée d'une manche : tu entraînes ton corps sur le bon format. Fais-le 3 fois par semaine, jamais la veille d'une course."},
        {t:"Le circuit des trois",d:"Enchaîne sans repos : 20 squats, 10 pompes, 20 montées de genoux rapides. C'est un tour. Fais 4 tours avec 90 secondes entre chaque. Chronomètre ton temps total et essaie de le baisser semaine après semaine. Tu travailles ta résistance et ta force en même temps."},
      ],
      '15-18':[
        {t:"Le protocole 40/20 sur 3 blocs",d:"3 blocs de 6 répétitions (40 secondes maximales / 20 secondes de repos), avec 3 minutes de récupération entre les blocs. Alterne les mouvements : squats sautés, burpees, montées de genoux. Ce volume développe ta tolérance à l'accumulation lactique — la sensation exacte du dernier virage."},
        {t:"Les répétitions longues en côte",d:"Trouve une montée qui te prend 45 à 60 secondes à monter en courant vite. Monte à 90 % de ton maximum, redescends en marchant. 6 répétitions. Une fois par semaine, en début de semaine. Si tu n'as pas de côte, remplace par 60 secondes de squats sautés à cadence soutenue."},
      ],
    },
  },

  charpente:{
    id:"charpente",name:"La Charpente",court:"Gainage",
    headline:"Le tronc qui transforme ta force en vitesse.",
    fort:{
      default:"Ton gainage est solide : ta force part dans les pédales au lieu de se perdre en mouvements parasites, et tu encaisses les réceptions sans te faire balader. C'est la qualité la moins visible et la plus rentable.",
      '10-12':"Ton corps est solide sur le vélo : tu ne te fais pas secouer, tu restes bien placé. C'est très bien, parce que ça veut dire que toute ta force sert à avancer.",
      '12-15':"Un tronc solide, c'est ce qui fait que ta puissance arrive vraiment aux pédales. Le tien fait son travail — c'est aussi ta meilleure protection contre les douleurs de dos à l'adolescence.",
      '15-18':"Ta chaîne de transmission est efficace : peu de fuite d'énergie, une bonne tenue sur les réceptions. C'est un socle qui te permet d'encaisser des charges d'entraînement plus lourdes sans casser.",
    },
    faible:{
      default:"Tu produis de la force, mais une partie se perd en route. Ton bassin bouge, ton dos compense, et le vélo te balade sur les réceptions. Tu pédales plus fort que tu ne vas vite.",
      '10-12':"Sur le vélo, ton corps bouge beaucoup et tu te fais secouer par les bosses. Ce n'est pas ta faute : les muscles du ventre et du dos qui tiennent tout ça ne sont pas encore assez forts. On va les réveiller avec des exercices simples.",
      '12-15':"C'est la période où le corps grandit vite et où le gainage ne suit pas toujours. Résultat : ton bassin se balance quand tu forces, tu encaisses mal les réceptions, et parfois le bas du dos tire. Ta force existe, elle n'arrive juste pas entièrement aux pédales.",
      '15-18':"Ton déficit de gainage te coûte deux fois : en rendement (une partie de ta puissance se dissipe) et en risque (le bas du dos encaisse ce que le tronc ne tient pas). C'est le premier verrou à lever avant d'augmenter les charges.",
    },
    exos:{
      default:[
        {t:"La planche stricte",d:"Sur les avant-bras, corps parfaitement aligné des talons à la tête, fessiers serrés, ventre rentré. Tiens 30 secondes, repose 30 secondes. 4 répétitions. La règle absolue : dès que le bassin s'affaisse ou remonte, tu arrêtes la série. Trente secondes parfaites valent mieux que deux minutes approximatives."},
        {t:"Le hollow hold",d:"Allongé sur le dos, bas du dos plaqué au sol, jambes tendues à 20 cm du sol et bras tendus derrière la tête. Tiens 20 secondes, repose 40 secondes. 4 répétitions. C'est la position qui ressemble le plus à ta posture de pilote en attaque : tronc engagé, force qui traverse le corps."},
      ],
      '10-12':[
        {t:"La planche du surfeur",d:"Mets-toi en position de planche sur les avant-bras, le corps bien droit comme une planche de surf. Tiens 20 secondes sans bouger les fesses. Repose-toi 30 secondes, refais 4 fois. Demande à quelqu'un de vérifier que tes fesses ne montent pas et ne descendent pas."},
        {t:"Le Superman",d:"Allongé sur le ventre, bras tendus devant toi. Décolle en même temps les bras, la poitrine et les jambes du sol, comme Superman qui vole. Tiens 10 secondes, repose 20 secondes, refais 6 fois. Ça muscle tout ton dos, celui qui te tient droit sur le vélo."},
      ],
      '12-15':[
        {t:"La planche latérale",d:"Sur un avant-bras, sur le côté, corps parfaitement aligné, hanche haute. 30 secondes de chaque côté, 3 fois. C'est la version qui travaille les muscles qui empêchent ton bassin de se balancer quand tu pédales debout. Si ta hanche descend, arrête et recommence après repos."},
        {t:"Le dead bug",d:"Sur le dos, bras tendus vers le plafond, genoux pliés à 90°. Descends lentement le bras droit derrière la tête et la jambe gauche vers le sol, sans jamais décoller le bas du dos. Reviens, alterne. 3 séries de 8 par côté. Lent, contrôlé. Le bas du dos doit rester collé au sol du début à la fin — c'est tout l'exercice."},
      ],
      '15-18':[
        {t:"La planche avec transfert d'appui",d:"En position de planche sur les avant-bras, décolle un pied de quelques centimètres, tiens 3 secondes, repose, alterne. 3 séries de 10 alternances. Le but n'est pas de tenir longtemps mais de résister à la rotation du bassin — exactement ce que ton tronc doit faire à chaque coup de pédale en danseuse."},
        {t:"Le hollow rock",d:"Position hollow (bas du dos plaqué, jambes et bras tendus décollés), puis balance-toi d'avant en arrière comme une bascule, sans jamais casser la position. 3 séries de 20 secondes, 1 minute de repos. Exigeant. Si la position se casse, reviens au hollow hold statique et progresse depuis là."},
      ],
    },
  },

  appuis:{
    id:"appuis",name:"Les Appuis",court:"Coordination",
    headline:"Le pilotage passe par les pieds, pas par le guidon.",
    fort:{
      default:"Tu as des appuis fins : tu lis le terrain, tu gagnes de la vitesse en pumping, tu restes équilibré quand ça bouge. C'est ce qui te fait aller vite sans pédaler plus.",
      '10-12':"Tu as un très bon équilibre et tu sens bien ton vélo. C'est un cadeau : les pilotes qui ont ça apprennent les nouvelles sections beaucoup plus vite que les autres.",
      '12-15':"Ta coordination te permet de gagner de la vitesse là où les autres en perdent. C'est la qualité qui rend un pilotage fluide, et elle se voit tout de suite au bord de la piste.",
      '15-18':"Ta qualité d'appuis est un avantage technique réel : tu transformes le terrain en vitesse au lieu de le subir. C'est ce qui te permet d'aller vite avec moins de dépense énergétique que tes adversaires.",
    },
    faible:{
      default:"Tu subis le terrain au lieu de t'en servir. Tu perds de la vitesse là où d'autres en gagnent, et tu compenses en pédalant davantage — ce qui te fatigue plus vite pour un résultat moindre.",
      '10-12':"Tu as encore du mal à sentir ton équilibre et à te servir des bosses pour aller plus vite. C'est complètement normal à ton âge, et c'est justement le meilleur moment pour l'apprendre : ton cerveau enregistre ces choses-là très vite.",
      '12-15':"Ton pumping ne te rapporte pas de vitesse, donc tu pédales pour compenser — et tu arrives fatigué là où les autres arrivent lancés. C'est un déficit de coordination, pas de puissance.",
      '15-18':"Ton rendement technique est ton frein. À puissance égale, un pilote avec de meilleurs appuis va plus vite en dépensant moins. C'est le poste où tu as le plus de temps à récupérer sans gagner un watt.",
    },
    exos:{
      default:[
        {t:"L'équilibre unipodal yeux fermés",d:"Debout sur une jambe, l'autre pied décollé, yeux fermés. Tiens 30 secondes, change de jambe. 3 fois par jambe. Les yeux fermés forcent ton corps à se piloter par les sensations plutôt que par la vue — exactement ce qui se passe quand le terrain défile trop vite pour être analysé."},
        {t:"Les sauts latéraux contrôlés",d:"Saute latéralement d'un pied sur l'autre, sur environ un mètre, et stabilise-toi 2 secondes à chaque réception avant de repartir. 3 séries de 12 sauts. La pause à la réception est l'exercice : elle t'apprend à retrouver ton équilibre instantanément après un déséquilibre."},
      ],
      '10-12':[
        {t:"Le jeu du flamant rose",d:"Tiens-toi sur une seule jambe, les yeux fermés, et compte dans ta tête jusqu'à ce que tu doives reposer le pied. Change de jambe. Fais-le 3 fois de chaque côté. Essaie de battre ton record chaque jour. Tu peux jouer contre quelqu'un de ta famille — les enfants gagnent souvent."},
        {t:"Les sauts de la rivière",d:"Imagine une rivière large d'un pas. Saute d'un côté à l'autre sur un seul pied, et essaie de rester parfaitement immobile 2 secondes après chaque saut avant de repartir. 10 sauts, 3 fois. Rester immobile est plus difficile que sauter — c'est justement ce qu'on entraîne."},
      ],
      '12-15':[
        {t:"L'équilibre dynamique",d:"Sur une jambe, penche-toi vers l'avant en tendant l'autre jambe derrière toi jusqu'à former un T, puis reviens debout sans poser le pied. 3 séries de 8 par jambe, lentement. Tu entraînes les micro-ajustements de cheville et de hanche qui te tiennent en place quand le vélo bouge sous toi."},
        {t:"Le skater jump",d:"Saute latéralement d'un pied sur l'autre en croisant la jambe libre derrière, comme un patineur de vitesse. Stabilise 1 seconde à chaque réception. 3 séries de 16 sauts. Ce mouvement travaille l'appui latéral, celui qui te tient dans les virages relevés."},
      ],
      '15-18':[
        {t:"L'équilibre unipodal perturbé",d:"Debout sur une jambe, yeux fermés, fais tourner lentement ta tête de gauche à droite pendant 30 secondes. 3 fois par jambe. Tu perturbes volontairement ton système d'équilibre pour le forcer à devenir plus robuste — le transfert sur piste est direct sur les sections rapides."},
        {t:"Le circuit d'appuis enchaînés",d:"Enchaîne sans pause : 6 sauts latéraux avec arrêt, 6 pas chassés rapides dans chaque sens, 20 secondes d'équilibre yeux fermés sur chaque jambe. C'est un tour, à faire 4 fois. Tu combines vitesse d'appuis et stabilité, dans l'ordre où ça se produit en course."},
      ],
    },
  },

  poigne:{
    id:"poigne",name:"La Poigne",court:"Force haut du corps",
    headline:"Les bras qui tirent le départ et tiennent la manche.",
    fort:{
      default:"Ton haut du corps suit ce que tes jambes envoient. Tu tires fort au portillon, tu tiens ton guidon jusqu'à la fin de la journée, et tu encaisses les chocs sans que tes bras lâchent.",
      '10-12':"Tes bras sont forts et ça t'aide beaucoup au départ. En BMX, on croit que tout vient des jambes, mais les bras qui tirent le guidon font une vraie différence — et les tiens font le travail.",
      '12-15':"Tu tires bien sur ton guidon au départ, ce qui te permet de mettre toute ta puissance dans les premiers coups de pédale. Beaucoup de pilotes de ton âge n'ont pas encore ça.",
      '15-18':"Ton haut du corps ne limite pas ta performance : il transmet, il tient, il encaisse. C'est un socle qui te permet de travailler l'explosivité sans point faible en aval.",
    },
    faible:{
      default:"Tes jambes envoient, tes bras ne suivent pas. Au portillon, tu perds une partie de ta poussée faute de tirage. En fin de journée, tes avant-bras durcissent et ton pilotage devient imprécis.",
      '10-12':"Tes bras ne sont pas encore assez forts pour bien tirer sur le guidon au départ, et ils fatiguent vite. C'est très courant à ton âge et ça se corrige rapidement avec quelques exercices simples, sans matériel.",
      '12-15':"Ton départ perd de la puissance parce que le tirage n'est pas là : tu pousses avec les jambes contre des bras qui cèdent. Et quand tes avant-bras durcissent en fin de journée, ton pilotage se dégrade juste au moment où il faudrait être précis.",
      '15-18':"Le déficit de force du haut du corps est un plafond direct sur ton départ : la poussée des jambes ne peut pas dépasser ce que les bras sont capables de retenir. C'est aussi ce qui explique la perte de précision en fin de journée de course.",
    },
    exos:{
      default:[
        {t:"Les pompes contrôlées",d:"Mains largeur d'épaules, corps gainé, descends en 3 secondes jusqu'à frôler le sol, remonte normalement. 4 séries de 6 à 10 répétitions. Si c'est trop dur au sol, pose les mains sur une table ou un rebord : la descente lente reste le cœur de l'exercice."},
        {t:"Le tirage isométrique au mur",d:"Debout face à un mur, bras pliés, mains à plat à hauteur de poitrine. Pousse le mur de toutes tes forces pendant 8 secondes en gardant le corps gainé. Repose 30 secondes. 6 répétitions. Tu recrutes toute la chaîne bras-épaules-tronc dans le geste exact du tirage de portillon."},
      ],
      '10-12':[
        {t:"Les pompes sur les genoux",d:"À quatre pattes, genoux au sol, mains un peu plus larges que les épaules, corps droit des genoux à la tête. Descends la poitrine vers le sol puis remonte. 4 séries de 6 pompes, 1 minute de repos. Quand 6 deviennent faciles, passe à 8, puis essaie sur les pieds."},
        {t:"Le combat contre le mur",d:"Mets-toi face à un mur et pousse-le de toutes tes forces avec les mains, comme si tu voulais le faire tomber. Compte jusqu'à 8, puis relâche. Fais-le 6 fois. C'est exactement le mouvement de tes bras quand tu tires sur ton guidon au départ."},
      ],
      '12-15':[
        {t:"Les pompes en tempo",d:"Descends en 3 secondes, marque 1 seconde en bas, remonte en 1 seconde. 4 séries de 8. Le tempo lent développe plus de force que les répétitions rapides, et t'évite les mauvaises positions d'épaules. Si tu n'arrives pas à 8, fais-les mains surélevées sur une marche."},
        {t:"Le gainage bras tendus avec appui décollé",d:"En position de pompe haute, bras tendus, décolle une main de quelques centimètres, tiens 3 secondes, alterne. 3 séries de 10 alternances. Tes épaules apprennent à tenir sous charge asymétrique — la situation exacte des réceptions et des sections de rythme."},
      ],
      '15-18':[
        {t:"Les pompes explosives",d:"Descends en contrôle, puis remonte le plus vite possible en cherchant à décoller légèrement les mains du sol. 5 séries de 5, 2 minutes de repos. Tu travailles la vitesse de contraction du haut du corps, pas seulement sa force — c'est cette qualité-là qui sert dans les 4 dixièmes du départ."},
        {t:"L'isométrie de tirage longue",d:"Face au mur, position de tirage, pousse à 100 % pendant 10 secondes. 8 répétitions avec 45 secondes de repos. Puis, sans repos supplémentaire, tiens 45 secondes de gainage bras tendus. Tu travailles la force maximale et la résistance des avant-bras dans la même séance — les deux manques qui te coûtent en fin de journée."},
      ],
    },
  },
};
