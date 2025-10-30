// Service Worker for Sankalp Suchi PWA
const CACHE_NAME = "SankalpSuchi-v2";
const urlsToCache = [
  "/",
  "manifest.json",
  "icons/icon-192x192.png",
  "icons/icon-512x512.png",
  "icons/icon-48x48.png",
  "icons/icon-72x72.png",
  "icons/icon-96x96.png",
  "icons/icon-144x144.png",
  "icons/icon-180x180.png",
  "icons/icon-167x167.png",
  "icons/icon-152x152.png",
  "icons/icon-120x120.png",
  "icons/icon-76x76.png",
  "icons/icon-70x70.png",
  "icons/icon-150x150.png",
  "icons/icon-310x310.png",
  "icons/maskable-icon.png",
  "icons/favicon.ico",
  "icons/plus-solid.svg",
  "icons/edit-regular.svg",
  "icons/edit-solid.svg",
  "icons/trash-can-regular.svg",
  "index.html",
  "main.css",
  "myscript.js",
];

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("Service Worker installed successfully");
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker activated");
        return self.clients.claim();
      })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        // If both cache and network fail, return offline page
        if (event.request.destination === "document") {
          return caches.match("/");
        }
      });
    })
  );
});

// Handle notification clicks - improved version with action handling
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event.notification);
  console.log("Action clicked:", event.action);

  // Close the notification
  event.notification.close();

  // Only navigate if the action is 'view' or if the notification body was clicked
  if (event.action === "view" || event.action === "") {
    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clientList) => {
          // If we have a window open, focus it and navigate
          for (let client of clientList) {
            if ("focus" in client) {
              client.focus();
              return client.navigate("./main.html");
            }
          }

          // If no window is open, open a new one
          return clients.openWindow("./main.html");
        })
    );
  }
  // For 'dismiss' action, just close the notification (already done above)
});
