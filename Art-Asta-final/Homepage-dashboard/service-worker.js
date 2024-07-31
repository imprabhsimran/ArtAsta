const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    '/homepage.css',
    '/homepage.html',
    '/DashBoard/header_footer.css',
    '/DashBoard/artist_header.js',
    '/DashBoard/art_enthu_header.js',
    '/DashBoard/dropdown_for_all.js',
    '/white-logo-project.jpeg'
];

// Install the service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Cache and return requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request);
        })
    );
});

// Update the service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});