"use client";

import PushNotificationPrompt from "@/components/notification/PushNotificationPrompt";

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage how you receive alerts, course updates, and push notifications.
        </p>
      </div>

      <PushNotificationPrompt compact={false} />
    </div>
  );
}
