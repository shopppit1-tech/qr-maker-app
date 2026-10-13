const CACHE='qr-maker-v25';
const ASSETS=['./','./index.html','./assets/qrcode.js?v=22','./manifest.webmanifest?v=22','./icons/icon.svg','./privacy.html','./terms.html','./styles.css?v=22'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))).then(()=>self.clients.claim()))));
