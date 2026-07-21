"use client";

import { useState, useEffect } from "react";
import { getBadges, createBadge, updateBadge } from "@/services/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Plus } from "lucide-react";

export default function AdminBadgeManager() {
    const [badges, setBadges] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingBadge, setEditingBadge] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        iconUrl: "",
        tier: "bronze",
        criteria: { type: "EVENT", event: "COURSE_COMPLETED", threshold: 1 }
    });

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        const res = await getBadges();
        setBadges(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBadge) {
                await updateBadge(editingBadge._id, formData);
                toast.success("Badge updated");
            } else {
                await createBadge(formData);
                toast.success("Badge created");
            }
            setIsOpen(false);
            setEditingBadge(null);
            resetForm();
            fetchBadges();
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            iconUrl: "",
            tier: "bronze",
            criteria: { type: "EVENT", event: "COURSE_COMPLETED", threshold: 1 }
        });
    };

    const openEdit = (badge) => {
        setEditingBadge(badge);
        setFormData({
            name: badge.name,
            description: badge.description,
            iconUrl: badge.iconUrl,
            tier: badge.tier,
            criteria: badge.criteria
        });
        setIsOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => { setEditingBadge(null); resetForm(); setIsOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Create Badge
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead>Criteria</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {badges.map((badge) => (
                            <TableRow key={badge._id}>
                                <TableCell>
                                    <img src={badge.iconUrl} alt={badge.name} className="w-8 h-8" />
                                </TableCell>
                                <TableCell className="font-medium">{badge.name}</TableCell>
                                <TableCell className="capitalize">{badge.tier}</TableCell>
                                <TableCell>
                                    {badge.criteria.type === "EVENT" ? `Event: ${badge.criteria.event}` : `Threshold: ${badge.criteria.threshold}`}
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => openEdit(badge)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingBadge ? "Edit Badge" : "Create Badge"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Tier</Label>
                                <Select value={formData.tier} onValueChange={v => setFormData({ ...formData, tier: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bronze">Bronze</SelectItem>
                                        <SelectItem value="silver">Silver</SelectItem>
                                        <SelectItem value="gold">Gold</SelectItem>
                                        <SelectItem value="platinum">Platinum</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>

                        <div className="space-y-2">
                            <Label>Icon URL</Label>
                            <Input value={formData.iconUrl} onChange={e => setFormData({ ...formData, iconUrl: e.target.value })} required placeholder="https://..." />
                        </div>

                        <div className="space-y-2 border p-3 rounded-md">
                            <Label className="mb-2 block">Criteria</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Select value={formData.criteria.type} onValueChange={v => setFormData({ ...formData, criteria: { ...formData.criteria, type: v } })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EVENT">Event Based</SelectItem>
                                        <SelectItem value="THRESHOLD">Threshold Based</SelectItem>
                                    </SelectContent>
                                </Select>

                                {formData.criteria.type === "EVENT" ? (
                                    <Input
                                        placeholder="Event Name (e.g. COURSE_COMPLETED)"
                                        value={formData.criteria.event}
                                        onChange={e => setFormData({ ...formData, criteria: { ...formData.criteria, event: e.target.value } })}
                                    />
                                ) : (
                                    <Input
                                        type="number"
                                        placeholder="Threshold Value"
                                        value={formData.criteria.threshold}
                                        onChange={e => setFormData({ ...formData, criteria: { ...formData.criteria, threshold: Number(e.target.value) } })}
                                    />
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="submit">Save Badge</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
