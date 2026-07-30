// NovaEdge Web Push Service Worker
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || "NovaEdge Academy";
    const options = {
      body: data.body || "You have a new notification!",
      icon: data.icon || "/icon.png",
      badge: data.badge || "/icon.png",
      image: data.image || undefined,
      data: {
        url: data.url || "/",
        timestamp: data.timestamp || Date.now(),
      },
      vibrate: [100, 50, 100],
      actions: [
        {
          action: "open",
          title: "View Details",
        },
        {
          action: "close",
          title: "Dismiss",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error("Error displaying push notification:", err);
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const targetUrl = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
