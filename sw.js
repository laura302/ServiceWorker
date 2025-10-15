// Estructura básica de un Service Worker

// 1. Nombre del caché y archivos a cachear
const CACHE_NAME = "mi-cache-v1";
const urlsToCache = [
    "index.html",
    "offline.html"
];

// 2. INSTALL -> se ejecuta al instalar el SW
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// 3. ACTIVATE -> se ejecuta al activarse (limpia cachés viejos)
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
});

// 4. FETCH -> Intercepta peticiones de la app
// Intercepta cada petición de la PWA
// Buscar primero en caché
// Si no está, busca en Internet
// En caso de falla, muestra la página offline.html

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Si el recurso está en caché, se devuelve
            // Si no, se hace la petición a Internet
            return response || fetch(event.request).catch(() => caches.match("offline.html"));
        })
    );
});


// 5. PUSH -> Notificaciones en segundo plano
// Manejo de notificaciones push (opcional)

self.addEventListener("push", event => {
    // Si el mensaje push no tiene texto, se muestra un mensaje por defecto
    const data = event.data ? event.data.text() : "Notificación sin texto";

    event.waitUntil(
        // Muestra la notificación con el título y el cuerpo
        self.registration.showNotification("Mi PWA", {
            body: data
        })
    );
});
