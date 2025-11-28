"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getTickets } from "@/services/tickets";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        search: "",
    });

    useEffect(() => {
        fetchTickets();
    }, [filters]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.status && filters.status !== "all") params.status = filters.status;
            if (filters.priority && filters.priority !== "all") params.priority = filters.priority;
            // Note: Backend search implementation might need regex on subject/description
            // For now, we'll rely on status/priority filters

            const res = await getTickets(params);
            setTickets(res.data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "open": return "bg-blue-500";
            case "pending": return "bg-yellow-500";
            case "resolved": return "bg-green-500";
            case "closed": return "bg-gray-500";
            default: return "bg-gray-500";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "urgent": return "text-red-500 font-bold";
            case "high": return "text-orange-500";
            case "medium": return "text-yellow-500";
            case "low": return "text-green-500";
            default: return "";
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Input
                    placeholder="Search tickets..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="max-w-sm"
                />
                <Select
                    value={filters.status}
                    onValueChange={(val) => handleFilterChange("status", val)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={filters.priority}
                    onValueChange={(val) => handleFilterChange("priority", val)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Requester</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Assignee</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket) => (
                                <TableRow key={ticket._id}>
                                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                                    <TableCell>
                                        {ticket.requester?.name || ticket.requesterName || "Guest"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(ticket.status)}>
                                            {ticket.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={getPriorityColor(ticket.priority)}>
                                        {ticket.priority.toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        {ticket.assignee?.name || "Unassigned"}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/support/tickets/${ticket._id}`}>
                                                View
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
