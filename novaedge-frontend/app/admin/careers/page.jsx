"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllPositions, deletePosition } from "@/services/careers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminCareersPage() {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchPositions();
    }, []);

    const fetchPositions = async () => {
        try {
            const res = await getAllPositions();
            setPositions(res.data || []);
        } catch (error) {
            toast.error("Failed to load positions");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this position?")) return;

        try {
            await deletePosition(id);
            toast.success("Position deleted successfully");
            fetchPositions();
        } catch (error) {
            toast.error("Failed to delete position");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Careers</h1>
                <Link href="/admin/careers/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Position
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : positions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    No positions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            positions.map((position) => (
                                <TableRow key={position._id}>
                                    <TableCell className="font-medium">{position.title}</TableCell>
                                    <TableCell>{position.department}</TableCell>
                                    <TableCell>{position.location}</TableCell>
                                    <TableCell>{position.type}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/admin/careers/${position._id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(position._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
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
