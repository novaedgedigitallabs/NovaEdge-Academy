// app/admin/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiGet } from "@/lib/api";
import {
  Users,
  BookOpen,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  Plus,
  BarChart3,
  ScrollText,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const premiumSpring = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: premiumSpring },
};

function StatCard({ icon: Icon, label, value, gradient, subtext, trend }) {
  return (
    <motion.div variants={fadeUpItem}>
      <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors group">
        <div
          className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${gradient}`}
        />
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                {label}
              </p>
              <motion.p
                className="text-3xl font-bold mt-1 tracking-tight"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={premiumSpring}
              >
                {value}
              </motion.p>
              {subtext && (
                <div className="flex items-center gap-1.5 mt-2">
                  {trend === "up" ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  ) : trend === "down" ? (
                    <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                  ) : null}
                  <span
                    className={`text-xs font-medium ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-muted-foreground"}`}
                  >
                    {subtext}
                  </span>
                </div>
              )}
            </div>
            <div
              className={`h-11 w-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg`}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickActionCard({ icon: Icon, label, href, description }) {
  return (
    <motion.div variants={fadeUpItem} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <Link href={href}>
        <Card className="h-full border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/40 cursor-pointer transition-all group">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {label}
                </p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await apiGet("/api/v1/admin/stats");
      setStats(data);
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md w-full border-red-500/30 bg-red-500/5">
          <CardContent className="pt-6 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
            <p className="text-red-300 font-medium">{err}</p>
            <Button variant="outline" onClick={fetchStats} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={premiumSpring}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Platform overview and key metrics
          </p>
        </div>
        <Button variant="outline" onClick={fetchStats} size="sm" className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </motion.div>

      {/* KPI Grid */}
      <motion.div
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.usersCount?.toLocaleString() ?? "—"}
          gradient="from-blue-500 to-cyan-500"
          subtext="Registered accounts"
        />
        <StatCard
          icon={BookOpen}
          label="Total Courses"
          value={stats?.coursesCount?.toLocaleString() ?? "—"}
          gradient="from-violet-500 to-purple-500"
          subtext="Published courses"
        />
        <StatCard
          icon={GraduationCap}
          label="Enrollments"
          value={stats?.subscriptionsCount?.toLocaleString() ?? "—"}
          gradient="from-emerald-500 to-green-500"
          subtext="Active enrollments"
          trend="up"
        />
        <StatCard
          icon={IndianRupee}
          label="Revenue"
          value={`₹${(stats?.revenue ?? 0).toLocaleString()}`}
          gradient="from-amber-500 to-orange-500"
          subtext="Total platform revenue"
          trend="up"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <motion.div
          variants={containerStagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <QuickActionCard
            icon={Plus}
            label="New Course"
            href="/admin/courses/new"
            description="Create a new course"
          />
          <QuickActionCard
            icon={BarChart3}
            label="View Analytics"
            href="/admin/analytics"
            description="Platform insights"
          />
          <QuickActionCard
            icon={ScrollText}
            label="Issue Certificate"
            href="/admin/certificates"
            description="Generate for student"
          />
          <QuickActionCard
            icon={Users}
            label="Manage Users"
            href="/admin/users"
            description="View all users"
          />
        </motion.div>
      </motion.div>

      {/* Recent Activity Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ...premiumSpring }}
      >
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Platform Status</CardTitle>
            <CardDescription>
              Your NovaEdge Academy is running smoothly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Backend API</p>
                  <p className="text-xs text-muted-foreground">Operational</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-xs text-muted-foreground">Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Payments</p>
                  <p className="text-xs text-muted-foreground">Razorpay Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
