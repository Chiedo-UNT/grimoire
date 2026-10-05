// Service Worker — Grimoire PWA
// Appelant : manifest.json via index.html registration
// Rôle : met en cache tous les assets pour fonctionnement 100% offline
// Entrée : événements install, activate, fetch du navigateur
// Sortie : réponses depuis le cache (offline-first)

const CACHE_NAME = 'grimoire-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './react-bundle.min.js',
  './app.min.js',
  './icon-192.png',
  './icon-512.png'
];

// install : pré-cache tous les fichiers
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// activate : supprime les anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// fetch : cache-first, fallback réseau
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
