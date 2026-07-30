import { apiGet, apiPost } from "./api";

/**
 * Convert VAPID Public Key string to Uint8Array
 */
export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Register Service Worker
 */
export async function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    throw new Error("Service Workers are not supported in this browser.");
  }

  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });
  return registration;
}

/**
 * Fetch VAPID Public Key from backend API
 */
export async function getVapidPublicKey() {
  try {
    const data = await apiGet("/api/v1/push/vapid-key");
    return data.publicKey;
  } catch (error) {
    console.error("Failed to fetch VAPID key:", error);
    return null;
  }
}

/**
 * Subscribe user to Push Notifications
 */
export async function subscribeUserToPush() {
  if (typeof window === "undefined") return null;

  if (!("Notification" in window)) {
    throw new Error("This browser does not support web notifications.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission denied by user.");
  }

  const registration = await registerServiceWorker();
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const vapidKey = await getVapidPublicKey();
    if (!vapidKey) {
      throw new Error("Could not retrieve VAPID Public Key from backend server.");
    }

    const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
  }

  // Send subscription to backend
  const deviceInfo = `${navigator.userAgent.slice(0, 100)}`;
  await apiPost("/api/v1/push/subscribe", {
    subscription: subscription.toJSON(),
    deviceInfo,
  });

  return subscription;
}

/**
 * Unsubscribe user from Push Notifications
 */
export async function unsubscribeUserFromPush() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  if (!registration) return;

  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await apiPost("/api/v1/push/unsubscribe", { endpoint: subscription.endpoint });
    await subscription.unsubscribe();
  }
}

/**
 * Check if current browser is subscribed
 */
export async function getCurrentPushSubscription() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.getRegistration("/sw.js");
    if (!registration) return null;
    return await registration.pushManager.getSubscription();
  } catch (err) {
    console.error("Error getting push subscription:", err);
    return null;
  }
}
