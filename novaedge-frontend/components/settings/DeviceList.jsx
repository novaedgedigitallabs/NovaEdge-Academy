"use client";

import { useState, useEffect } from "react";
import { getSessions, revokeSession, revokeOtherSessions } from "@/services/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Laptop, Smartphone, Globe, Trash2, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function DeviceList() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            const res = await getSessions();
            setSessions(res.sessions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (id) => {
        try {
            await revokeSession(id);
            setSessions(sessions.filter(s => s._id !== id));
            toast.success("Session Revoked");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleRevokeOthers = async () => {
        if (!confirm("Are you sure you want to log out of all other devices?")) return;
        try {
            await revokeOtherSessions();
            fetchSessions();
            toast.success("All other sessions revoked");
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) return <div className="p-4"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Active Sessions</h3>
                    <p className="text-sm text-muted-foreground">Manage devices where you are currently logged in.</p>
                </div>
                {sessions.length > 1 && (
                    <Button variant="destructive" size="sm" onClick={handleRevokeOthers}>
                        <ShieldAlert className="w-4 h-4 mr-2" /> Revoke All Others
                    </Button>
                )}
            </div>

            <div className="grid gap-4">
                {sessions.map((session) => (
                    <Card key={session._id} className={session.isCurrent ? "border-primary" : ""}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-muted rounded-full">
                                    {session.device === "mobile" ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{session.os} - {session.browser}</p>
                                        {session.isCurrent && <Badge>Current Device</Badge>}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Globe className="w-3 h-3" />
                                        <span>{session.location?.city}, {session.location?.country}</span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">IP: {session.ip}</p>
                                </div>
                            </div>

                            {!session.isCurrent && (
                                <Button variant="ghost" size="icon" onClick={() => handleRevoke(session._id)}>
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
