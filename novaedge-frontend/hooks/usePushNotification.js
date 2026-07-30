"use client";

import { useState, useEffect, useCallback } from "react";
import {
  subscribeUserToPush,
  unsubscribeUserFromPush,
  getCurrentPushSubscription,
} from "@/lib/pushNotification";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export function usePushNotification() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState("default");
  const [loading, setLoading] = useState(true);

  const checkStatus = useCallback(async () => {
    if (typeof window === "undefined") return;

    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      const sub = await getCurrentPushSubscription();
      setIsSubscribed(!!sub);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const subscribe = async () => {
    setLoading(true);
    try {
      await subscribeUserToPush();
      setIsSubscribed(true);
      setPermission("granted");
      toast.success("Web Push Notifications enabled successfully!");
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(error.message || "Failed to enable Push Notifications.");
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      await unsubscribeUserFromPush();
      setIsSubscribed(false);
      toast.success("Unsubscribed from Push Notifications.");
    } catch (error) {
      console.error("Unsubscribe error:", error);
      toast.error("Failed to unsubscribe.");
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      const sub = await getCurrentPushSubscription();
      if (!sub) {
        toast.error("Please subscribe to notifications first!");
        return;
      }
      await axios.post(
        `${API_BASE}/push/test`,
        { subscription: sub.toJSON() },
        { withCredentials: true }
      );
      toast.success("Test notification dispatched! Check your desktop/browser.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send test notification.");
    }
  };

  return {
    isSupported,
    isSubscribed,
    permission,
    loading,
    subscribe,
    unsubscribe,
    sendTestNotification,
    refreshStatus: checkStatus,
  };
}
