// Service Worker — handles background notifications

self.addEventListener("install", (event) => {
  console.log("✅ Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activated");
});

// Listen for push messages from app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const { title, body, icon } = event.data.payload;

    self.registration.showNotification(title, {
      body: body,
      icon: icon || "/chat-icon.png",
      badge: "/chat-icon.png",
      vibrate: [200, 100, 200],
      tag: "chat-notification",  // replaces previous notification
      renotify: true,
      actions: [
        { action: "open", title: "Open Chat" },
        { action: "close", title: "Dismiss" },
      ],
    });
  }
});

// When user clicks notification — open the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open" || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes("localhost:5173") && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open new tab
        if (clients.openWindow) {
          return clients.openWindow("http://localhost:5173/chat");
        }
      })
    );
  }
});