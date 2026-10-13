const CACHE='qr-maker-v28';
const ASSETS=['./','./index.html','./assets/qrcode.js?v=28','./supabase-config.js?v=28','./assets/supabase-auth.js?v=28','./assets/account-history.js?v=28','./assets/auth-ui.js?v=28','./manifest.webmanifest?v=28','./icons/icon.svg','./privacy.html','./terms.html','./styles.css?v=28'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))).then(()=>self.clients.claim()))));
