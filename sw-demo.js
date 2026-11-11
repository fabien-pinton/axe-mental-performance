/* Service worker des deux démos de salon.
   Il existe pour une seule raison : le réseau d'un hall de salon tombe, et une démo
   qui ne s'ouvre pas vaut zéro. Les deux pages sont autonomes, polices comprises,
   donc les mettre en cache suffit à les rendre utilisables hors connexion.
   Les contacts saisis restent dans le navigateur et repartent tout seuls au retour
   du réseau : c'est déjà le comportement des pages, on ne touche à rien de ça. */
const CACHE = 'axe-demo-v1';
const FICHIERS = [
  '/demo-axe.html',
  '/demo-parents.html',
  '/manifest-demo-sportif.webmanifest',
  '/manifest-demo-parents.webmanifest',
  '/axe-icone-sportif-192.png',
  '/axe-icone-sportif-512.png',
  '/axe-icone-sportif-180.png',
  '/axe-icone-parents-192.png',
  '/axe-icone-parents-512.png',
  '/axe-icone-parents-180.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(FICHIERS.map(function(f){
      return c.add(new Request(f, {cache:'reload'})).catch(function(){});
    }));
  }).then(function(){ return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(l){
    return Promise.all(l.filter(function(k){ return k !== CACHE; })
                        .map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

/* Le réseau d'abord quand il répond, le cache sinon. Les appels à Supabase ne sont
   jamais interceptés : s'ils échouent, la page les remet elle-même dans sa file. */
self.addEventListener('fetch', function(e){
  const u = new URL(e.request.url);
  if(e.request.method !== 'GET') return;
  if(u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(function(r){
      if(r && r.ok){
        const copie = r.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copie); });
      }
      return r;
    }).catch(function(){
      return caches.match(e.request, {ignoreSearch:true}).then(function(r){
        return r || caches.match('/demo-axe.html');
      });
    })
  );
});
