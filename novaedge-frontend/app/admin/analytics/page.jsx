// app/admin/analytics/page.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAnalyticsOverview } from "@/services/analytics";
import {
  RevenueChart,
  UsersChart,
} from "@/components/analytics/AnalyticsCharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Loader2,
  IndianRupee,
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: premiumSpring },
};

function KpiCard({ icon: Icon, label, value, gradient }) {
  return (
    <motion.div variants={fadeUpItem}>
      <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors group">
        <div
          className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${gradient}`}
        />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          <div
            className={`h-9 w-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg`}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-2xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={premiumSpring}
          >
            {value}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await getAnalyticsOverview();
      setData(res);
    } catch (e) {
      setErr(
        e.response?.data?.message || e.message || "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            Loading analytics...
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
            <p className="text-red-300">{err}</p>
            <Button variant="outline" onClick={fetchData} className="gap-2">
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
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Platform performance over the last 30 days
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchData}
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={containerStagger}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-3 gap-4"
      >
        <KpiCard
          icon={IndianRupee}
          label="Revenue (24h)"
          value={`₹${(data?.kpi?.revenue24h ?? 0).toLocaleString()}`}
          gradient="from-amber-500 to-orange-500"
        />
        <KpiCard
          icon={Users}
          label="New Users (24h)"
          value={(data?.kpi?.newUsers24h ?? 0).toLocaleString()}
          gradient="from-blue-500 to-cyan-500"
        />
        <KpiCard
          icon={Activity}
          label="Active Users (24h)"
          value={(data?.kpi?.activeUsers24h ?? 0).toLocaleString()}
          gradient="from-emerald-500 to-green-500"
        />
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, ...premiumSpring }}
        className="grid md:grid-cols-2 gap-6"
      >
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Revenue Trend</CardTitle>
            </div>
            <CardDescription>Last 30 days of revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={data?.revenue || []} />
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-secondary" />
              <CardTitle className="text-base">User Growth</CardTitle>
            </div>
            <CardDescription>New signups per day</CardDescription>
          </CardHeader>
          <CardContent>
            <UsersChart data={data?.newUsers || []} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
