const CACHE='qr-maker-v29';
const ASSETS=['./','./index.html','./assets/qrcode.js?v=29','./supabase-config.js?v=29','./assets/supabase-auth.js?v=29','./assets/account-history.js?v=29','./assets/auth-ui.js?v=29','./manifest.webmanifest?v=29','./icons/icon.svg','./icons/icon-192.png','./privacy.html','./terms.html','./styles.css?v=29'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))).then(()=>self.clients.claim()))));
