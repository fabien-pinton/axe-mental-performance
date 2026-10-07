/* ============ MESSAGES VOCAUX · DU CLIENT VERS LE COACH ============
   Un seul enregistreur, posé partout où on veut laisser la voix plutôt que le clavier :
   sous chaque séance physique, en bas de la page du sportif, et dans l'espace parent.

   Le micro n'est demandé qu'au moment où on appuie sur le bouton, jamais au chargement.
   Rien ne part tant que la personne n'a pas réécouté et validé : on enregistre, on écoute,
   et seulement là on envoie. Deux minutes maximum — au-delà, ce n'est plus un message,
   c'est un appel, et ça se passe autrement.                                              */
(function(){
  var MAX_S = 120;
  var ouvert = null;          // l'enregistreur actuellement déplié

  function supabase(){ return (typeof axeDB !== 'undefined') ? axeDB : null; }

  /* Safari enregistre en mp4, Chrome et Firefox en webm. On prend ce que le navigateur
     sait faire plutôt que d'imposer un format qu'il refuserait en silence. */
  function format(){
    var essais = ['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'];
    for(var i=0;i<essais.length;i++){
      try{ if(window.MediaRecorder && MediaRecorder.isTypeSupported(essais[i])) return essais[i]; }catch(e){}
    }
    return '';
  }
  function extension(mime){
    if(mime.indexOf('mp4') > -1) return 'm4a';
    if(mime.indexOf('ogg') > -1) return 'ogg';
    return 'webm';
  }
  function dispo(){
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }
  function mmss(s){
    var m = Math.floor(s/60), r = s%60;
    return m + ':' + (r<10?'0':'') + r;
  }

  /* Monte un enregistreur dans un conteneur.
     opts : {auteur:'rider'|'parent', contexte:'rp0'|'libre'|'bilan', libelle, aide} */
  function monter(hote, opts){
    if(!hote || hote.dataset.vocalMonte) return;
    hote.dataset.vocalMonte = '1';

    var id = 'v' + Math.random().toString(36).slice(2,8);
    hote.innerHTML =
      '<button type="button" class="vocal-ouvrir" id="b'+id+'">🎙 ' + opts.libelle + '</button>' +
      '<div class="vocal-boite" id="z'+id+'" hidden>' +
        (opts.aide ? '<p class="vocal-aide">' + opts.aide + '</p>' : '') +
        '<div class="vocal-ligne">' +
          '<button type="button" class="vocal-rec" id="r'+id+'">Enregistrer</button>' +
          '<span class="vocal-temps" id="t'+id+'">0:00</span>' +
        '</div>' +
        '<audio class="vocal-ecoute" id="a'+id+'" controls hidden></audio>' +
        '<div class="vocal-ligne" id="f'+id+'" hidden>' +
          '<button type="button" class="vocal-envoyer" id="e'+id+'">Envoyer à mon coach</button>' +
          '<button type="button" class="vocal-refaire" id="x'+id+'">Refaire</button>' +
        '</div>' +
        '<div class="vocal-etat" id="s'+id+'"></div>' +
      '</div>';

    var bOuvrir = document.getElementById('b'+id),
        zone    = document.getElementById('z'+id),
        bRec    = document.getElementById('r'+id),
        tps     = document.getElementById('t'+id),
        audio   = document.getElementById('a'+id),
        fin     = document.getElementById('f'+id),
        bEnv    = document.getElementById('e'+id),
        bRef    = document.getElementById('x'+id),
        etat    = document.getElementById('s'+id);

    var rec = null, morceaux = [], flux = null, minuteur = null, secondes = 0, blob = null;

    function dire(txt, classe){ etat.textContent = txt || ''; etat.className = 'vocal-etat' + (classe?' '+classe:''); }

    function remettre(){
      blob = null; secondes = 0; tps.textContent = '0:00';
      audio.hidden = true; audio.removeAttribute('src');
      fin.hidden = true; bRec.textContent = 'Enregistrer';
      bRec.classList.remove('on'); bRec.disabled = false;
    }

    bOuvrir.addEventListener('click', function(){
      if(!dispo()){
        hote.innerHTML = '<p class="vocal-aide">Ton navigateur ne sait pas enregistrer de son. ' +
                         'Ouvre la page dans Safari ou Chrome, et le bouton reviendra.</p>';
        return;
      }
      var montre = zone.hidden;
      if(ouvert && ouvert !== zone) ouvert.hidden = true;
      zone.hidden = !montre;
      ouvert = montre ? zone : null;
    });

    function arreter(){
      if(rec && rec.state !== 'inactive') rec.stop();
      if(flux) flux.getTracks().forEach(function(p){ p.stop(); });
      clearInterval(minuteur);
      bRec.textContent = 'Enregistrer';
      bRec.classList.remove('on');
    }

    bRec.addEventListener('click', function(){
      if(rec && rec.state === 'recording'){ arreter(); return; }
      remettre(); dire('');
      navigator.mediaDevices.getUserMedia({audio:true}).then(function(f){
        flux = f; morceaux = [];
        var mime = format();
        rec = mime ? new MediaRecorder(f, {mimeType:mime}) : new MediaRecorder(f);
        rec.ondataavailable = function(ev){ if(ev.data && ev.data.size) morceaux.push(ev.data); };
        rec.onstop = function(){
          blob = new Blob(morceaux, {type: rec.mimeType || 'audio/webm'});
          audio.src = URL.createObjectURL(blob);
          audio.hidden = false; fin.hidden = false;
          dire('Réécoute-toi. Si ça te va, envoie.');
        };
        rec.start();
        bRec.textContent = 'Arrêter'; bRec.classList.add('on');
        secondes = 0; tps.textContent = '0:00';
        minuteur = setInterval(function(){
          secondes++; tps.textContent = mmss(secondes);
          if(secondes >= MAX_S){ dire('Deux minutes, c\'est le maximum.'); arreter(); }
        }, 1000);
      }).catch(function(){
        dire('Le micro est refusé. Autorise-le dans les réglages de ton navigateur, puis réessaie.', 'alerte');
      });
    });

    bRef.addEventListener('click', function(){ remettre(); dire(''); });

    bEnv.addEventListener('click', function(){
      if(!blob) return;
      var db = supabase();
      var code = (typeof axeCode !== 'undefined' && axeCode) ? axeCode
               : (typeof etat !== 'undefined' && window.etatParent && window.etatParent.code) ? window.etatParent.code
               : (window.AXE_CODE || '');
      if(!db || !code){ dire('Connexion perdue. Réessaie dans un instant.', 'alerte'); return; }

      bEnv.disabled = true; bRef.disabled = true;
      dire('Envoi…');
      var ext = extension(blob.type || '');
      var chemin = code + '/' + opts.auteur + '-' + (opts.contexte||'libre') + '-' + Date.now() + '.' + ext;

      db.storage.from('messages-vocaux').upload(chemin, blob, {contentType: blob.type || 'audio/webm'})
        .then(function(r){
          if(r.error) throw r.error;
          var pub = db.storage.from('messages-vocaux').getPublicUrl(chemin);
          var url = pub && pub.data ? pub.data.publicUrl : '';
          if(!url) throw new Error('adresse du fichier introuvable');
          return db.rpc('axe_deposer_vocal', {
            code: code, url: url, auteur_p: opts.auteur,
            contexte_p: opts.contexte || 'libre',
            mois_p: (typeof opts.mois === 'function') ? opts.mois() : (opts.mois || null),
            duree_p: secondes
          });
        })
        .then(function(r){
          if(r && r.error) throw r.error;
          dire('Envoyé. Ton coach l\'écoutera.', 'ok');
          if(typeof opts.apres === 'function'){ try{ opts.apres(); }catch(err){} }
          audio.hidden = true; fin.hidden = true; blob = null;
          bEnv.disabled = false; bRef.disabled = false;
        })
        .catch(function(e){
          dire('L\'envoi n\'a pas abouti. Vérifie ta connexion et réessaie.', 'alerte');
          bEnv.disabled = false; bRef.disabled = false;
          console.log('[AXE] vocal :', e && e.message);
        });
    });
  }

  window.AxeVocal = { monter: monter, disponible: dispo };
})();
