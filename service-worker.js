const CACHE_NAME = "SW-001";
const toCache = [
    "/",
    "manifest.json",
    "assets/js/register.js",
    "assets/css/bootstrap.css",
    "assets/css/bootstrap.css.map",
    "assets/css/styles.css",
    "assets/css/shimmer.css",
    "assets/img/bg-jumbroton.png",
    "assets/img/box.png",
    "assets/img/icon-193.png",
    "assets/img/icon-513.png",
    "assets/js/bootstrap.js",
    "assets/js/bootstrap.js.map",
    "assets/js/jquery-3.6.1.min.js",
    "assets/jss/script.js",
    "assets/js/sweetalert.js",
    "index.html",
];
self.addEventListener("beforeinstallprompt", (e) => {
    // Prevent Chrome 76 and later from showing the mini-infobar
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    showInstallPromotion();
});
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches
        .open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll(toCache);
        })
        .then(self.skipWaiting())
    );
});
self.addEventListener("fetch", function (event) {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request);
            });
        })
    );
});
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches
        .keys()
        .then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("[ServiceWorker] Hapus cache lama", key);
                        return caches.delete(key);
                    }
                })
            );
        })
        .then(() => self.clients.claim())
    );
});