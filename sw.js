const CACHE_NAME = 'gps-cam-maps-v1';

// Interceptar solicitudes de red para almacenar los mapas en caché automáticamente
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Detectar si la petición pertenece a mapas (Google Maps tiles o OpenStreetMap)
    if (url.includes('google.com/vt') || url.includes('openstreetmap.org')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    // Si ya está guardado, lo devuelve de inmediato de forma instantánea
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Si no está guardado, lo descarga, lo guarda en caché y lo muestra
                    return fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }).catch(() => {
                        return new Response('Mapa offline no disponible', { status: 404 });
                    });
                });
            })
        );
    }
});
