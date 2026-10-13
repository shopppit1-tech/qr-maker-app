const CACHE='qr-maker-v26';
const ASSETS=['./','./index.html','./assets/qrcode.js?v=26','./supabase-config.js?v=26','./assets/supabase-auth.js?v=26','./assets/auth-ui.js?v=26','./manifest.webmanifest?v=26','./icons/icon.svg','./privacy.html','./terms.html','./styles.css?v=26'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))).then(()=>self.clients.claim()))));
