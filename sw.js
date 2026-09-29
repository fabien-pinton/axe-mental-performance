/* AXE Mental Performance — service worker minimal.
   Rôle : permettre l'installation sur l'écran d'accueil, servir les icônes hors ligne,
   et afficher une page d'attente si le réseau est coupé.
   Choix volontaire : le RÉSEAU D'ABORD pour les pages. Une mise à jour du protocole est
   donc visible immédiatement par les riders, sans avoir à vider quoi que ce soit.       */

const VERSION = 'axe-v1';
const FOND = [
  'icones/axe-192.png',
  'icones/axe-512.png',
  'icones/axe-512-maskable.png',
  'icones/axe-apple-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FOND)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n !== VERSION).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // on ne touche qu'aux lectures de notre propre site : jamais aux appels Supabase/Stripe
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then(rep => {
        if (rep && rep.status === 200 && rep.type === 'basic') {
          const copie = rep.clone();
          caches.open(VERSION).then(c => c.put(req, copie));
        }
        return rep;
      })
      .catch(() => caches.match(req).then(c => c || (
        req.mode === 'navigate'
          ? new Response(
              '<!doctype html><html lang="fr"><head><meta charset="utf-8">' +
              '<meta name="viewport" content="width=device-width,initial-scale=1">' +
              '<title>AXE</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;' +
              'justify-content:center;background:#0A0907;color:#C9A227;font-family:Georgia,serif;text-align:center;padding:32px}' +
              'p{font-size:16px;line-height:1.6;max-width:320px;color:#E8E2D8}b{letter-spacing:.3em;font-size:26px;display:block;margin-bottom:18px;color:#C9A227}</style>' +
              '</head><body><div><b>AXE</b><p>Pas de connexion pour le moment. Ton protocole revient dès que le réseau est là.</p></div></body></html>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            )
          : Response.error()
      )))
  );
});
