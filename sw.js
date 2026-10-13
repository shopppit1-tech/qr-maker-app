const CACHE='qr-maker-v21';
const ASSETS=['./','./index.html','./assets/qrcode.js?v=21','./manifest.webmanifest?v=21','./icons/icon.svg','./privacy.html','./terms.html','./styles.css?v=21'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))).then(()=>self.clients.claim()))));
