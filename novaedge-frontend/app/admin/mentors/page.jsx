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
import { getAllMentors, deleteMentor } from "@/services/mentors";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminMentorsPage() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const res = await getAllMentors();
            setMentors(res.data || []);
        } catch (error) {
            toast.error("Failed to load mentors");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this mentor?")) return;

        try {
            await deleteMentor(id);
            toast.success("Mentor deleted successfully");
            fetchMentors();
        } catch (error) {
            toast.error("Failed to delete mentor");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Mentors</h1>
                <Link href="/admin/mentors/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Mentor
                    </Button>
                </Link>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : mentors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10">
                                    No mentors found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            mentors.map((mentor) => (
                                <TableRow key={mentor._id}>
                                    <TableCell className="font-medium">{mentor.name}</TableCell>
                                    <TableCell>{mentor.role}</TableCell>
                                    <TableCell>{new Date(mentor.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/admin/mentors/${mentor._id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(mentor._id)}
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
