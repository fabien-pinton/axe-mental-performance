/* =====================================================================================
   Protocole Flash · service worker

   Son seul rôle : que la page s'ouvre quand il n'y a pas de réseau.

   Un terrain de BMX, un gymnase, un bord de bassin, c'est zéro barre. Sans ce
   fichier, le sportif scanne sa gourde le jour de la compétition et tombe sur une
   page blanche, c'est-à-dire au seul moment qui compte.

   Au premier passage, celui qui se fait tranquillement à la maison, tout est mis
   en cache. Ensuite la page s'ouvre hors ligne, instantanément.

   Les appels à Supabase ne sont JAMAIS mis en cache : des données périmées seraient
   pires que pas de données. Le scan non parti est gardé par la page elle-même, dans
   sa file d'attente, et repart quand le signal revient.

   POUR PUBLIER UNE MISE À JOUR : changer le numéro de CACHE ci-dessous. Sans ça, les
   téléphones qui ont déjà la page garderont l'ancienne version pendant un bon moment.
   ===================================================================================== */
var CACHE = 'axe-flash-v3';

var FICHIERS = [
  '/flash.html',
  '/flash.js',
  '/F/',
  '/manifest-flash.webmanifest',
  '/axe-flash-192.png',
  '/axe-flash-512.png',
  '/axe-flash-512-maskable.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){
    /* Un fichier manquant ne doit pas faire échouer toute l'installation. */
    return Promise.all(FICHIERS.map(function(u){
      return c.add(new Request(u, {cache:'reload'})).catch(function(){});
    }));
  }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(noms){
      return Promise.all(noms.map(function(n){
        return n === CACHE ? null : caches.delete(n);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var r = e.request;
  if(r.method !== 'GET') return;

  var u;
  try { u = new URL(r.url); } catch(err){ return; }

  /* Les données restent toujours fraîches ou absentes, jamais périmées. */
  if(u.hostname.indexOf('supabase.co') >= 0) return;

  e.respondWith(
    caches.match(r).then(function(hit){
      var reseau = fetch(r).then(function(rep){
        if(rep && rep.status === 200 && (rep.type === 'basic' || rep.type === 'cors')){
          var copie = rep.clone();
          caches.open(CACHE).then(function(c){ c.put(r, copie); });
        }
        return rep;
      }).catch(function(){
        /* Hors ligne : la version en cache, ou à défaut le protocole lui-même,
           pour qu'une adresse inconnue ne donne jamais une page blanche. */
        return hit || (r.mode === 'navigate' ? caches.match('/flash.html') : undefined);
      });
      /* En cache, on sert tout de suite et on rafraîchit derrière : le sportif
         n'attend jamais le réseau. */
      return hit || reseau;
    })
  );
});
