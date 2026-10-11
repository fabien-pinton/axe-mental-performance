/* ========================= LE RETOURNEMENT · EXERCICES MENTAUX =========================

   Pourquoi ce fichier existe.

   La carte mentale affichait un paragraphe et un champ libre. Le sportif lisait, et ne
   faisait rien. On a d'abord essayé de le faire mesurer — chronos, compteurs, cases — et
   c'était la mauvaise réponse : on obtenait des chiffres, pas un déplacement.

   Ce fichier fait autre chose. Un seul mécanisme, le même partout, quel que soit le sport,
   l'âge ou l'axe travaillé, en trois temps :

     1. LA SAISIE PRÉCISE. On ne demande pas « as-tu eu peur ? » mais « quelle a été ta plus
        grande peur cette semaine ? », avec la date, le lieu et le geste exact. Une peur
        vague ne se retourne pas : « j'avais peur de rater » ne donne aucune prise,
        « mercredi 18h40, au deuxième virage, quand Théo est passé à l'intérieur, j'ai
        relâché la pédale » en donne dix. Tant que les trois champs ne sont pas remplis,
        la suite reste fermée, et la page dit pourquoi.

     2. LA REPRISE LITTÉRALE. La page ne résume pas et ne reformule pas : elle recopie sa
        phrase, entre guillemets, dans la consigne suivante. C'est ce qui rend la demande
        impossible à esquiver — c'est écrit là, de sa main.

     3. LA DEMANDE QUI VA DANS LE MAUVAIS SENS. Dix choses positives à sa pire peur. La
        recette pour rater à coup sûr. Ce que son adversaire dirait de lui. Dix, et pas
        trois : les trois premières sont des banalités, les quatre suivantes font mal, et
        c'est entre la huitième et la dixième qu'apparaît quelque chose qu'il ne savait pas.
        L'exercice fonctionne en épuisant l'évidence.

   Tout ce qu'il écrit va dans un objet plat rangé dans le JSON `suivi_rituel`, à côté du
   rituel des 21 jours : aucune table, aucune migration. Les clés portent le mois, l'axe et
   la phase de semaine — « m2|portillon|M1.peur_quoi » — et les noms de champs sont uniques
   dans tout le protocole, ce qui permet à `dernier()` de retrouver une phrase écrite il y a
   deux mois sans savoir où elle a été écrite.

   Une seule chose ne quitte jamais l'appareil : le vocal qu'il s'enregistre à lui-même.
   Il part dans IndexedDB, pas dans Supabase. Le coach sait qu'il existe, il ne l'entend pas.
   ========================================================================================= */
(function(){
  'use strict';

  var cfg = null;      // branché par la page via AxeBriques.init()
  var SEQ = 0;

  /* ---------------------------------------------------------------- le stock */
  function lire(k){ try{ return cfg.lire(k); }catch(e){ return null; } }
  function ecrire(k, v){ try{ cfg.ecrire(k, v); cfg.enregistrer(); }catch(e){} }
  function tout(){ try{ return cfg.tout() || {}; }catch(e){ return {}; } }

  /* La dernière valeur écrite pour un champ, quel que soit le mois et la phase : c'est ce
     qui permet de citer au mois 3 une phrase écrite au mois 1. */
  function dernier(champ){
    var o = tout(), best = null, bestM = -1;
    for(var k in o){
      if(!Object.prototype.hasOwnProperty.call(o, k)) continue;
      var i = k.lastIndexOf('.');
      if(i < 0 || k.slice(i+1) !== champ) continue;
      var v = o[k];
      if(v === null || v === undefined || v === '') continue;
      var m = parseInt((/^m(\d+)\|/.exec(k) || [])[1] || '0', 10);
      if(m >= bestM){ bestM = m; best = v; }
    }
    return best;
  }
  function txt(v){ return (v === null || v === undefined) ? '' : String(v).trim(); }

  /* LE BLOC DU BILAN PRÉCÉDENT.
     À la fin de chaque mois, le sportif désigne le moment qui le bloque — « Les virages »,
     « Après une erreur », « Sur la gate ». Jusqu'ici ça ne servait qu'à choisir l'axe du
     mois. Désormais c'est le sujet du mois : toutes les saisies portent dessus, et il le
     voit écrit en haut de son exercice.
     Les trente-six libellés possibles n'ont pas la même grammaire (« Sur la gate » et
     « Les virages » ne s'insèrent pas pareil), alors on ne les insère jamais dans une
     phrase : on les cite entre guillemets. Ça marche partout, et ça reste ses mots. */
  function bloc(){ try{ return txt(cfg.bloc && cfg.bloc()); }catch(e){ return ''; } }
  function avecBloc(avec, sans){
    var b = bloc();
    if(b && avec) return avec.replace(/\{B\}/g, '« ' + b + ' »');
    // premier mois, ou bilan sans bloc : la question générique, qui ne suppose rien
    return sans || (avec || '').replace(/\{B\}\s*:?\s*/g, '');
  }

  /* ---------------------------------------------------------------- outils */
  function ech(s){
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function uid(){ return 'bq' + (++SEQ) + Math.random().toString(36).slice(2,6); }
  function bip(hz, ms){
    try{
      var AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return;
      var c = new AC(), o = c.createOscillator(), g = c.createGain();
      o.type='sine'; o.frequency.value = hz || 880; g.gain.value = 0.13;
      o.connect(g); g.connect(c.destination); o.start();
      setTimeout(function(){ try{ o.stop(); c.close(); }catch(e){} }, ms || 160);
    }catch(e){}
  }

  /* La citation : ce qu'il a écrit, remis en une phrase. On ne touche pas à ses mots,
     on se contente de les mettre bout à bout dans l'ordre où on les lui a demandés. */
  function citationDe(k){
    var quoi = txt(dernier(k+'_quoi')), quand = txt(dernier(k+'_quand')), ou = txt(dernier(k+'_ou'));
    if(!quoi) return '';
    var ctx = [quand, ou].filter(Boolean).join(', ');
    return ctx ? (ctx + ' : ' + quoi) : quoi;
  }
  /* Assez précis pour être retournable ? Un geste décrit en trois mots ne se retourne pas. */
  var MIN_QUOI = 20;
  function saisieComplete(k){
    return txt(dernier(k+'_quoi')).length >= MIN_QUOI
        && !!txt(dernier(k+'_quand')) && !!txt(dernier(k+'_ou'));
  }
  function reponsesDe(k, n){
    var out = [];
    for(var i=1; i<=n; i++){
      var v = txt(dernier(k+'_'+i));
      if(v) out.push({i:i, t:v});
    }
    return out;
  }

  /* Toutes les réponses qu'il a écrites, tous retournements et tous mois confondus.
     C'est ce qui permet à la page de lui ressortir une de ses propres phrases sur son
     écran d'accueil, un matin, sans qu'il soit allé la chercher. */
  function reponsesToutes(){
    var o = tout(), vues = {}, out = [];
    for(var k in o){
      if(!Object.prototype.hasOwnProperty.call(o, k)) continue;
      if(!/_\d+$/.test(k)) continue;
      var v = txt(o[k]);
      if(!v || vues[v]) continue;
      vues[v] = 1; out.push(v);
    }
    return out;
  }
  /* La dernière chose qu'il a décrite précisément, remise en une phrase. */
  function derniereCitation(){
    var o = tout(), best = null, bestM = -1;
    for(var k in o){
      if(!Object.prototype.hasOwnProperty.call(o, k)) continue;
      var m2 = /\.([a-zA-Z0-9]+)_quoi$/.exec(k);
      if(!m2 || !txt(o[k])) continue;
      var m = parseInt((/^m(\d+)\|/.exec(k) || [])[1] || '0', 10);
      if(m >= bestM){ bestM = m; best = m2[1]; }
    }
    return best ? citationDe(best) : '';
  }

  /* --------------------------------------------- le son qui reste sur l'appareil */
  var BASE = 'axe-vocal-a-soi', MAGASIN = 'sons', basePr = null;
  function base(){
    if(basePr) return basePr;
    basePr = new Promise(function(ok, non){
      try{
        if(!window.indexedDB) return non(new Error('pas de stockage local'));
        var r = indexedDB.open(BASE, 1);
        r.onupgradeneeded = function(){
          var d = r.result;
          if(!d.objectStoreNames.contains(MAGASIN)) d.createObjectStore(MAGASIN);
        };
        r.onsuccess = function(){ ok(r.result); };
        r.onerror = function(){ non(r.error || new Error('stockage refusé')); };
      }catch(e){ non(e); }
    });
    return basePr;
  }
  function garderSon(cle, blob){
    return base().then(function(d){
      return new Promise(function(ok, non){
        var t = d.transaction(MAGASIN,'readwrite');
        t.objectStore(MAGASIN).put(blob, cle);
        t.oncomplete = function(){ ok(true); };
        t.onerror = function(){ non(t.error); };
      });
    });
  }
  function lireSon(cle){
    return base().then(function(d){
      return new Promise(function(ok, non){
        var t = d.transaction(MAGASIN,'readonly');
        var q = t.objectStore(MAGASIN).get(cle);
        q.onsuccess = function(){ ok(q.result || null); };
        q.onerror = function(){ non(q.error); };
      });
    });
  }

  /* ---------------------------------------------------------------- le style */
  var CSS = ''
  + '.bq-zone{margin:18px 0 4px;border-top:1px solid var(--line);padding-top:16px;'
  + 'display:flex;flex-direction:column;gap:18px}'
  + '.bq [hidden],.bq[hidden]{display:none !important}'
  + '.bq-t{font-size:11px;letter-spacing:.11em;text-transform:uppercase;color:var(--mental);'
  + 'font-weight:700;margin-bottom:9px;line-height:1.4}'
  + '.bq-aide{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:14.5px;'
  + 'color:var(--dim);line-height:1.55;margin:-4px 0 11px}'
  + '.bq-l{display:block;font-size:13px;font-weight:600;color:var(--ink);margin-bottom:5px}'
  + '.bq-champ{margin-bottom:11px}'
  + '.bq-champ:last-child{margin-bottom:0}'
  + '.bq input[type=text],.bq textarea{width:100%;border:1.5px solid var(--line);border-radius:2px;'
  + 'padding:10px 11px;font-family:"DM Sans",sans-serif;font-size:14px;color:var(--ink);'
  + 'background:var(--cream);box-sizing:border-box}'
  + '.bq textarea{min-height:70px;resize:vertical;line-height:1.5}'
  + '.bq input[type=text]:focus,.bq textarea:focus{outline:none;border-color:var(--gold)}'
  + '.bq-dit{font-size:11px;color:var(--gold);margin-top:5px;min-height:14px;letter-spacing:.04em}'
  + '.bq-vide{font-size:13px;color:var(--dim);font-style:italic;line-height:1.55}'
  + '.bq-bloc{border:1.5px solid var(--mental);border-radius:4px;padding:13px 15px;'
  + 'background:rgba(59,74,107,.07)}'
  + '.bq-bloc span{display:block;font-family:"Bebas Neue",sans-serif;font-size:20px;'
  + 'letter-spacing:.06em;color:var(--mental);line-height:1.1}'
  + '.bq-bloc p{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;'
  + 'font-size:14.5px;color:var(--dim);line-height:1.55;margin-top:5px}'
  /* les deux temps du retournement */
  + '.rt-pas{border-left:3px solid var(--mental);padding:2px 0 2px 14px}'
  + '.rt-pas.ferme{border-left-color:var(--line-strong);opacity:.62}'
  + '.rt-num{font-family:"Bebas Neue",sans-serif;font-size:13px;letter-spacing:.1em;'
  + 'color:var(--mental);display:block;margin-bottom:3px}'
  + '.rt-pas.ferme .rt-num{color:var(--dim)}'
  + '.rt-q{font-family:"Cormorant Garamond",Georgia,serif;font-size:19px;line-height:1.35;'
  + 'color:var(--ink);font-weight:600;margin-bottom:4px}'
  + '.rt-deux{display:grid;grid-template-columns:1fr 1fr;gap:10px}'
  + '@media(max-width:520px){.rt-deux{grid-template-columns:1fr}}'
  + '.rt-verrou{font-size:13px;line-height:1.55;color:#7A3B2E;background:rgba(122,59,46,.07);'
  + 'border-radius:3px;padding:11px 13px;margin-top:4px}'
  + '.rt-cite{font-family:"Cormorant Garamond",Georgia,serif;font-size:17px;line-height:1.5;'
  + 'color:var(--ink);background:rgba(168,133,42,.09);border-left:3px solid var(--gold);'
  + 'padding:11px 14px;border-radius:0 3px 3px 0;margin:8px 0 13px}'
  + '.rt-cite b{font-weight:600}'
  + '.rt-liste{display:flex;flex-direction:column;gap:7px;margin-top:4px}'
  + '.rt-ligne{display:flex;align-items:center;gap:9px}'
  + '.rt-i{font-family:"Bebas Neue",sans-serif;font-size:17px;letter-spacing:.04em;color:var(--dim);'
  + 'min-width:21px;text-align:right;flex-shrink:0}'
  + '.rt-ligne.pleine .rt-i{color:var(--mental)}'
  + '.rt-ligne input{flex:1}'
  + '.rt-compte{font-size:13px;color:var(--dim);margin-top:11px;padding-top:10px;'
  + 'border-top:1px dashed var(--line);line-height:1.6}'
  + '.rt-compte b{font-family:"Bebas Neue",sans-serif;font-size:19px;letter-spacing:.04em;color:var(--mental)}'
  + '.rt-pousse{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:14.5px;'
  + 'color:var(--gold);line-height:1.55;margin-top:6px;display:block}'
  + '.rt-parent{font-size:12px;color:var(--dim);line-height:1.5;margin-top:9px;padding-left:11px;'
  + 'border-left:2px solid rgba(26,22,18,.18)}'
  /* la chaîne */
  + '.ch-maillon{margin-bottom:13px}'
  + '.ch-avant{font-family:"Cormorant Garamond",Georgia,serif;font-size:15px;font-style:italic;'
  + 'color:var(--dim);line-height:1.45;padding-left:12px;border-left:2px solid var(--line-strong);'
  + 'margin-bottom:6px}'
  /* l'ours blanc */
  + '.ob-compteur{font-family:"Bebas Neue",sans-serif;font-size:52px;letter-spacing:.04em;'
  + 'color:var(--ink);line-height:1;font-variant-numeric:tabular-nums}'
  + '.ob-sec{font-size:15px;color:var(--dim);margin-left:10px}'
  + '.ob-lecon{margin-top:13px;border-left:3px solid var(--mental);padding:12px 0 12px 14px;'
  + 'background:rgba(59,74,107,.06);font-size:14.5px;line-height:1.6;color:var(--ink)}'
  + '.ob-lecon b{color:var(--mental)}'
  /* le miroir : sa liste retournée */
  + '.mi-liste{margin-top:12px;display:flex;flex-direction:column;gap:8px}'
  + '.mi-item{display:flex;gap:10px;font-size:14px;line-height:1.5;color:var(--ink)}'
  + '.mi-item span{color:#5D874A;font-weight:700;flex-shrink:0}'
  /* boutons */
  + '.bq-go{font-family:"DM Sans",sans-serif;font-size:13px;font-weight:600;padding:11px 18px;'
  + 'border-radius:3px;cursor:pointer;border:1.5px solid var(--mental);background:transparent;'
  + 'color:var(--mental);transition:.15s var(--ease)}'
  + '.bq-go:hover{background:var(--mental);color:var(--cream)}'
  + '.bq-go.chaud{background:var(--mental);color:var(--cream)}'
  + '.bq-go:disabled{opacity:.45;cursor:not-allowed}'
  + '.bq-go2{font-family:"DM Sans",sans-serif;font-size:12px;font-weight:600;padding:8px 13px;'
  + 'border-radius:3px;cursor:pointer;border:1.5px solid var(--line-strong);background:transparent;color:var(--ink)}'
  + '.bq-ligne{display:flex;flex-wrap:wrap;align-items:center;gap:10px}'
  /* choisir parmi ses propres réponses */
  + '.bq-opts{display:flex;flex-direction:column;gap:7px}'
  + '.bq-opt{text-align:left;font-family:"Cormorant Garamond",Georgia,serif;font-size:15.5px;'
  + 'line-height:1.45;padding:11px 13px;border:1.5px solid var(--line);border-radius:3px;'
  + 'background:transparent;color:var(--ink);cursor:pointer;transition:.15s var(--ease)}'
  + '.bq-opt:hover{border-color:var(--mental)}'
  + '.bq-opt.on{border-color:var(--mental);background:rgba(59,74,107,.08);font-weight:600}'
  /* rappel de ses mots ailleurs dans la page */
  + '.bq-rappel{border:1.5px solid var(--gold);border-radius:4px;padding:14px 16px;'
  + 'background:rgba(168,133,42,.07)}'
  + '.bq-rappel .bq-t{color:var(--gold)}'
  + '.bq-cite{font-family:"Cormorant Garamond",Georgia,serif;font-size:16px;line-height:1.55;'
  + 'color:var(--ink);padding:7px 0 7px 13px;border-left:2px solid var(--gold);margin-bottom:8px}'
  + '.bq-cite:last-child{margin-bottom:0}'
  /* vocal à soi */
  + '.bq-prive{font-size:11.5px;color:var(--dim);line-height:1.5;margin-top:9px;padding-left:11px;'
  + 'border-left:2px solid rgba(26,22,18,.2)}'
  + '.bq-audio{width:100%;margin-top:11px}'
  + '.bq-etat{font-size:12px;color:var(--dim);margin-top:9px;min-height:16px;line-height:1.45}'
  + '.bq-etat.ok{color:#5D6F4A;font-weight:600}'
  + '.bq-etat.alerte{color:#7A3B2E;font-weight:600}'
  + '.bq-temps{font-size:13px;color:var(--dim);font-variant-numeric:tabular-nums;letter-spacing:.04em}'
  /* validation de la mission */
  + '.bq-valider{width:100%;margin-top:16px;padding:13px;border:1.5px solid var(--mental);'
  + 'border-radius:2px;background:transparent;color:var(--mental);font-family:"DM Sans",sans-serif;'
  + 'font-weight:600;font-size:13px;letter-spacing:.04em;cursor:pointer;transition:.2s var(--ease);'
  + 'display:flex;align-items:center;justify-content:center;gap:8px}'
  + '.bq-valider:hover{background:var(--mental);color:var(--cream)}'
  + '.bq-valider.fait{background:#5D874A;border-color:#5D874A;color:var(--cream)}'
  /* ses mots ressortis ailleurs */
  + '.bq-haut{margin:-2px 0 12px;padding:9px 12px;border-left:3px solid var(--gold);'
  + 'background:rgba(168,133,42,.07);border-radius:0 3px 3px 0}'
  + '.bq-haut span{display:block;font-size:10px;letter-spacing:.13em;text-transform:uppercase;'
  + 'color:var(--gold);font-weight:700;margin-bottom:3px}'
  + '.bq-haut i{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:15px;'
  + 'color:var(--ink);line-height:1.45;display:block}'
  + '.bq-accueil{margin-top:18px;border:1.5px solid var(--gold);border-radius:4px;'
  + 'padding:16px 18px;background:rgba(168,133,42,.06)}'
  + '.bq-accueil h3{font-family:"Bebas Neue",sans-serif;font-size:19px;letter-spacing:.05em;'
  + 'font-weight:400;color:var(--gold);margin:0 0 4px}'
  + '.bq-accueil .bq-sous{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;'
  + 'font-size:14.5px;color:var(--dim);line-height:1.5;margin-bottom:11px}';

  function style(){
    if(document.getElementById('bq-style')) return;
    var s = document.createElement('style');
    s.id = 'bq-style'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ======================================================================== RENDU */

  function enveloppe(type, cle, dedans, extra){
    return '<div class="bq" data-bq="' + type + '" data-cle="' + ech(cle) + '"'
         + (extra || '') + '>' + dedans + '</div>';
  }
  function titre(b){
    return (b.titre ? '<div class="bq-t">' + ech(b.titre) + '</div>' : '')
         + (b.aide  ? '<p class="bq-aide">' + ech(b.aide) + '</p>' : '');
  }
  function champ(id, k, lbl, ph, long, val){
    return '<div class="bq-champ"><label class="bq-l" for="' + id + '">' + ech(lbl) + '</label>'
      + (long
         ? '<textarea id="' + id + '" data-k="' + ech(k) + '" placeholder="' + ech(ph||'') + '">' + ech(val||'') + '</textarea>'
         : '<input type="text" id="' + id + '" data-k="' + ech(k) + '" value="' + ech(val||'')
           + '" placeholder="' + ech(ph||'') + '">')
      + '</div>';
  }

  var RENDU = {};

  /* ---- LE RETOURNEMENT : le cœur de tout ce fichier -------------------------------
     Deux temps dans une seule brique, parce qu'ils ne se séparent pas : le second n'a
     aucun sens sans le premier, et le premier n'a aucun intérêt sans le second. */
  RENDU.retournement = function(b, cle){
    var k = b.k, id = uid(), n = b.n || 10;
    var ouvert = saisieComplete(k);
    var cite = citationDe(k);
    var h = titre(b);
    // la question et la demande sont écrites avec le bloc du bilan quand il existe
    var question = avecBloc(b.q, b.qSans);
    var demande  = avecBloc(b.demande, b.demandeSans);

    h += '<div class="rt-pas">'
      + '<span class="rt-num">1 · CE QUI S\'EST PASSÉ</span>'
      + '<div class="rt-q">' + ech(question) + '</div>'
      + '<p class="bq-aide">Précisément. Pas « j\'ai eu peur » : le geste exact, le jour, '
      + 'l\'endroit. C\'est la précision qui rend la suite possible.</p>'
      + champ(id+'q', k+'_quoi', b.lQuoi || 'Ce que tu as fait, ou pas fait',
              b.phQuoi || 'Le geste exact, en une ou deux phrases.', true, txt(dernier(k+'_quoi')))
      + '<div class="rt-deux">'
      + champ(id+'d', k+'_quand', 'Quand', 'Le jour, et l\'heure si tu t\'en souviens', false, txt(dernier(k+'_quand')))
      + champ(id+'o', k+'_ou', 'Où, et avec quoi autour', 'Le lieu, et ce qu\'il y avait autour de toi', false, txt(dernier(k+'_ou')))
      + '</div><div class="bq-dit"></div></div>';

    h += '<div class="rt-pas rt-deux-temps' + (ouvert ? '' : ' ferme') + '" style="margin-top:16px">'
      + '<span class="rt-num">2 · LE RETOURNEMENT</span>'
      + '<div class="rt-verrou"' + (ouvert ? ' hidden' : '') + '>'
      + 'Remplis d\'abord les trois champs au-dessus. On ne retourne pas une phrase vague : '
      + 'tant qu\'on ne sait pas ce qui s\'est passé exactement, il n\'y a rien à retourner.</div>'
      + '<div class="rt-corps"' + (ouvert ? '' : ' hidden') + '>'
      + '<div class="rt-q">' + ech(demande) + '</div>'
      + '<div class="rt-cite"><b class="rt-citation">' + ech(cite) + '</b></div>'
      + (b.aide2 ? '<p class="bq-aide">' + ech(b.aide2) + '</p>' : '')
      + '<div class="rt-liste">';
    for(var i=1; i<=n; i++){
      var v = txt(dernier(k+'_'+i));
      h += '<div class="rt-ligne' + (v?' pleine':'') + '"><span class="rt-i">' + i + '</span>'
         + '<input type="text" data-k="' + ech(k+'_'+i) + '" value="' + ech(v) + '"></div>';
    }
    h += '</div><div class="rt-compte"></div>'
      + '<p class="rt-parent">Tu peux le faire à voix haute, avec quelqu\'un qui écrit pour toi. '
      + 'Ce qui compte, c\'est d\'aller jusqu\'à ' + n + '.</p>'
      + '</div></div>';

    return enveloppe('retournement', cle, h, ' data-k="' + ech(k) + '" data-n="' + n + '"');
  };

  /* ---- LA CHAÎNE : chaque réponse devient la question suivante ----------------------
     Une peur ne survit qu'en arrêt sur image. Déroulée jusqu'au bout, elle atterrit
     presque toujours sur quelque chose de supportable. */
  RENDU.chaine = function(b, cle){
    var k = b.k, id = uid(), et = b.etapes || [];
    var h = titre(b) + '<div class="ch-maillons">';
    var precedent = null, bloque = false;
    for(var i=0; i<et.length; i++){
      var v = txt(dernier(k+'_c'+i));
      /* Le rappel de la réponse précédente est toujours créé, même vide : il se remplit
         pendant qu'il tape. Ne le créer qu'au rendu reviendrait à n'afficher la cascade
         qu'au rechargement suivant, et c'est précisément l'enchaînement qui fait l'exercice. */
      h += '<div class="ch-maillon" data-i="' + i + '"' + (bloque ? ' hidden' : '') + '>'
        + (i > 0 ? '<div class="ch-avant"' + (precedent ? '' : ' hidden') + '>'
                   + (precedent ? '« ' + ech(precedent) + ' »' : '') + '</div>' : '')
        + champ(id+'c'+i, k+'_c'+i, et[i], b.ph || 'Une phrase suffit.', false, v)
        + '</div>';
      if(!v){ bloque = true; }
      precedent = v || null;
    }
    h += '</div><div class="bq-dit"></div>';
    return enveloppe('chaine', cle, h, ' data-k="' + ech(k) + '" data-n="' + et.length + '"');
  };

  /* ---- L'OURS BLANC : la démonstration par l'échec ----------------------------------
     On ne peut pas faire comprendre à un gamin que « arrête d'y penser » ne marche pas
     en le lui expliquant. On le lui fait rater, chronomètre en main. */
  RENDU.ours = function(b, cle){
    var cite = citationDe(b.de) || txt(dernier(b.de + '_quoi'));
    var fait = lire(cle + '.ours');
    var h = titre(b);
    if(!cite){
      return enveloppe('ours', cle, h + '<p class="bq-vide">Écris d\'abord ce qui te revient en tête, '
        + 'plus haut dans l\'exercice. On ne peut pas s\'interdire de penser à rien.</p>');
    }
    h += '<div class="rt-cite"><b>' + ech(cite) + '</b></div>'
      + '<p class="bq-aide">Pendant ' + (b.s||60) + ' secondes, interdiction absolue d\'y penser. '
      + 'Chaque fois que ça revient quand même, appuie sur le bouton. Ne triche pas : personne '
      + 'ne te juge là-dessus.</p>'
      + '<div class="bq-ligne"><button type="button" class="bq-go ob-go">Commencer</button>'
      + '<span class="ob-compteur">0</span><span class="ob-sec">' + (b.s||60) + ' s</span></div>'
      + '<div class="ob-lecon"' + (fait ? '' : ' hidden') + '></div>';
    return enveloppe('ours', cle, h, ' data-s="' + (b.s||60) + '" data-de="' + ech(b.de) + '"');
  };

  /* ---- LE MIROIR : sa liste, retournée par la page ---------------------------------
     Il vient d'écrire dix façons de rater à coup sûr. La page les lui rend comme une
     liste de choses à ne pas faire. Il n'a rien produit de plus, et il a tout. */
  RENDU.miroir = function(b, cle){
    var rep = reponsesDe(b.de, b.n || 10);
    var h = titre(b);
    if(rep.length < 3){
      return enveloppe('miroir', cle, h + '<p class="bq-vide">Remplis d\'abord ta liste au-dessus. '
        + 'Il en faut au moins trois pour que le retournement ait du sens.</p>');
    }
    h += '<div class="bq-ligne"><button type="button" class="bq-go mi-go">'
       + (lire(cle+'.miroir') ? 'Revoir ma liste retournée' : 'Retourne-moi cette liste') + '</button></div>'
       + '<div class="mi-liste"' + (lire(cle+'.miroir') ? '' : ' hidden') + '>'
       + '<p class="bq-aide" style="margin:4px 0 2px">Tu viens d\'écrire comment rater à coup sûr. '
       + 'Voilà donc, mot pour mot, ta liste de contrôle : tu n\'as rien d\'autre à faire que '
       + 'de ne pas faire ces ' + rep.length + ' choses-là.</p>';
    rep.forEach(function(r){
      h += '<div class="mi-item"><span>✓</span><div>Ne pas : ' + ech(r.t) + '</div></div>';
    });
    h += '</div>';
    return enveloppe('miroir', cle, h, ' data-de="' + ech(b.de) + '" data-n="' + (b.n||10) + '"');
  };

  /* ---- CHOISIR PARMI SES PROPRES RÉPONSES ------------------------------------------- */
  RENDU.choixParmi = function(b, cle){
    var rep = reponsesDe(b.de, b.n || 10);
    var v = txt(lire(cle + '.' + b.k));
    var h = titre(b);
    if(!rep.length){
      return enveloppe('choixParmi', cle, h + '<p class="bq-vide">'
        + ech(b.vide || 'Tu n\'as pas encore écrit tes réponses : reviens à la semaine 1.') + '</p>');
    }
    h += '<div class="rt-q">' + ech(b.q) + '</div><div class="bq-opts">';
    rep.forEach(function(r){
      h += '<button type="button" class="bq-opt' + (v === String(r.i) ? ' on' : '') + '" data-v="'
         + r.i + '">' + ech(r.t) + '</button>';
    });
    h += '</div><div class="bq-dit"></div>';
    return enveloppe('choixParmi', cle, h, ' data-k="' + ech(b.k) + '"');
  };

  /* ---- DES CHAMPS SIMPLES, quand il n'y a rien à retourner --------------------------- */
  RENDU.champs = function(b, cle){
    var h = titre(b), id = uid();
    (b.items || []).forEach(function(c, j){
      h += champ(id+j, c.k, c.l, c.ph || '', c.long !== false, txt(dernier(c.k)));
    });
    return enveloppe('champs', cle, h + '<div class="bq-dit"></div>');
  };

  /* ---- RAPPEL : ses mots, remis sous ses yeux --------------------------------------- */
  RENDU.rappel = function(b, cle){
    var vals = [];
    (b.champs || []).forEach(function(c){
      var v = (c === '@cite') ? citationDe(b.de) : txt(dernier(c));
      if(v) vals.push(v);
    });
    if(b.reponsesDe) reponsesDe(b.reponsesDe, b.n || 10).forEach(function(r){ vals.push(r.t); });
    var h = titre(b);
    if(vals.length) vals.forEach(function(v){ h += '<div class="bq-cite">' + ech(v) + '</div>'; });
    else h += '<p class="bq-vide">' + ech(b.vide || 'Rien d\'écrit pour le moment.') + '</p>';
    return '<div class="bq bq-rappel" data-bq="rappel">' + h + '</div>';
  };

  /* ---- LE VOCAL À SOI : il se relit à voix haute, et se réécoute -------------------- */
  RENDU.vocalsoi = function(b, cle){
    var h = titre(b)
      + '<div class="bq-ligne">'
      + '<button type="button" class="bq-go v-rec">Enregistrer</button>'
      + '<button type="button" class="bq-go2 v-ecouter" hidden>Réécouter</button>'
      + '<span class="bq-temps v-temps" hidden>0:00</span></div>'
      + '<audio class="bq-audio" controls hidden></audio>'
      + '<div class="bq-ligne v-fin" hidden style="margin-top:10px">'
      + '<button type="button" class="bq-go v-garder">Garder sur mon téléphone</button>'
      + '<button type="button" class="bq-go2 v-refaire">Refaire</button></div>'
      + '<div class="bq-etat"></div>'
      + '<p class="bq-prive">Cet enregistrement reste sur ce téléphone, et sur lui seul. '
      + 'Ton coach ne l\'entend pas : c\'est ton exercice. Si tu changes de téléphone ou que tu '
      + 'vides ton navigateur, il sera perdu — tu pourras le refaire en une minute.</p>';
    return enveloppe('vocalsoi', cle, h);
  };

  /* ======================================================================== CÂBLAGE */

  var minuteurs = {};
  function noter(z, t){
    var e = z.querySelector('.bq-dit');
    if(!e) return;
    e.textContent = t; clearTimeout(e._t);
    e._t = setTimeout(function(){ e.textContent = ''; }, 2200);
  }
  function dire(z, t, c){
    var e = z.querySelector('.bq-etat');
    if(e){ e.textContent = t || ''; e.className = 'bq-etat' + (c ? ' '+c : ''); }
  }
  function surSaisie(ch, fn){
    ch.addEventListener('input', function(){
      clearTimeout(ch._t);
      ch._t = setTimeout(fn, 600);
    });
  }

  var BRANCHE = {};

  BRANCHE.retournement = function(z){
    var cle = z.dataset.cle, k = z.dataset.k, n = Number(z.dataset.n) || 10;
    var pas2 = z.querySelector('.rt-deux-temps');
    var verrou = z.querySelector('.rt-verrou'), corps = z.querySelector('.rt-corps');
    var citation = z.querySelector('.rt-citation');
    var compte = z.querySelector('.rt-compte');

    /* Le compte, et surtout l'accompagnement : c'est lui qui fait tenir jusqu'à dix.
       Un champ vide sans un mot à côté, on l'abandonne à la quatrième ligne. */
    function majCompte(){
      var c = 0;
      z.querySelectorAll('.rt-ligne').forEach(function(l){
        var v = l.querySelector('input').value.trim();
        l.classList.toggle('pleine', !!v);
        if(v) c++;
      });
      if(!compte) return;
      var mot = c === 0 ? 'Les trois premières viendront vites. Ce sont les suivantes qui comptent.'
        : c < 4  ? 'Les faciles sont passées. Maintenant ça devient intéressant.'
        : c < 7  ? 'C\'est le moment où on a envie d\'arrêter. Continue.'
        : c < n  ? 'Il en reste ' + (n-c) + '. C\'est là que ça se joue.'
        : 'Relis les trois dernières : ce sont celles que tu ne savais pas.';
      compte.innerHTML = '<b>' + c + ' / ' + n + '</b> trouvées'
        + '<span class="rt-pousse">' + mot + '</span>';
    }
    function majVerrou(){
      var ok = saisieComplete(k);
      if(pas2) pas2.classList.toggle('ferme', !ok);
      if(verrou) verrou.hidden = ok;
      if(corps) corps.hidden = !ok;
      if(citation) citation.textContent = citationDe(k);
    }

    // temps 1 : les trois champs de la saisie
    ['_quoi','_quand','_ou'].forEach(function(suf){
      var ch = z.querySelector('[data-k="' + k + suf + '"]');
      if(!ch) return;
      surSaisie(ch, function(){
        ecrire(cle + '.' + k + suf, ch.value.trim());
        majVerrou();
        noter(z, 'Enregistré');
      });
      // la citation se met à jour pendant qu'il tape, sans attendre l'enregistrement :
      // voir sa propre phrase se former dans la consigne, c'est ce qui donne envie de préciser
      ch.addEventListener('input', function(){
        if(!citation) return;
        var p = {};
        ['_quoi','_quand','_ou'].forEach(function(s2){
          var c2 = z.querySelector('[data-k="' + k + s2 + '"]');
          p[s2] = c2 ? c2.value.trim() : '';
        });
        var ctx = [p._quand, p._ou].filter(Boolean).join(', ');
        citation.textContent = p._quoi ? (ctx ? ctx + ' : ' + p._quoi : p._quoi) : '';
      });
    });

    // temps 2 : les dix réponses
    z.querySelectorAll('.rt-ligne input').forEach(function(ch){
      surSaisie(ch, function(){
        ecrire(cle + '.' + ch.dataset.k, ch.value.trim());
        majCompte();
      });
      ch.addEventListener('input', majCompte);
    });

    majVerrou(); majCompte();
  };

  BRANCHE.chaine = function(z){
    var cle = z.dataset.cle, k = z.dataset.k;
    var maillons = Array.prototype.slice.call(z.querySelectorAll('.ch-maillon'));
    function maj(){
      var ouvrir = true;
      maillons.forEach(function(m, i){
        m.hidden = !ouvrir;
        var ch = m.querySelector('input');
        var v = ch ? ch.value.trim() : '';
        var av = m.querySelector('.ch-avant');
        if(av && i > 0){
          var pre = maillons[i-1].querySelector('input');
          var tp = pre ? pre.value.trim() : '';
          av.textContent = tp ? ('« ' + tp + ' »') : '';
          av.hidden = !tp;
        }
        if(!v) ouvrir = false;
      });
    }
    maillons.forEach(function(m){
      var ch = m.querySelector('input');
      if(!ch) return;
      ch.addEventListener('input', maj);
      surSaisie(ch, function(){
        ecrire(cle + '.' + ch.dataset.k, ch.value.trim());
        noter(z, 'Enregistré');
      });
    });
    maj();
  };

  BRANCHE.ours = function(z){
    var cle = z.dataset.cle, total = Number(z.dataset.s) || 60;
    var go = z.querySelector('.ob-go'), cpt = z.querySelector('.ob-compteur');
    var sec = z.querySelector('.ob-sec'), lecon = z.querySelector('.ob-lecon');
    if(!go) return;
    var n = 0, reste = total, tic = null, enCours = false;

    function dit(){
      if(!lecon) return;
      lecon.hidden = false;
      lecon.innerHTML = n === 0
        ? '<b>Zéro ? Alors recommence en étant honnête.</b> Personne ne tient soixante secondes '
          + 'sans que la pensée revienne. Si tu n\'as rien compté, c\'est que tu pensais au bouton.'
        : '<b>' + n + ' fois en ' + total + ' secondes.</b> C\'est normal, et c\'est exactement '
          + 'la démonstration : on ne chasse pas une pensée en se l\'interdisant — l\'interdire, '
          + 'c\'est y penser. La seule chose qui marche, c\'est de lui donner un autre travail. '
          + 'C\'est ce que fait ta consigne : pas « n\'y pense plus », mais « voilà quoi faire à la place ».';
    }
    go.addEventListener('click', function(){
      if(enCours){ n++; if(cpt) cpt.textContent = n; return; }
      enCours = true; n = 0; reste = total;
      if(cpt) cpt.textContent = '0';
      if(lecon) lecon.hidden = true;
      go.classList.add('chaud');
      go.textContent = 'Ça m\'est revenu';
      tic = setInterval(function(){
        reste--;
        if(sec) sec.textContent = reste + ' s';
        if(reste <= 0){
          clearInterval(tic); tic = null; enCours = false;
          go.classList.remove('chaud'); go.textContent = 'Recommencer';
          if(sec) sec.textContent = total + ' s';
          bip(440, 200);
          ecrire(cle + '.ours', n);
          dit();
        }
      }, 1000);
      minuteurs[cle] = function(){ clearInterval(tic); tic = null; enCours = false; };
    });
    if(lire(cle + '.ours') !== null && lire(cle + '.ours') !== undefined){
      n = Number(lire(cle + '.ours')) || 0;
      if(cpt) cpt.textContent = n;
      dit();
    }
  };

  BRANCHE.miroir = function(z){
    var cle = z.dataset.cle;
    var go = z.querySelector('.mi-go'), liste = z.querySelector('.mi-liste');
    if(!go) return;
    go.addEventListener('click', function(){
      if(liste) liste.hidden = false;
      go.textContent = 'Revoir ma liste retournée';
      ecrire(cle + '.miroir', true);
    });
  };

  BRANCHE.choixParmi = function(z){
    var cle = z.dataset.cle, k = z.dataset.k;
    z.querySelectorAll('.bq-opt').forEach(function(b){
      b.addEventListener('click', function(){
        z.querySelectorAll('.bq-opt').forEach(function(x){ x.classList.remove('on'); });
        b.classList.add('on');
        ecrire(cle + '.' + k, b.dataset.v);
        noter(z, 'Enregistré');
      });
    });
  };

  BRANCHE.champs = function(z){
    var cle = z.dataset.cle;
    z.querySelectorAll('[data-k]').forEach(function(ch){
      surSaisie(ch, function(){
        ecrire(cle + '.' + ch.dataset.k, ch.value.trim());
        noter(z, 'Enregistré');
      });
    });
  };

  BRANCHE.rappel = function(){};

  BRANCHE.vocalsoi = function(z){
    var cle = z.dataset.cle;
    var bRec = z.querySelector('.v-rec'), bEc = z.querySelector('.v-ecouter');
    var bGar = z.querySelector('.v-garder'), bRef = z.querySelector('.v-refaire');
    var tps = z.querySelector('.v-temps'), audio = z.querySelector('.bq-audio');
    var fin = z.querySelector('.v-fin');
    var rec = null, flux = null, bouts = [], blob = null, s = 0, tic = null;
    function mmss(x){ var m = Math.floor(x/60), r = x%60; return m + ':' + (r<10?'0':'') + r; }

    lireSon(cle).then(function(b){
      if(!b) return;
      if(bEc) bEc.hidden = false;
      if(bRec) bRec.textContent = 'Réenregistrer';
      dire(z, 'Ton enregistrement est là, sur ce téléphone.');
    }).catch(function(){});

    if(bEc) bEc.addEventListener('click', function(){
      lireSon(cle).then(function(b){
        if(!b){ dire(z, 'Rien de gardé sur ce téléphone. Réenregistre-toi.', 'alerte'); return; }
        audio.src = URL.createObjectURL(b); audio.hidden = false;
        audio.play().catch(function(){});
        dire(z, 'Ferme les yeux et écoute-toi jusqu\'au bout.');
      }).catch(function(){ dire(z, 'Ce navigateur ne garde rien. Réenregistre-toi quand tu veux.', 'alerte'); });
    });

    function arreter(){
      if(rec && rec.state !== 'inactive') rec.stop();
      if(flux) flux.getTracks().forEach(function(p){ p.stop(); });
      clearInterval(tic);
      if(bRec){ bRec.classList.remove('chaud'); bRec.textContent = 'Enregistrer'; }
    }
    if(bRec) bRec.addEventListener('click', function(){
      if(rec && rec.state === 'recording'){ arreter(); return; }
      if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)){
        dire(z, 'Ton navigateur ne sait pas enregistrer de son. Ouvre la page dans Safari ou Chrome.', 'alerte');
        return;
      }
      navigator.mediaDevices.getUserMedia({audio:true}).then(function(f){
        flux = f; bouts = []; blob = null;
        var m = '';
        ['audio/webm;codecs=opus','audio/webm','audio/mp4'].forEach(function(x){
          if(!m && window.MediaRecorder && MediaRecorder.isTypeSupported(x)) m = x;
        });
        rec = m ? new MediaRecorder(f, {mimeType:m}) : new MediaRecorder(f);
        rec.ondataavailable = function(e){ if(e.data && e.data.size) bouts.push(e.data); };
        rec.onstop = function(){
          blob = new Blob(bouts, {type: rec.mimeType || 'audio/webm'});
          audio.src = URL.createObjectURL(blob); audio.hidden = false;
          if(fin) fin.hidden = false;
          dire(z, 'Réécoute-toi. Si ça te va, garde-le.');
        };
        rec.start();
        bRec.classList.add('chaud'); bRec.textContent = 'Arrêter';
        s = 0; if(tps){ tps.hidden = false; tps.textContent = '0:00'; }
        tic = setInterval(function(){
          s++; if(tps) tps.textContent = mmss(s);
          if(s >= 240){ dire(z, 'Quatre minutes, c\'est assez.'); arreter(); }
        }, 1000);
        minuteurs[cle] = arreter;
      }).catch(function(){
        dire(z, 'Le micro est refusé. Autorise-le dans les réglages, puis réessaie.', 'alerte');
      });
    });
    if(bRef) bRef.addEventListener('click', function(){
      blob = null; audio.hidden = true; audio.removeAttribute('src');
      if(fin) fin.hidden = true; dire(z, '');
    });
    if(bGar) bGar.addEventListener('click', function(){
      if(!blob){ dire(z, 'Enregistre-toi d\'abord.', 'alerte'); return; }
      bGar.disabled = true;
      garderSon(cle, blob).then(function(){
        bGar.disabled = false;
        if(fin) fin.hidden = true;
        if(bEc) bEc.hidden = false;
        if(bRec) bRec.textContent = 'Réenregistrer';
        ecrire(cle + '.enr', true);
        dire(z, 'Gardé sur ce téléphone. Rien n\'est parti ailleurs.', 'ok');
      }).catch(function(){
        bGar.disabled = false;
        dire(z, 'Ce navigateur refuse de garder le son (navigation privée ?). Tu peux quand même '
              + 'te réécouter maintenant, mais il sera perdu en fermant la page.', 'alerte');
      });
    });
  };

  function brancher(racine){
    style();
    (racine || document).querySelectorAll('[data-bq]').forEach(function(z){
      if(z.dataset.bqPret) return;
      z.dataset.bqPret = '1';
      var f = BRANCHE[z.dataset.bq];
      if(f) try{ f(z); }catch(e){ console.log('[AXE] brique ' + z.dataset.bq + ' :', e && e.message); }
    });
  }
  function couper(){
    for(var k in minuteurs){ try{ minuteurs[k](); }catch(e){} }
    minuteurs = {};
  }
  function rendre(liste, cle){
    style();
    if(!liste || !liste.length) return '';
    var h = '<div class="bq-zone">';
    /* Le sujet du mois, annoncé une fois en haut. Il vient de son bilan : ce n'est pas
       le coach qui l'a choisi, c'est lui. Autant que ce soit écrit. */
    var b = bloc();
    if(b){
      h += '<div class="bq-bloc"><span>TON MOIS \u00b7 ' + ech(b.toUpperCase()) + '</span>'
        + '<p>C\'est ce que tu as écrit dans ton bilan du mois dernier. Tout le travail mental '
        + 'de ce mois-ci porte là-dessus : quand tu réponds, c\'est de ce moment-là que tu parles.</p></div>';
    }
    liste.forEach(function(b){ var f = RENDU[b.t]; if(f) h += f(b, cle); });
    return h + '</div>';
  }
  function cleDe(mois, axe, phase){ return 'm' + mois + '|' + axe + '|' + phase; }

  /* ===================================================================== LES NEUF THÈMES

     Un thème par axe et par niveau de mois. Chaque thème se déroule sur les quatre
     semaines, toujours de la même façon : on saisit précisément, la page recopie, et elle
     demande l'inverse. Ce qui change d'un thème à l'autre, c'est la question posée et le
     sens dans lequel on retourne — jamais la forme.

     Le texte ne nomme aucune discipline : les neuf sports passent sans retouche. Les
     jetons du lexique ne servent qu'aux mots qui changent vraiment (la « manche », le
     « match », le « combat »).                                                           */
  function table(l, tier){
    var kid = (tier === 'enfant');
    var U = l.uniteArt;            // « la manche », « le match », « le combat »…
    var UN = l.uniteIndef;         // « une manche », « un match »…
    var JOUR = l.jourMot;          // « course », « match », « compétition »…
    var SUITE = l.uniteSuivante;
    var PAIRS = l.pairs;

    /* Le retournement standard. Tous les exercices de ce protocole ont cette forme. */
    function R(k, q, demande, o){
      o = o || {};
      return {t:'retournement', k:k, q:q, demande:demande, n:o.n || 10,
              titre:o.titre || 'Le retournement de la semaine',
              // les variantes du tout premier mois, quand aucun bilan n'a encore été envoyé
              qSans:o.qSans, demandeSans:o.demandeSans,
              aide2:o.aide2, lQuoi:o.lQuoi, phQuoi:o.phQuoi};
    }
    var T = {portillon:[], rumination:[], confiance:[]};

    /* ------------------------------------------------- PORTILLON · mois 1 : LA PEUR */
    T.portillon[0] = {
      M1:[ R('peur',
            'Tu as écrit {B} dans ton bilan du mois dernier. Raconte-moi la dernière fois que ça s\'est mal passé là.',
            'Donne-moi dix choses positives du fait que :',
            {qSans: kid ? 'Quelle a été ta plus grosse peur cette semaine ?'
                        : 'Quelle a été ta plus grande peur cette semaine ?',
             aide2:'Dix. Pas trois. Les premières seront bêtes, c\'est normal — écris-les quand même, '
                 + 'il faut les sortir pour que les autres arrivent.',
             lQuoi: kid ? 'Ce que tu as fait à ce moment-là' : 'Ce que tu as fait, ou pas fait',
             phQuoi: kid ? 'Ex. : j\'ai freiné avant le virage alors que je voulais pas.'
                         : 'Le geste exact. Pas « j\'ai eu peur » : ce que ton corps a fait.'}) ],
      E1:[ {t:'choixParmi', de:'peur', n:10, k:'emporte',
            titre:'Ce que tu emmènes à l\'entraînement',
            q:'Parmi tes dix réponses, choisis celle que tu as le moins envie de croire.',
            aide:'Celle qui te fait lever les yeux au ciel. C\'est toujours la bonne.',
            vide:'Tu n\'as pas encore fait le retournement de la semaine 1. Reviens-y d\'abord.'},
           R('emportee',
            'Tu l\'as emmenée à l\'entraînement. Qu\'est-ce qui s\'est passé ?',
            'Donne-moi cinq choses que ça change, même minuscules :',
            {n:5, titre:'Sur le terrain', lQuoi:'Ce qui s\'est passé',
             phQuoi:'Le moment précis où tu y as repensé, et ce que tu as fait ensuite.'}) ],
      E2:[ R('peur2',
            '{B} : cette semaine, à l\'entraînement, le moment où tu as eu le plus peur là.',
            'Dix choses que cette peur t\'a apprises sur toi, que rien d\'autre ne t\'aurait apprises :',
            {qSans:'Cette semaine, le moment où tu as eu le plus peur à l\'entraînement.',
             aide2:'La peur est une information. Elle dit toujours quelque chose de précis sur ce '
                 + 'qui compte pour toi. Cherche ce qu\'elle dit.'}) ],
      M2:[ {t:'rappel', de:'peur', champs:['@cite'], titre:'Ta peur du début du mois',
            vide:'Tu n\'as rien écrit en semaine 1 : rien à relire.'},
           {t:'chaine', k:'peursuite', titre:'Et si elle revient ?',
            aide:'Une peur ne tient que tant qu\'on l\'arrête sur image. On la déroule jusqu\'au bout.',
            etapes:['Elle revient à ta prochaine ' + l.unite + '. Qu\'est-ce que tu fais, la première seconde ?',
                    'Et ensuite ?',
                    'Et si ça ne marche pas, qu\'est-ce qui se passe ?',
                    'Et le lendemain ?',
                    'Et dans un mois, il en reste quoi ?']} ]
    };

    /* ------------------------------------------ PORTILLON · mois 2 : L'ORDRE DE RATER */
    T.portillon[1] = {
      M1:[ R('rater',
            '{B} : qu\'est-ce que tu as le plus peur de rater, précisément, à ce moment-là ?',
            'Donne-moi dix bonnes raisons de le rater exprès, à la prochaine séance :',
            {qSans:'Qu\'est-ce que tu as le plus peur de rater en ce moment ?',
             aide2:'Oui, exprès. On ne peut pas à la fois vouloir rater et craindre de rater : '
                 + 'les deux ne tiennent pas dans la même tête. C\'est ça qu\'on va vérifier.',
             lQuoi:'Ce que tu as peur de rater', phQuoi:'Le geste précis, pas « ma séance ».'}),
           {t:'champs', titre:'Avant d\'y aller · à lire',
            aide:'Tu vas rater exprès, trois fois, le plus franchement possible. Deux règles, '
               + 'et elles ne se discutent pas : jamais sur un geste qui peut te blesser — choisis '
               + 'le départ, pas le saut — et tu préviens ton entraîneur avant. S\'il dit non, tu '
               + 'choisis autre chose.',
            items:[{k:'rater_quoi_ok', l:'Le geste que tu vas rater exprès (sans danger, validé par ton entraîneur)',
                    ph:'Écris-le ici pour t\'y tenir.', long:false}]} ],
      E1:[ R('rate3',
            'Tu as raté exprès, trois fois. Raconte la troisième.',
            'Dix choses que tu as découvertes en ratant volontairement :',
            {lQuoi:'Ce qui s\'est passé la troisième fois',
             phQuoi:'Ce que tu as senti au moment de le faire exprès, et juste après.'}) ],
      E2:[ R('rate4',
            '{B} : cette semaine, un ratage que tu n\'avais PAS prévu.',
            'Dix différences entre celui-là et ceux que tu avais ratés exprès :',
            {qSans:'Cette semaine, un ratage que tu n\'avais PAS prévu.',
             aide2:'C\'est la comparaison qui compte. Le geste est le même ; ce qui change est '
                 + 'entièrement dans ta tête, et tu vas pouvoir le nommer.'}) ],
      M2:[ {t:'rappel', de:'rater', champs:['@cite'], titre:'Ce que tu avais peur de rater',
            vide:'Rien d\'écrit en semaine 1.'},
           R('ratebilan',
            'Aujourd\'hui, ce geste, tu en as encore peur ?',
            'Cinq choses qui ont changé depuis le début du mois :',
            {n:5, titre:'Le bilan du mois', lQuoi:'Où tu en es',
             phQuoi:'Sois honnête : si la peur est intacte, dis-le, c\'est une information utile.'}) ]
    };

    /* ------------------------------------------------ PORTILLON · mois 3 : LE PIRE */
    T.portillon[2] = {
      M1:[ R('pire',
            '{B} : qu\'est-ce qui pourrait arriver de pire là, à ta prochaine ' + l.unite + ' ?',
            'Dix choses qui resteraient vraies même si ça arrivait :',
            {qSans:'Qu\'est-ce qui pourrait arriver de pire à ta prochaine ' + l.unite + ' ?',
             aide2:'Vraies de toi, de ton niveau, de ce que tu sais faire. Le pire scénario ne '
                 + 'supprime pas tout : liste ce qu\'il laisse debout.',
             lQuoi:'Le pire, précisément', phQuoi:'Pas « ça se passe mal » : le scénario exact.'}) ],
      E1:[ {t:'chaine', k:'piresuite', titre:'Jusqu\'au bout',
            aide:'On déroule. Une phrase par étape, pas plus.',
            etapes:['Le pire arrive. Et ensuite, il se passe quoi ?',
                    'Et après ça ?',
                    'Et le soir même ?',
                    'Et le lendemain à l\'entraînement ?',
                    'Et dans un mois, il en reste quoi ?',
                    'Et dans un an ?']} ],
      E2:[ R('pire2',
            '{B} : le moment de la semaine où ce scénario t\'est revenu en tête.',
            'Dix choses que tu étais en train de faire correctement à cet instant précis :',
            {qSans:'Le moment de la semaine où ce scénario t\'est revenu en tête.',
             aide2:'Pendant que la tête fabriquait le pire, le corps, lui, faisait quelque chose. '
                 + 'Liste ce que le corps faisait.'}) ],
      M2:[ {t:'rappel', de:'pire', champs:['@cite'], titre:'Le pire, tel que tu l\'avais écrit',
            vide:'Rien d\'écrit en semaine 1.'},
           R('pirebilan',
            'Relis-le. Qu\'est-ce que tu en penses maintenant ?',
            'Cinq choses que tu dirais à celui qui a écrit ça il y a trois semaines :',
            {n:5, titre:'À celui que tu étais', lQuoi:'Ce que ça te fait de le relire',
             phQuoi:'Une ou deux phrases.'}) ]
    };

    /* --------------------------------------- RUMINATION · mois 1 : MERCI À L'ERREUR */
    T.rumination[0] = {
      M1:[ R('erreur',
            'Tu as écrit {B} dans ton bilan du mois dernier. Quelle erreur t\'a le plus coûté là, ce mois-ci ?',
            'Écris-lui dix remerciements. Oui, dix, et oui, à l\'erreur :',
            {qSans: kid ? 'Quelle erreur t\'a le plus embêté ce mois-ci ?'
                        : 'Quelle erreur t\'a le plus coûté ce mois-ci ?',
             aide2:'La boucle a besoin que l\'erreur reste une dette. Si elle devient un paiement — '
                 + 'quelque chose que tu as acheté en la commettant — elle n\'a plus de carburant.',
             lQuoi:'L\'erreur', phQuoi:'Le geste exact, pas le résultat.'}) ],
      E1:[ {t:'choixParmi', de:'erreur', n:10, k:'merci',
            titre:'Celui qui tient debout',
            q:'Parmi tes dix remerciements, lequel est le plus vrai ?',
            vide:'Fais d\'abord le retournement de la semaine 1.'},
           R('redite',
            'Cette semaine, une erreur que tu as refaite.',
            'Cinq choses que la deuxième fois t\'a montrées que la première t\'avait cachées :',
            {n:5, titre:'La deuxième fois', lQuoi:'L\'erreur refaite',
             phQuoi:'Quand, où, et en quoi c\'était la même.'}) ],
      E2:[ R('erreur2',
            '{B} : l\'erreur de cette semaine que tu as le plus ressassée.',
            'Dix choses qui ont quand même fonctionné dans la séance où tu l\'as commise :',
            {qSans:'L\'erreur de cette semaine que tu as le plus ressassée.',
             aide2:'Une séance n\'est jamais ratée à cent pour cent, mais la mémoire l\'enregistre '
                 + 'comme ça. Va chercher les dix, même les plus bêtes.'}) ],
      M2:[ {t:'rappel', de:'erreur', champs:['@cite'], titre:'L\'erreur du début du mois',
            vide:'Rien d\'écrit en semaine 1.'},
           R('dette',
            'Tu lui en veux encore ?',
            'Cinq choses que tu sais faire aujourd\'hui et que tu ne saurais pas sans elle :',
            {n:5, titre:'Ce qu\'elle t\'a payé', lQuoi:'Où tu en es avec elle',
             phQuoi:'Honnêtement.'}) ]
    };

    /* --------------------------------- RUMINATION · mois 2 : LA RECETTE DE L'ÉCHEC */
    T.rumination[1] = {
      M1:[ R('recette',
            'Ta prochaine ' + l.unite + ' importante : c\'est quand, et c\'est quoi ?',
            'Écris le mode d\'emploi complet pour tout rater sur {B}. Dix étapes, sois méchant :',
            {demandeSans:'Écris le mode d\'emploi complet pour la rater à coup sûr. Dix étapes, sois méchant :',
             aide2:'On sait toujours mieux décrire comment rater que comment réussir. Alors on '
                 + 'commence par là. Précis, concret, dans l\'ordre.',
             lQuoi:'L\'échéance', phQuoi:'La date, le lieu, l\'enjeu.'}),
           {t:'miroir', de:'recette', n:10, titre:'Maintenant, retourne-la'} ],
      E1:[ {t:'choixParmi', de:'recette', n:10, k:'deja',
            titre:'Celle que tu fais déjà',
            q:'Dans ta recette, laquelle tu fais déjà, pour de vrai, sans le vouloir ?',
            aide:'Il y en a toujours une. Souvent deux.',
            vide:'Écris d\'abord ta recette, en semaine 1.'},
           R('contre',
            'Tu l\'as repérée à l\'entraînement. Décris le moment.',
            'Cinq façons de la rendre impossible, matériellement :',
            {n:5, titre:'La rendre impossible', lQuoi:'Le moment où tu l\'as surprise',
             phQuoi:'Quand, où, ce que tu étais en train de faire.'}) ],
      E2:[ R('recette2',
            '{B} : cette semaine, une séance où tu as appliqué ta recette sans le vouloir.',
            'Dix choses qui t\'ont poussé à le faire — fatigue, humeur, quelqu\'un, l\'heure :',
            {qSans:'Cette semaine, une séance où tu as appliqué ta recette sans le vouloir.',
             aide2:'Ce ne sont pas des excuses, ce sont des causes. On ne supprime pas ce qu\'on '
                 + 'n\'a pas nommé.'}) ],
      M2:[ {t:'rappel', reponsesDe:'recette', n:10, titre:'Ta recette, en entier',
            vide:'Rien d\'écrit ce mois-ci.'},
           R('recettebilan',
            'Combien d\'étapes tu as réussi à ne pas faire ce mois-ci ?',
            'Cinq choses que ça a changé :',
            {n:5, titre:'Le bilan du mois', lQuoi:'Ce que tu n\'as pas fait',
             phQuoi:'Nomme les étapes, par leur numéro ou leur nom.'}) ]
    };

    /* --------------------------- RUMINATION · mois 3 : L'INTERDICTION D'Y PENSER */
    T.rumination[2] = {
      M1:[ R('pensee',
            '{B} : quelle est la pensée qui te revient le plus souvent à ce moment-là, celle dont tu n\'arrives pas à te défaire ?',
            'Dix choses que cette pensée essaie de protéger chez toi :',
            {qSans:'Quelle est la pensée qui revient le plus souvent, celle dont tu n\'arrives pas à te défaire ?',
             aide2:'Une pensée qui s\'accroche a toujours un travail. Elle croit te rendre service. '
                 + 'Trouve lequel, et tu pourras lui en donner un autre.',
             lQuoi:'La pensée, mot pour mot', phQuoi:'Écris-la comme elle arrive dans ta tête.'}),
           {t:'ours', de:'pensee', s:60, titre:'Maintenant, interdiction d\'y penser'} ],
      E1:[ R('remplace',
            'À quel moment précis de l\'entraînement elle arrive ?',
            'Cinq choses que tu peux faire de tes mains ou de tes yeux à cet instant-là :',
            {n:5, titre:'Lui donner un autre travail',
             aide2:'Pas « penser à autre chose » — ça ne marche pas, tu viens de le vérifier. '
                 + 'Quelque chose de physique : un regard posé quelque part, un geste, un appui.',
             lQuoi:'Le moment exact', phQuoi:'Quand, où, ce que tu fais juste avant.'}) ],
      E2:[ R('pensee2',
            '{B} : cette semaine, la fois où elle est revenue le plus fort.',
            'Dix choses que tu as quand même réussies ce jour-là, pendant qu\'elle tournait :',
            {qSans:'Cette semaine, la fois où elle est revenue le plus fort.',
             aide2:'Elle tournait, et tu as fait des choses. Les deux sont vrais en même temps. '
                 + 'C\'est ça qu\'il faut écrire.'}) ],
      M2:[ {t:'rappel', de:'pensee', champs:['@cite'], titre:'La pensée du début du mois',
            vide:'Rien d\'écrit en semaine 1.'},
           {t:'ours', de:'pensee', s:60, titre:'La même épreuve qu\'il y a trois semaines'},
           R('penseebilan',
            'Elle revient encore. Mais est-ce qu\'elle reste aussi longtemps ?',
            'Cinq choses qui ont changé dans la façon dont elle arrive, ou dont elle repart :',
            {n:5, titre:'Le bilan du mois', lQuoi:'Ce qui a changé', phQuoi:'Même si c\'est peu.'}) ]
    };

    /* ------------------------------ CONFIANCE · mois 1 : LE COMPLIMENT INTERDIT */
    T.confiance[0] = {
      M1:[ R('interdit',
            '{B} : une chose vraie sur toi, à ce moment-là, que tu ne dirais jamais à voix haute parce que ça ferait prétentieux.',
            'Donne-moi dix preuves que c\'est vrai. Dates, lieux, gestes :',
            {qSans: kid ? 'Dis une chose vraie sur toi que tu n\'oserais jamais dire tout haut, parce que ça ferait prétentieux.'
                        : 'Une chose vraie sur toi que tu ne dirais jamais à voix haute, parce que ça ferait prétentieux.',
             aide2:'C\'est le carnet de preuves à l\'envers : au lieu de collectionner des preuves '
                 + 'en espérant une conclusion, on part de la conclusion interdite et on la force '
                 + 'à se justifier. Dix preuves, sinon c\'est que ce n\'était pas vrai.',
             lQuoi: kid ? 'Ce que tu n\'oses pas dire' : 'Ce que tu ne dis jamais',
             phQuoi:'À la première personne. « Je suis… », « j\'arrive à… ».'}) ],
      E1:[ {t:'choixParmi', de:'interdit', n:10, k:'plusdure',
            titre:'La plus difficile à écrire',
            q:'Parmi tes dix preuves, laquelle t\'a demandé le plus d\'effort à écrire ?',
            vide:'Fais d\'abord le retournement de la semaine 1.'},
           R('vupar',
            'Cette semaine, quelqu\'un a vu quelque chose de bien chez toi. Qui, et quoi ?',
            'Cinq raisons pour lesquelles il a eu raison :',
            {n:5, titre:'Vu de l\'extérieur', lQuoi:'Ce qu\'il a vu',
             phQuoi:'Même si c\'est un entraîneur, un parent, un copain.'}) ],
      E2:[ R('interdit2',
            '{B} : le moment de la semaine où tu t\'es dit « je ne suis pas assez bon ».',
            'Dix faits qui disent le contraire. Des faits, pas des encouragements :',
            {qSans:'Le moment de la semaine où tu t\'es dit « je ne suis pas assez bon ».',
             aide2:'Un fait, c\'est daté et vérifiable. « Je suis fort » n\'est pas un fait. '
                 + '« Le 8, j\'ai tenu les trois séries » en est un.'}) ],
      M2:[ {t:'rappel', de:'interdit', champs:['@cite'], titre:'Ce que tu n\'osais pas dire',
            vide:'Rien d\'écrit en semaine 1.'},
           R('ose',
            'Trois semaines après : tu oserais le dire tout haut, maintenant ?',
            'Cinq choses qui changeraient si tu le disais vraiment :',
            {n:5, titre:'Le dire', lQuoi:'Où tu en es', phQuoi:'Honnêtement.'}) ]
    };

    /* ----------------- CONFIANCE · mois 2 : CE QUI A MARCHÉ PENDANT QUE ÇA RATAIT */
    T.confiance[1] = {
      M1:[ R('pireseance',
            '{B} : ta pire séance du mois là-dessus. Celle dont tu n\'es pas fier.',
            'Dix choses qui ont quand même fonctionné ce jour-là. Y compris les plus bêtes :',
            {qSans:'Ta pire séance du mois. Celle dont tu n\'es pas fier.',
             aide2:'Être venu compte. Avoir fini compte. Une séance n\'est jamais ratée à cent '
                 + 'pour cent — c\'est la mémoire qui l\'enregistre comme ça, et c\'est ça qu\'on corrige.',
             lQuoi:'La séance', phQuoi:'Le jour, le lieu, et ce qui s\'est mal passé.'}),
           {t:'vocalsoi', titre:'Relis tes dix réponses à voix haute',
            aide:'Enregistre-toi en les lisant, lentement, une par une. Les deux soirs suivants, '
               + 'tu te réécoutes les yeux fermés — sans rien lire, sans rouvrir les yeux. '
               + 'C\'est la seule façon de faire cet exercice sans interrompre les yeux.'} ],
      E1:[ {t:'choixParmi', de:'pireseance', n:10, k:'surpris',
            titre:'Celle qui t\'a surpris',
            q:'Parmi les dix, laquelle tu n\'avais pas vue avant de l\'écrire ?',
            vide:'Fais d\'abord le retournement de la semaine 1.'},
           R('refait',
            'Tu l\'as refaite cette semaine, exprès. Raconte.',
            'Cinq endroits où tu pourrais la refaire encore :',
            {n:5, titre:'La refaire exprès', lQuoi:'Ce que tu as refait',
             phQuoi:'Quand, où, et comment tu t\'y es pris.'}) ],
      E2:[ R('mauvais',
            '{B} : cette semaine, le moment où tu t\'es senti le plus mauvais là.',
            'Dix choses que ' + PAIRS + ' n\'auraient pas su faire à ta place à cet instant-là :',
            {qSans:'Cette semaine, le moment où tu t\'es senti le plus mauvais.',
             aide2:'Change de point de vue. Pas « est-ce que j\'étais bon », mais « qu\'est-ce que '
                 + 'j\'étais en train de faire que tout le monde ne sait pas faire ».'}) ],
      M2:[ {t:'rappel', reponsesDe:'pireseance', n:10, titre:'Les dix du début du mois',
            vide:'Rien d\'écrit ce mois-ci.'},
           R('pirebilan2',
            'Relis-les. Ta pire séance, c\'était vraiment une mauvaise séance ?',
            'Cinq choses que tu vas regarder autrement la prochaine fois que ça rate :',
            {n:5, titre:'Le bilan du mois', lQuoi:'Ce que tu en penses maintenant',
             phQuoi:'Une ou deux phrases.'}) ]
    };

    /* ------------------------ CONFIANCE · mois 3 : L'AVOCAT DE TON ADVERSAIRE */
    T.confiance[2] = {
      M1:[ R('adversaire',
            '{B} : qui est meilleur que toi là-dessus, et qu\'est-ce qu\'il fait mieux que toi exactement ?',
            'Maintenant écris dix lignes à SA place. Ce que LUI dirait de TOI à son entraîneur, à la première personne :',
            {qSans:'Qui t\'impressionne le plus en ce moment, et qu\'est-ce qu\'il fait mieux que toi ?',
             aide2:'« Lui, c\'est celui qui… ». Dix lignes, en son nom. Tu te vois toujours du '
                 + 'dedans ; là tu es obligé de te voir du dehors, et tu vas trouver des choses '
                 + 'que tu ne comptes jamais.',
             lQuoi:'Ce qu\'il fait mieux que toi', phQuoi:'Précisément, geste par geste.'}) ],
      E1:[ {t:'choixParmi', de:'adversaire', n:10, k:'surpris2',
            titre:'Celle qui t\'étonne',
            q:'Parmi les dix lignes que tu as écrites à sa place, laquelle t\'a étonné ?',
            vide:'Fais d\'abord le retournement de la semaine 1.'},
           R('vuedehors',
            'Cette semaine, tu t\'es regardé de l\'extérieur à un moment précis. Lequel ?',
            'Cinq choses que tu as vues de toi que tu ne vois jamais du dedans :',
            {n:5, titre:'Du dehors', lQuoi:'Le moment',
             phQuoi:'Quand, où, ce que tu étais en train de faire.'}) ],
      E2:[ R('adversaire2',
            '{B} : cette semaine, quelqu\'un a fait mieux que toi là. Quand ?',
            'Dix choses que tu as faites mieux que lui dans la même séance :',
            {qSans:'Cette semaine, quelqu\'un a fait mieux que toi. Quand, et sur quoi ?',
             aide2:'Dans la même séance, le même jour. Il y en a dix, même si tu n\'en vois pas trois.'}) ],
      M2:[ {t:'rappel', reponsesDe:'adversaire', n:10, titre:'Ce que ton adversaire dit de toi',
            vide:'Rien d\'écrit ce mois-ci.'},
           R('avocat',
            'Un sportif de ton club, même âge, vient te voir avec exactement ton problème. Lequel ?',
            'Écris-lui cinq conseils. Puis relis-les, et demande-toi pourquoi tu ne te les appliques pas :',
            {n:5, titre:'Le conseil à l\'autre', lQuoi:'Son problème — qui est le tien',
             phQuoi:'Décris-le comme s\'il n\'était pas le tien.'}) ]
    };

    return T;
  }

  window.AxeBriques = {
    init: function(c){ cfg = c; style(); },
    rendre: rendre,
    brancher: brancher,
    couper: couper,
    cleDe: cleDe,
    table: table,
    dernier: dernier,
    citationDe: citationDe,
    reponsesDe: reponsesDe,
    reponsesToutes: reponsesToutes,
    derniereCitation: derniereCitation
  };
})();
