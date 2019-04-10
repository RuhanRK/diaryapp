const filesToCache = [
  "/",
  "/index.html",
  "/offline.html",
  "/404.html",
  "/css/style.css",
  "/js/main.js",
  "/images/favicon.png",
  "/images/icons/icon-120x120.png",
  "/images/icons/icon-144x144.png",
  "/images/icons/icon-152x152.png",
  "/images/icons/icon-192x192.png"
];

const staticCacheName = "diary-app";

self.addEventListener("install", event => {
  console.log("attempting to install serviec worker and cache static assets");
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  console.log("Fetch event for ", event.request.url);
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        if (response) {
          console.log("Found", event.request.url, " in cache");
          return response;
        }
        console.log("network request for ", event.request.url);
        return fetch(event.request).then(response => {
          if (response.status === 404) {
            return caches.match("/404.html");
          }
          return caches.open(staticCacheName).then(cache => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      })
      .catch(err => {
        console.error(err);
        return caches.match("/offline.html");
      })
  );
});

self.addEventListener("activate", event => {
  console.log("activating a new service worker");

  const cacheWhiteList = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhiteList.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
