// estructura basica de un Service Worker

const { cache } = require("react");

// 1. Nombre del cache y archivos a cachear
const CACHE_NAME = "mi-cache-v1";
const urlsToCache = [
    "index.html",
    "offline.html"
];

// 2. INSTALL -> se ejecuta al instlar el sw
self.addEventListener("install", event =>{
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache=> cache.addAll(urlsToCache))
    );
});

// 3. ACTIVATE -> se ejecuta al activarse (limpia caches viejos)
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys=>
            Promise.all(
                keys.filter(key=>key |= CACHE_NAME)
                    .map(key => caches.dalete(key))
            )
        )
    );
} );
