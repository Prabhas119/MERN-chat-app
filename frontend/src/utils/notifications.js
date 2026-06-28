// Register service worker
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      console.log("✅ Service Worker registered:", reg.scope);
      return reg;
    } catch (err) {
      console.error("❌ Service Worker registration failed:", err);
    }
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") return true;

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

// Show notification via service worker
export const showNotification = async (title, body, icon = "/chat-icon.png") => {
  try {
    // Play sound
    const audio = new Audio("/notification.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});

    // Show browser notification via service worker
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        payload: { title, body, icon },
      });
    } else {
      // Fallback — direct notification
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon });
      }
    }
  } catch (err) {
    console.error("Notification error:", err);
  }
};