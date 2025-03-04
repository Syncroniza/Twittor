const STATIC_CACHE = "static-v1";
const DINAMIC_CACHE = "dynamic-v1";
const INMUTABLE_CACHE = "inmutable-v1";
importScripts("/js/sw-utils.js");
const APP_SHELL = [
  // "/",
  "index.html",
  "css/style.css",
  "img/favicon.ico",
  "js/app.js",
];

const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js",
  "/js/sw-utils.js",
];

// instalacion

self.addEventListener("install", (e) => {
  const cacheStatic = caches
    .open(STATIC_CACHE)
    .then((cache) => cache.addAll(APP_SHELL));

  const cacheInmutable = caches
    .open(INMUTABLE_CACHE)
    .then((cache) => cache.addAll(APP_SHELL_INMUTABLE));

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

//Borrar caches viejos
self.addEventListener("activate", (e) => {
  const respuesta = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil(respuesta);
});

self.addEventListener("fetch", (e) => {
  const respuesta = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    } else {
      return fetch(e.request).then((newResponse) => {
        return actualizaCacheDinamico(DINAMIC_CACHE, e.request, newResponse);
      });
    }
  });
  e.respondWith(respuesta);
});
