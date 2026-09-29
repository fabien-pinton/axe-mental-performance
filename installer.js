/* AXE Mental Performance — bouton « Installer l'application ».
   Android/Chrome : ouvre la vraie fenêtre d'installation du système.
   iPhone/iPad : Apple interdit de la déclencher depuis une page, on affiche donc la marche
   à suivre exacte, avec l'icône de partage.
   Le bouton disparaît de lui-même si l'application est déjà installée.                      */
(function(){
  var invite = null;          // la proposition d'installation retenue par Chrome
  var montes = [];            // les emplacements où le bouton a été posé

  function installee(){
    try{
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
          || window.navigator.standalone === true;
    }catch(e){ return false; }
  }
  function estIOS(){
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    invite = e;
    montes.forEach(function(b){ b.style.display = ''; });
  });
  window.addEventListener('appinstalled', function(){
    invite = null;
    montes.forEach(function(b){ b.style.display = 'none'; });
  });

  var ICONE_PARTAGE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
    + 'style="width:15px;height:15px;vertical-align:-3px;margin:0 2px"><path d="M12 15V3"/>'
    + '<path d="M8 7l4-4 4 4"/><path d="M4 13v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/></svg>';

  function marcheASuivre(){
    if(estIOS()){
      return 'Sur iPhone : appuie sur ' + ICONE_PARTAGE + ' <b>Partager</b> en bas de Safari, '
           + 'puis fais défiler jusqu\'à <b>« Sur l\'écran d\'accueil »</b>.';
    }
    if(/Android/.test(navigator.userAgent)){
      return 'Sur Android : ouvre le menu <b>⋮</b> en haut à droite du navigateur, '
           + 'puis <b>« Installer l\'application »</b> ou <b>« Ajouter à l\'écran d\'accueil »</b>.';
    }
    return 'Sur ordinateur : clique sur l\'icône d\'installation dans la barre d\'adresse, '
         + 'à droite, ou ouvre le menu du navigateur puis <b>« Installer »</b>.';
  }

  /* Pose le bouton dans l'élément donné.
     couleur : 'or' (sur fond sombre) ou 'sombre' (sur fond clair).                          */
  window.axeBoutonInstaller = function(conteneur, couleur){
    if(!conteneur || installee()) return;
    var or = (couleur !== 'sombre');
    var zone = document.createElement('div');
    zone.style.cssText = 'margin-top:18px';

    var b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<span style="font-size:15px;line-height:1">⤓</span> Installer l\'application';
    b.style.cssText = 'display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:999px;'
      + 'cursor:pointer;font-family:DM Sans,system-ui,sans-serif;font-size:13px;font-weight:600;'
      + 'letter-spacing:.02em;background:transparent;'
      + (or ? 'border:1.5px solid rgba(201,162,39,.55);color:#C9A227;'
            : 'border:1.5px solid rgba(168,133,42,.55);color:#A8852A;');

    var aide = document.createElement('div');
    aide.style.cssText = 'display:none;margin-top:12px;font-size:12.5px;line-height:1.6;max-width:320px;'
      + 'margin-left:auto;margin-right:auto;'
      + (or ? 'color:rgba(232,226,216,.62)' : 'color:rgba(26,22,18,.6)');

    b.addEventListener('click', function(){
      if(invite){
        invite.prompt();
        invite.userChoice.then(function(r){
          if(r && r.outcome === 'accepted'){ zone.style.display = 'none'; }
        });
        invite = null;
        return;
      }
      aide.innerHTML = marcheASuivre();
      aide.style.display = 'block';
    });

    zone.appendChild(b);
    zone.appendChild(aide);
    conteneur.appendChild(zone);
    montes.push(zone);

    // hors iPhone, tant que Chrome n'a pas proposé l'installation, le bouton reste discret :
    // il n'apparaît que si le navigateur sait installer, ou sur iOS où l'on explique la manœuvre
    if(!invite && !estIOS() && !/Android/.test(navigator.userAgent)) zone.style.display = 'none';
  };
})();
