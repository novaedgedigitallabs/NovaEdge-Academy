"use client";

import { useEffect, useState } from "react";
import { getTickets } from "@/services/tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Ticket, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function AgentDashboard() {
    const [stats, setStats] = useState({
        open: 0,
        resolved: 0,
        pending: 0,
        urgent: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // In a real app, we'd have a dedicated stats endpoint
            // Here we'll just fetch tickets and count them client-side for simplicity
            const res = await getTickets({ limit: 100 });
            const tickets = res.data;

            const newStats = {
                open: tickets.filter((t) => t.status === "open").length,
                resolved: tickets.filter((t) => t.status === "resolved").length,
                pending: tickets.filter((t) => t.status === "pending").length,
                urgent: tickets.filter((t) => t.priority === "urgent" && t.status !== "closed").length,
            };
            setStats(newStats);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader2 className="h-8 w-8 animate-spin" />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                    <Ticket className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.open}</div>
                    <p className="text-xs text-muted-foreground">Requiring attention</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground">Waiting for customer</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.resolved}</div>
                    <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.urgent}</div>
                    <p className="text-xs text-muted-foreground">High priority</p>
                </CardContent>
            </Card>
        </div>
    );
}
