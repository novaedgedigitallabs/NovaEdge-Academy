"use client";

import { useEffect, useState } from "react";
import { getLectureVersions, rollbackLectureVersion } from "@/services/lectureVersion";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { History, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VersionHistory({ courseId, lectureId, onRollback }) {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const loadVersions = async () => {
        setLoading(true);
        try {
            const res = await getLectureVersions(courseId, lectureId);
            setVersions(res.versions);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) loadVersions();
    }, [open]);

    const handleRollback = async (versionId) => {
        if (!confirm("Are you sure? This will create a new version with the old data.")) return;
        try {
            await rollbackLectureVersion(versionId);
            toast.success("Rolled back successfully");
            loadVersions();
            if (onRollback) onRollback();
        } catch (e) {
            toast.error("Rollback failed");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-2" /> History
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Version History</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ver</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Changelog</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>By</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {versions.map((v) => (
                                <TableRow key={v._id}>
                                    <TableCell>v{v.version}</TableCell>
                                    <TableCell>{new Date(v.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{v.changelog}</TableCell>
                                    <TableCell className="capitalize">{v.updateType}</TableCell>
                                    <TableCell>{v.updatedBy?.name || "Admin"}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRollback(v._id)}
                                        >
                                            <RotateCcw className="w-4 h-4 mr-1" /> Rollback
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DialogContent>
        </Dialog>
    );
}
