// Register service worker
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      console.log("✅ Service Worker ready");
      return reg;
    } catch (err) {
      console.error("❌ SW registration failed:", err);
    }
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Notifications not supported");
    return false;
  }

  if (Notification.permission === "granted") return true;

  if (Notification.permission === "denied") {
    console.log("Notifications blocked by user");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

// Show notification
export const showNotification = async (title, body, icon = "/chat-icon.png") => {
  try {
    // 🔊 Play sound first
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.5;
      await audio.play();
    } catch (e) {
      // Sound blocked — ignore
    }

    // Check permission
    if (Notification.permission !== "granted") {
      console.log("Notification permission not granted");
      return;
    }

    // ✅ Method 1 — via Service Worker (best)
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body,
        icon,
        badge: icon,
        vibrate: [200, 100, 200],
        tag: "chat-" + Date.now(),
        requireInteraction: false,
      });
      return;
    }

    // ✅ Method 2 — direct fallback
    new Notification(title, { body, icon });

  } catch (err) {
    console.error("Notification error:", err);

    // ✅ Method 3 — last resort fallback
    try {
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon });
      }
    } catch (e) {
      console.error("All notification methods failed:", e);
    }
  }
};