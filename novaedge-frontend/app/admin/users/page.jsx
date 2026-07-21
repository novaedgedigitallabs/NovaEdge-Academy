// app/admin/users/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { apiGet, apiPut, apiDelete } from "@/lib/api";
import {
  Search,
  Loader2,
  AlertCircle,
  Users,
  Shield,
  ShieldOff,
  Trash2,
  Mail,
  UserCircle,
  Crown,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const premiumSpring = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

const roleBadgeColors = {
  admin: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  user: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  mentor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  agent: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGet("/api/v1/admin/users");
        const list = Array.isArray(data.users)
          ? data.users
          : Array.isArray(data)
            ? data
            : data.data || [];
        if (mounted) setUsers(list);
      } catch (e) {
        if (mounted)
          setErr(e.response?.data?.message || e.message || "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let result = users;
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, search, roleFilter]);

  async function updateRole(id, role) {
    try {
      await apiPut(`/api/v1/admin/user/${id}`, { role });
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === id ? { ...u, role } : u))
      );
      toast.success(`User role updated to ${role}`);
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Update failed");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/api/v1/admin/user/${deleteTarget}`);
      setUsers((prev) =>
        prev.filter((u) => (u._id || u.id) !== deleteTarget)
      );
      toast.success("User deleted");
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || "Delete failed");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md w-full border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
            <p className="text-red-300">{err}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="glass-card bg-white/30 backdrop-blur-sm p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={premiumSpring}
      >
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          Users
        </h1>
        <p className="text-muted-foreground mt-1">
          {users.length} registered users
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card/40 border-border/50"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40 bg-card/40 border-border/50">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="mentor">Mentor</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ...premiumSpring }}
      >
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden">
          {filtered.length === 0 ? (
            <CardContent className="py-16 text-center">
              <UserCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground">
                {search || roleFilter !== "all"
                  ? "No users match your filters"
                  : "No users found"}
              </p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">User</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user, idx) => {
                    const id = user._id || user.id;
                    return (
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-border/30 hover:bg-accent/10 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border border-primary/20">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">
                              {user.name || "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${roleBadgeColors[user.role] || "text-muted-foreground"}`}
                          >
                            {user.role === "admin" && (
                              <Crown className="h-3 w-3 mr-1" />
                            )}
                            {user.role || "user"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {user.role !== "admin" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs gap-1 hover:bg-amber-500/10 hover:text-amber-400"
                                onClick={() => updateRole(id, "admin")}
                              >
                                <Shield className="h-3 w-3" />
                                Promote
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs gap-1 hover:bg-blue-500/10 hover:text-blue-400"
                                onClick={() => updateRole(id, "user")}
                              >
                                <ShieldOff className="h-3 w-3" />
                                Demote
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 hover:bg-red-500/10 hover:text-red-400"
                              onClick={() => setDeleteTarget(id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent className="glass-panel border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user account and all associated
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
