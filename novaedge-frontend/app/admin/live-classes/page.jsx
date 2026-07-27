// app/admin/live-classes/page.jsx
"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import { Video, Plus, X, ExternalLink, Calendar, Clock, Check, XCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_COLORS = {
    scheduled: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    live: "bg-green-500/15 text-green-400 border border-green-500/30",
    completed: "bg-muted text-muted-foreground border border-border",
    cancelled: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const PROVIDERS = ["Zoom", "Google Meet", "YouTube Live", "Microsoft Teams", "Other"];

export default function AdminLiveClassesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [liveClasses, setLiveClasses] = useState({}); // { courseId: [...classes] }
    const [loadingClasses, setLoadingClasses] = useState({});

    // Schedule form state
    const [showForm, setShowForm] = useState(null); // courseId or null
    const [form, setForm] = useState({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        provider: "Zoom",
        meetingLink: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        apiGet("/api/v1/courses")
            .then((res) => setCourses(res.courses || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const fetchLiveClasses = async (courseId) => {
        if (liveClasses[courseId]) return; // already fetched
        setLoadingClasses((prev) => ({ ...prev, [courseId]: true }));
        try {
            const res = await apiGet(`/api/v1/course/${courseId}/live`);
            setLiveClasses((prev) => ({ ...prev, [courseId]: res.classes || [] }));
        } catch (err) {
            setLiveClasses((prev) => ({ ...prev, [courseId]: [] }));
        } finally {
            setLoadingClasses((prev) => ({ ...prev, [courseId]: false }));
        }
    };

    const toggleCourse = (courseId) => {
        if (expandedCourse === courseId) {
            setExpandedCourse(null);
            setShowForm(null);
        } else {
            setExpandedCourse(courseId);
            setShowForm(null);
            fetchLiveClasses(courseId);
        }
    };

    const handleSchedule = async (courseId) => {
        setFormError("");
        if (!form.title || !form.startTime || !form.endTime || !form.meetingLink) {
            setFormError("Title, Start Time, End Time, and Meeting Link are required.");
            return;
        }
        if (new Date(form.endTime) <= new Date(form.startTime)) {
            setFormError("End time must be after start time.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await apiPost(`/api/v1/course/${courseId}/live`, form);
            // Refresh classes for this course
            setLiveClasses((prev) => ({
                ...prev,
                [courseId]: [res.liveClass, ...(prev[courseId] || [])],
            }));
            setForm({ title: "", description: "", startTime: "", endTime: "", provider: "Zoom", meetingLink: "" });
            setShowForm(null);
        } catch (err) {
            setFormError(err?.response?.data?.message || err?.message || "Failed to schedule");
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (courseId, liveId, status) => {
        try {
            await apiPut(`/api/v1/live/${liveId}/status`, { status });
            setLiveClasses((prev) => ({
                ...prev,
                [courseId]: prev[courseId].map((c) =>
                    c._id === liveId ? { ...c, status } : c
                ),
            }));
        } catch (err) {
            alert("Failed to update status: " + (err?.message || "Unknown error"));
        }
    };

    const formatDateTime = (iso) => {
        if (!iso) return "—";
        return new Date(iso).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <AdminGuard>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Live Classes</h1>
                        <p className="text-sm text-muted-foreground">Schedule and manage live sessions per course</p>
                    </div>
                </div>

                {/* How to use */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-400 space-y-1">
                    <p className="font-semibold">📋 How to add a Live Class:</p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-300/80">
                        <li>Click on a course below to expand it</li>
                        <li>Click <strong>+ Schedule Live Class</strong></li>
                        <li>Fill in title, date/time, platform, and the meeting link (Zoom/Meet URL)</li>
                        <li>Submit — enrolled students will see it on the course page</li>
                    </ol>
                </div>

                {/* Course List */}
                {loading ? (
                    <div className="flex items-center gap-2 text-muted-foreground py-10">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading courses...
                    </div>
                ) : courses.length === 0 ? (
                    <p className="text-muted-foreground">No courses found.</p>
                ) : (
                    <div className="space-y-3">
                        {courses.map((course) => (
                            <div key={course._id} className="border border-border rounded-xl overflow-hidden">
                                {/* Course Row */}
                                <button
                                    type="button"
                                    onClick={() => toggleCourse(course._id)}
                                    className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {course.poster?.url && (
                                            <img
                                                src={course.poster.url}
                                                alt={course.title}
                                                className="h-10 w-16 object-cover rounded-lg border border-border flex-shrink-0"
                                            />
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-semibold truncate">{course.title}</p>
                                            <p className="text-xs text-muted-foreground">{course.category} · {course.numOfVideos || 0} lectures</p>
                                        </div>
                                    </div>
                                    {expandedCourse === course._id
                                        ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    }
                                </button>

                                {/* Expanded Panel */}
                                {expandedCourse === course._id && (
                                    <div className="border-t border-border p-4 space-y-4 bg-muted/10">
                                        {/* Schedule Button */}
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(showForm === course._id ? null : course._id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Schedule Live Class
                                        </button>

                                        {/* Schedule Form */}
                                        {showForm === course._id && (
                                            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                                                <h3 className="font-semibold text-sm">New Live Class</h3>

                                                {formError && (
                                                    <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                                                        {formError}
                                                    </p>
                                                )}

                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    <div className="sm:col-span-2">
                                                        <label className="text-xs font-medium text-muted-foreground">Title *</label>
                                                        <input
                                                            value={form.title}
                                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                            placeholder="e.g. Live Q&A Session - Week 3"
                                                            className="w-full mt-1 border border-input p-2 rounded-lg text-sm bg-background"
                                                        />
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <label className="text-xs font-medium text-muted-foreground">Description</label>
                                                        <textarea
                                                            value={form.description}
                                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                            placeholder="What will be covered in this session?"
                                                            rows={2}
                                                            className="w-full mt-1 border border-input p-2 rounded-lg text-sm bg-background"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-medium text-muted-foreground">Start Date & Time *</label>
                                                        <input
                                                            type="datetime-local"
                                                            value={form.startTime}
                                                            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                                                            className="w-full mt-1 border border-input p-2 rounded-lg text-sm bg-background"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-medium text-muted-foreground">End Date & Time *</label>
                                                        <input
                                                            type="datetime-local"
                                                            value={form.endTime}
                                                            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                                                            className="w-full mt-1 border border-input p-2 rounded-lg text-sm bg-background"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-medium text-muted-foreground">Platform</label>
                                                        <select
                                                            value={form.provider}
                                                            onChange={(e) => setForm({ ...form, provider: e.target.value })}
                                                            className="w-full mt-1 border border-input p-2 rounded-lg text-sm bg-background"
                                                        >
                                                            {PROVIDERS.map((p) => (
                                                                <option key={p} value={p}>{p}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-medium text-muted-foreground">Meeting Link *</label>
                                                        <input
                                                            value={form.meetingLink}
                                                            onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                                                            placeholder="https://zoom.us/j/..."
                                                            className="w-full mt-1 border border-input p-2 rounded-lg text-sm bg-background"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSchedule(course._id)}
                                                        disabled={submitting}
                                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
                                                    >
                                                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                        {submitting ? "Scheduling..." : "Schedule"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowForm(null); setFormError(""); }}
                                                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted/50 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" /> Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Existing Live Classes */}
                                        {loadingClasses[course._id] ? (
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                                                <Loader2 className="h-4 w-4 animate-spin" /> Loading classes...
                                            </div>
                                        ) : (liveClasses[course._id] || []).length === 0 ? (
                                            <p className="text-sm text-muted-foreground py-2">No live classes scheduled yet for this course.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scheduled Classes</p>
                                                {(liveClasses[course._id] || []).map((cls) => (
                                                    <div key={cls._id} className="border border-border rounded-xl p-3 bg-card space-y-2">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <p className="font-semibold text-sm truncate">{cls.title}</p>
                                                                {cls.description && (
                                                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{cls.description}</p>
                                                                )}
                                                            </div>
                                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${STATUS_COLORS[cls.status] || STATUS_COLORS.scheduled}`}>
                                                                {cls.status || "scheduled"}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {formatDateTime(cls.startTime)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                Ends: {formatDateTime(cls.endTime)}
                                                            </span>
                                                            <span className="font-medium text-foreground">{cls.provider}</span>
                                                        </div>

                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {cls.meetingLink && (
                                                                <a
                                                                    href={cls.meetingLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                                                                >
                                                                    <ExternalLink className="h-3 w-3" /> Open Meeting Link
                                                                </a>
                                                            )}
                                                            {/* Status Actions */}
                                                            {cls.status === "scheduled" && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleStatusUpdate(course._id, cls._id, "live")}
                                                                        className="flex items-center gap-1 text-xs text-green-500 hover:underline"
                                                                    >
                                                                        <Check className="h-3 w-3" /> Mark Live
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleStatusUpdate(course._id, cls._id, "cancelled")}
                                                                        className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                                                                    >
                                                                        <XCircle className="h-3 w-3" /> Cancel
                                                                    </button>
                                                                </>
                                                            )}
                                                            {cls.status === "live" && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleStatusUpdate(course._id, cls._id, "completed")}
                                                                    className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                                                                >
                                                                    <Check className="h-3 w-3" /> Mark Completed
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminGuard>
    );
}
