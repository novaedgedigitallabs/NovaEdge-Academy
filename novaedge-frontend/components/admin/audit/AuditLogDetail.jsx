"use client";

import { useState, useEffect } from "react";
import { getAuditLog } from "@/services/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AuditLogDetail({ logId }) {
    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLog = async () => {
            try {
                const res = await getAuditLog(logId);
                setLog(res.data);
            } catch (error) {
                console.error("Failed to fetch log", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLog();
    }, [logId]);

    if (loading) return <Loader2 className="h-8 w-8 animate-spin" />;
    if (!log) return <div>Log not found</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Timestamp:</span>
                            <span className="font-medium">{format(new Date(log.createdAt), "PPpp")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Action:</span>
                            <Badge>{log.action}</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Actor:</span>
                            <span className="font-medium">{log.actor?.name} ({log.actor?.email})</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">IP Address:</span>
                            <span className="font-mono">{log.metadata?.ip}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">User Agent:</span>
                            <span className="font-mono truncate max-w-[200px]" title={log.metadata?.userAgent}>
                                {log.metadata?.userAgent}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Target</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{log.target.type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-mono">{log.target.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Label:</span>
                            <span className="font-medium">{log.target.label}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Changes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold mb-2 text-red-500">Before</h4>
                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs max-h-[500px]">
                                {log.changes?.before ? JSON.stringify(log.changes.before, null, 2) : "N/A"}
                            </pre>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 text-green-500">After</h4>
                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs max-h-[500px]">
                                {log.changes?.after ? JSON.stringify(log.changes.after, null, 2) : "N/A"}
                            </pre>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
