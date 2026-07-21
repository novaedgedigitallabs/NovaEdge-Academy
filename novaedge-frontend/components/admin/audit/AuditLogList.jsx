"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAuditLogs } from "@/services/audit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Loader2,
  Eye,
  ScrollText,
  Search,
  Shield,
  Globe,
} from "lucide-react";
import Link from "next/link";

const actionColors = {
  CREATE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  UPDATE: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
  LOGIN: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

function getActionColor(action = "") {
  const upper = action.toUpperCase();
  if (upper.includes("CREATE") || upper.includes("ADD"))
    return actionColors.CREATE;
  if (upper.includes("DELETE") || upper.includes("REMOVE"))
    return actionColors.DELETE;
  if (upper.includes("UPDATE") || upper.includes("EDIT"))
    return actionColors.UPDATE;
  if (upper.includes("LOGIN") || upper.includes("AUTH"))
    return actionColors.LOGIN;
  return "bg-muted/50 text-muted-foreground border-border";
}

export default function AuditLogList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: "",
    targetType: "",
    actorId: "",
  });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAuditLogs(filters);
      setLogs(res.data || []);
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by action..."
            value={filters.action}
            onChange={(e) => handleFilterChange("action", e.target.value)}
            className="pl-10 bg-card/40 border-border/50"
          />
        </div>
        <div className="relative flex-1 max-w-xs">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by target type..."
            value={filters.targetType}
            onChange={(e) => handleFilterChange("targetType", e.target.value)}
            className="pl-10 bg-card/40 border-border/50"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
        {loading ? (
          <CardContent className="py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground mt-3">
              Loading audit logs...
            </p>
          </CardContent>
        ) : logs.length === 0 ? (
          <CardContent className="py-16 text-center">
            <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-muted-foreground">No audit logs found</p>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Time</TableHead>
                  <TableHead className="text-muted-foreground">Actor</TableHead>
                  <TableHead className="text-muted-foreground">Action</TableHead>
                  <TableHead className="text-muted-foreground">Target</TableHead>
                  <TableHead className="text-muted-foreground">IP</TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    Detail
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log, idx) => (
                  <motion.tr
                    key={log._id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-border/30 hover:bg-accent/10 transition-colors"
                  >
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground">
                          {log.actor?.name || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {log.actor?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs font-mono ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {log.target?.type}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {log.target?.label || log.target?.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                        <Globe className="h-3 w-3" />
                        {log.metadata?.ip || "—"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        asChild
                      >
                        <Link href={`/admin/audit/${log._id}`}>
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
