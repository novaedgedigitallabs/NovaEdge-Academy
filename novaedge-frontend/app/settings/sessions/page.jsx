"use client";

import DeviceList from "@/components/settings/DeviceList";

export default function SessionsPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Device Management</h1>
            <DeviceList />
        </div>
    );
}
