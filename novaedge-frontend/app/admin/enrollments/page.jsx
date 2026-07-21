// app/admin/enrollments/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { apiGet } from "@/lib/api";
import {
  Search,
  Loader2,
  AlertCircle,
  GraduationCap,
  Calendar,
  BookOpen,
  UserCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const premiumSpring = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGet("/api/v1/admin/enrollments");
        const list = Array.isArray(data.enrollments)
          ? data.enrollments
          : Array.isArray(data)
            ? data
            : data.data || [];
        if (mounted) setEnrollments(list);
      } catch (e) {
        if (mounted)
          setErr(e.response?.data?.message || e.message || "Failed to load enrollments");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return enrollments;
    const q = search.toLowerCase();
    return enrollments.filter((e) => {
      const user = e.user || e.student || e.userId || {};
      const course = e.course || e.courseId || {};
      return (
        user.name?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        (typeof course === "string"
          ? course.toLowerCase().includes(q)
          : (course.title || course.name || "").toLowerCase().includes(q))
      );
    });
  }, [enrollments, search]);

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={premiumSpring}
      >
        <h1 className="text-3xl font-bold tracking-tight font-heading">
          Enrollments
        </h1>
        <p className="text-muted-foreground mt-1">
          {enrollments.length} total enrollments
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name, email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card/40 border-border/50"
          />
        </div>
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
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground">
                {search ? "No enrollments match your search" : "No enrollments found"}
              </p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Student</TableHead>
                    <TableHead className="text-muted-foreground">Course</TableHead>
                    <TableHead className="text-muted-foreground">Enrolled On</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((enrollment, idx) => {
                    const id = enrollment._id || enrollment.id || idx;
                    const user = enrollment.user || enrollment.student || enrollment.userId || {};
                    const course = enrollment.course || enrollment.courseId || {};
                    const courseTitle =
                      typeof course === "string"
                        ? course
                        : course.title || course.name || "Unknown Course";
                    const enrollDate = enrollment.createdAt || enrollment.enrolledAt;

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
                            <Avatar className="h-8 w-8 border border-emerald-500/20">
                              <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground text-sm">
                                {user.name || "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {user.email || "—"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="text-sm truncate max-w-[200px]">
                              {courseTitle}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {enrollDate
                              ? new Date(enrollDate).toLocaleDateString()
                              : "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          >
                            Active
                          </Badge>
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
    </div>
  );
}
