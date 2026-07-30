"use client";

import { usePushNotification } from "@/hooks/usePushNotification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, BellRing, CheckCircle2, ShieldAlert, Sparkles, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PushNotificationPrompt({ compact = false }) {
  const {
    isSupported,
    isSubscribed,
    permission,
    loading,
    subscribe,
    unsubscribe,
    sendTestNotification,
  } = usePushNotification();

  if (!isSupported) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <BellRing className="w-5 h-5" />
        </div>
        <div className="flex-1 text-sm">
          <p className="font-semibold">Push Notifications</p>
          <p className="text-xs text-muted-foreground">
            {isSubscribed ? "Subscribed to live updates" : "Stay updated on courses & articles"}
          </p>
        </div>
        {isSubscribed ? (
          <Button variant="outline" size="sm" onClick={unsubscribe} disabled={loading}>
            <BellOff className="w-3.5 h-3.5 mr-1.5" /> Disable
          </Button>
        ) : (
          <Button size="sm" onClick={subscribe} disabled={loading}>
            <Bell className="w-3.5 h-3.5 mr-1.5" /> Enable
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-border/60 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <BellRing className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                Web Push Notifications
                {isSubscribed ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 gap-1 text-xs">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-xs">
                    Disabled
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Receive real-time announcements, course updates, and new articles directly on your device.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {permission === "denied" && (
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>
              Notifications are blocked in your browser settings. Please enable notification permissions in your browser bar to subscribe.
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {isSubscribed ? (
            <>
              <Button variant="destructive" size="sm" onClick={unsubscribe} disabled={loading}>
                <BellOff className="w-4 h-4 mr-2" /> Turn Off Notifications
              </Button>
              <Button variant="outline" size="sm" onClick={sendTestNotification} className="border-primary/40 text-primary hover:bg-primary/10">
                <Send className="w-4 h-4 mr-2" /> Send Test Notification
              </Button>
            </>
          ) : (
            <Button onClick={subscribe} disabled={loading || permission === "denied"} className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4 mr-2" /> Enable Web Push Notifications
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
