
self.addEventListener("install", (event) => {
  console.log("✅ SW installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ SW activated");
  event.waitUntil(clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const { title, body, icon } = event.data.payload;

    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: icon || "/chat-icon.png",
        badge: "/chat-icon.png",
        vibrate: [200, 100, 200],
        tag: "chat-msg-" + Date.now(),
        requireInteraction: false,
      })
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("mern-chat-app-lime.vercel.app") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("https://mern-chat-app-lime.vercel.app/chat");
      }
    })
  );
});