"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BellRing,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
  Globe,
  Rss,
  History,
  Info,
  Laptop,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import PushNotificationPrompt from "@/components/notification/PushNotificationPrompt";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function AdminPushNotificationsPage() {
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    studentsCount: 0,
    mentorsCount: 0,
    guestsCount: 0,
    totalSent: 0,
    successRate: 100,
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [rssSending, setRssSending] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Broadcast Form State
  const [form, setForm] = useState({
    title: "🚀 Welcome to NovaEdge Academy!",
    body: "Explore our latest tech courses, live classes, and interactive roadmaps today.",
    url: "/courses",
    icon: "/icon.png",
    image: "",
    target: "all",
  });

  const fetchStatsAndLogs = async () => {
    setLoading(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        axios.get(`${API_BASE}/push/admin/stats`, { withCredentials: true }),
        axios.get(`${API_BASE}/push/admin/logs`, { withCredentials: true }),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (logsRes.data.success) {
        setLogs(logsRes.data.logs);
      }
    } catch (error) {
      toast.error("Failed to load push stats and logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndLogs();
  }, []);

  const handleBroadcast = async () => {
    if (!form.title || !form.body) {
      toast.error("Please enter a title and message body.");
      return;
    }

    setSending(true);
    try {
      const response = await axios.post(`${API_BASE}/push/admin/broadcast`, form, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Web Push Broadcast sent!");
        setConfirmModalOpen(false);
        fetchStatsAndLogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to broadcast push notification");
    } finally {
      setSending(false);
    }
  };

  const handleTriggerRssPush = async () => {
    setRssSending(true);
    try {
      const response = await axios.post(
        `${API_BASE}/rss/trigger-push`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message || "RSS Push Triggered!");
        fetchStatsAndLogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to trigger RSS Web Push");
    } finally {
      setRssSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-heading flex items-center gap-3">
            <BellRing className="w-8 h-8 text-primary animate-pulse" />
            Web Push Notification Console
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage subscriber tokens, broadcast instant Web Push notifications, and monitor RSS automation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchStatsAndLogs} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTriggerRssPush}
            disabled={rssSending}
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
          >
            <Rss className="w-4 h-4 mr-2" /> Auto-Push Latest RSS
          </Button>
        </div>
      </div>

      {/* Browser Push Permission Toggle for Admin */}
      <PushNotificationPrompt compact={true} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50 bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscribers</CardTitle>
              <Users className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading">{stats.totalSubscribers}</div>
              <p className="text-xs text-muted-foreground mt-1">Active browser push tokens</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50 bg-gradient-to-br from-card to-emerald-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Students & Users</CardTitle>
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-emerald-400">{stats.studentsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Enrolled learner devices</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50 bg-gradient-to-br from-card to-purple-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mentors & Guests</CardTitle>
              <Globe className="w-5 h-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-purple-400">
                {stats.mentorsCount + stats.guestsCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Mentors ({stats.mentorsCount}) & Guests ({stats.guestsCount})</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50 bg-gradient-to-br from-card to-amber-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-amber-400">{stats.successRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.totalSent} total messages delivered</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Form & Real-time Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Broadcast Form (7 Columns) */}
        <Card className="lg:col-span-7 border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Compose Push Broadcast
            </CardTitle>
            <CardDescription>
              Formulate a push message to dispatch to all active browser devices immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Target Audience Segment</label>
              <Select value={form.target} onValueChange={(val) => setForm({ ...form, target: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select target segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscribers (Students, Mentors, Guests)</SelectItem>
                  <SelectItem value="students">Students & Users Only</SelectItem>
                  <SelectItem value="mentors">Mentors & Instructors Only</SelectItem>
                  <SelectItem value="guests">Guest Visitors Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Notification Title *</label>
              <Input
                placeholder="e.g. 📢 Live Masterclass Starting Now!"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                maxLength={60}
              />
              <span className="text-[11px] text-muted-foreground float-right">
                {form.title.length}/60 chars
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Message Body *</label>
              <Textarea
                placeholder="Write message summary..."
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={3}
                maxLength={140}
              />
              <span className="text-[11px] text-muted-foreground float-right">
                {form.body.length}/140 chars
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Target URL / Action Link</label>
                <Input
                  placeholder="/courses or /live-classes"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Banner Image URL (Optional)</label>
                <Input
                  placeholder="https://.../image.png"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Send className="w-4 h-4 mr-2" /> Send Broadcast Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      Confirm Web Push Broadcast
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                      You are about to dispatch this push notification to{" "}
                      <strong className="text-foreground">{stats.totalSubscribers} active subscribers</strong> in segment:{" "}
                      <Badge variant="outline" className="capitalize">{form.target}</Badge>.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-1 my-2">
                    <p className="font-semibold text-foreground">{form.title}</p>
                    <p className="text-muted-foreground text-xs">{form.body}</p>
                  </div>

                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setConfirmModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBroadcast} disabled={sending} className="bg-primary">
                      {sending ? "Broadcasting..." : "Yes, Dispatch Now"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Live Notification Preview (5 Columns) */}
        <Card className="lg:col-span-5 border-border/60 shadow-lg bg-gradient-to-b from-card to-background">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-primary" />
                Live Notification Preview
              </span>
              <Badge variant="secondary" className="text-[10px]">Real-time</Badge>
            </CardTitle>
            <CardDescription>
              Visual preview of how notifications will appear on desktop and mobile devices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Desktop OS Notification Preview Card */}
            <div className="rounded-xl border border-border/80 bg-neutral-900 text-white p-4 shadow-xl space-y-3 font-sans">
              <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary flex items-center justify-center text-[10px] font-bold text-white">N</div>
                  <span className="font-semibold text-neutral-200">NovaEdge Academy</span>
                </div>
                <span>Just now</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                  <BellRing className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-neutral-100 truncate">{form.title || "Notification Title"}</h4>
                  <p className="text-xs text-neutral-300 mt-0.5 line-clamp-2">{form.body || "Notification body text goes here..."}</p>
                </div>
              </div>
              {form.image && (
                <div className="relative h-28 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="Push banner preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                <span className="flex items-center gap-1 text-primary hover:underline cursor-pointer">
                  <ExternalLink className="w-3 h-3" /> {form.url || "/"}
                </span>
                <span>Click to open</span>
              </div>
            </div>

            {/* Mobile Notification Drawer Preview */}
            <div className="rounded-2xl border border-border/70 bg-card p-3 shadow-md space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground px-1">
                <Smartphone className="w-3.5 h-3.5" /> Mobile Notification Lockscreen
              </div>
              <div className="p-3 rounded-xl bg-accent/40 border border-border/40 flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <BellRing className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">NovaEdge</span>
                    <span>Now</span>
                  </div>
                  <p className="text-xs font-bold text-foreground mt-0.5 truncate">{form.title}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{form.body}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Broadcast Logs & History Table */}
      <Card className="border-border/60 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Push Broadcast History & Logs
            </CardTitle>
            <CardDescription>
              Detailed records of all past Web Push notifications sent by admins and automated triggers.
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Info className="w-3 h-3" /> {logs.length} Logged Runs
          </Badge>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No push notifications logged yet. Send your first broadcast above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/40 text-muted-foreground font-semibold border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Title & Message</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Sent / Success</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-accent/20 transition-colors">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="font-semibold text-foreground truncate">{log.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{log.body}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize text-xs">
                          {log.target}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={
                            log.type === "broadcast"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : log.type === "automated" || log.type === "rss"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : ""
                          }
                        >
                          {log.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-emerald-400">{log.successCount}</span>
                        <span className="text-muted-foreground"> / {log.sentCount}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
