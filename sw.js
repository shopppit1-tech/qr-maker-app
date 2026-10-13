const CACHE='qr-maker-v27';
const ASSETS=['./','./index.html','./assets/qrcode.js?v=27','./supabase-config.js?v=27','./assets/supabase-auth.js?v=27','./assets/auth-ui.js?v=27','./manifest.webmanifest?v=27','./icons/icon.svg','./privacy.html','./terms.html','./styles.css?v=27'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))).then(()=>self.clients.claim()))));
