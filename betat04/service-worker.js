self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/sketch.js', // Cambia este nombre si es diferente
          '/manifest.json',
          '/icon-192.png',
          '/icon-512.png',
          // Agrega aquí más archivos como imágenes o fuentes
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  