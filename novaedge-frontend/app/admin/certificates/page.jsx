"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";
import { adminGenerateCertificate, adminDeleteCertificate } from "@/services/certificate";
import { toast } from "sonner";
import {
    ScrollText, Award, User, BookOpen, Loader2,
    CheckCircle, XCircle, ExternalLink, RefreshCw, Search, Trash2
} from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminCertificatesPage() {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingCerts, setLoadingCerts] = useState(true);

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [generating, setGenerating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [result, setResult] = useState(null);

    const [userSearch, setUserSearch] = useState("");
    const [certSearch, setCertSearch] = useState("");

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const [usersRes, coursesRes] = await Promise.all([
                apiGet("/api/v1/admin/users"),
                apiGet("/api/v1/courses"),
            ]);
            setUsers(Array.isArray(usersRes.users) ? usersRes.users : []);
            setCourses(Array.isArray(coursesRes.courses) ? coursesRes.courses : []);
        } catch {
            toast.error("Failed to load users/courses");
        } finally {
            setLoadingData(false);
        }
    };

    const fetchCertificates = async () => {
        setLoadingCerts(true);
        try {
            const res = await apiGet("/api/v1/admin/certificates");
            setCertificates(Array.isArray(res.certificates) ? res.certificates : []);
        } catch {
            setCertificates([]);
        } finally {
            setLoadingCerts(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchCertificates();
    }, []);

    const handleGenerate = async () => {
        if (!selectedUser || !selectedCourse) {
            toast.error("Please select both a student and a course");
            return;
        }
        setGenerating(true);
        setResult(null);
        try {
            const res = await adminGenerateCertificate(selectedUser, selectedCourse);
            const cert = res.certificate;
            setResult({
                success: true,
                certificate: cert,
                message: res.message || "Certificate generated successfully!",
                verifyUrl: cert?.pdfUrl || `/certificate/${cert?.certificateId}`,
            });
            toast.success(res.message || "Certificate generated successfully!");
            setSelectedUser("");
            setSelectedCourse("");
            setUserSearch("");
            fetchCertificates();
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Failed to generate certificate";
            setResult({ success: false, message: msg });
            toast.error(msg);
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (cert) => {
        const studentName = cert.user?.name || "this student";
        if (!window.confirm(`Are you sure you want to delete/revoke the certificate for "${studentName}"?`)) {
            return;
        }
        setDeletingId(cert._id);
        try {
            const res = await adminDeleteCertificate(cert._id);
            toast.success(res.message || "Certificate deleted successfully!");
            fetchCertificates();
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Failed to delete certificate";
            toast.error(msg);
        } finally {
            setDeletingId(null);
        }
    };

    const filteredUsers = users.filter(u =>
        (u.name + u.email).toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredCerts = certificates.filter(c =>
        (c.certificateId + (c.user?.name || "") + (c.course?.title || "")).toLowerCase().includes(certSearch.toLowerCase())
    );

    const selectedUserObj = users.find(u => u._id === selectedUser);
    const selectedCourseObj = courses.find(c => c._id === selectedCourse);

    return (
        <AdminGuard>
            <div className="space-y-8">
                {/* ── Header ── */}
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <ScrollText className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Certificate Management</h1>
                        <p className="text-sm text-muted-foreground">Issue certificates manually or remove mistakenly issued ones</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-6 items-start">
                    {/* ── Left: Generate Form ── */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="border border-border rounded-2xl bg-card p-6 space-y-5">
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-amber-400" />
                                <h2 className="font-semibold">Issue Certificate</h2>
                            </div>

                            {/* Student selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5" /> Student
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <input
                                        value={userSearch}
                                        onChange={e => { setUserSearch(e.target.value); setSelectedUser(""); }}
                                        placeholder="Search student name or email..."
                                        className="w-full pl-8 pr-3 py-2 border border-input rounded-lg text-sm bg-background"
                                    />
                                </div>
                                {userSearch && !selectedUser && (
                                    <div className="border border-border rounded-lg overflow-hidden max-h-40 overflow-y-auto bg-popover">
                                        {filteredUsers.length === 0 ? (
                                            <p className="text-xs text-muted-foreground p-3">No users found</p>
                                        ) : filteredUsers.slice(0, 8).map(u => (
                                            <button
                                                key={u._id}
                                                type="button"
                                                onClick={() => { setSelectedUser(u._id); setUserSearch(u.name + " (" + u.email + ")"); }}
                                                className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors text-sm border-b border-border last:border-0"
                                            >
                                                <span className="font-medium">{u.name}</span>
                                                <span className="text-muted-foreground text-xs block">{u.email}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {selectedUser && (
                                    <div className="flex items-center gap-2 text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg px-3 py-2">
                                        <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                        {selectedUserObj?.name} selected
                                    </div>
                                )}
                            </div>

                            {/* Course selector */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                    <BookOpen className="h-3.5 w-3.5" /> Course
                                </label>
                                {loadingData ? (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading courses...
                                    </div>
                                ) : (
                                    <div className="border border-border rounded-lg overflow-hidden max-h-52 overflow-y-auto bg-background">
                                        {courses.map(c => (
                                            <button
                                                key={c._id}
                                                type="button"
                                                onClick={() => setSelectedCourse(c._id)}
                                                className={`w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors text-sm border-b border-border last:border-0 flex items-center justify-between gap-2 ${selectedCourse === c._id ? "bg-primary/10 text-primary border-l-2 border-l-primary" : ""}`}
                                            >
                                                <span className="line-clamp-1">{c.title}</span>
                                                {selectedCourse === c._id && <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Preview */}
                            {selectedUser && selectedCourse && (
                                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-1.5 text-sm">
                                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Preview</p>
                                    <p><span className="text-muted-foreground">Student:</span> <span className="font-medium">{selectedUserObj?.name}</span></p>
                                    <p><span className="text-muted-foreground">Course:</span> <span className="font-medium line-clamp-1">{selectedCourseObj?.title}</span></p>
                                </div>
                            )}

                            {/* Result feedback */}
                            {result && (
                                <div className={`rounded-xl p-3 flex items-start gap-2 text-sm border ${result.success ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                                    {result.success
                                        ? <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        : <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    }
                                    <div>
                                        <p className="font-medium">{result.message}</p>
                                        {result.verifyUrl && (
                                            <a href={result.verifyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs mt-1 underline underline-offset-2">
                                                <ExternalLink className="h-3 w-3" /> View Certificate
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Generate button */}
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={generating || !selectedUser || !selectedCourse}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generating
                                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                                    : <><Award className="h-4 w-4" /> Generate Certificate</>
                                }
                            </button>
                        </div>
                    </div>

                    {/* ── Right: Issued Certificates List ── */}
                    <div className="lg:col-span-3 border border-border rounded-2xl bg-card overflow-hidden">
                        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border">
                            <div className="flex items-center gap-2">
                                <ScrollText className="h-4 w-4 text-muted-foreground" />
                                <h2 className="font-semibold text-sm">Issued Certificates</h2>
                                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{certificates.length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <input
                                        value={certSearch}
                                        onChange={e => setCertSearch(e.target.value)}
                                        placeholder="Search..."
                                        className="pl-8 pr-3 py-1.5 border border-input rounded-lg text-xs bg-background w-40"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={fetchCertificates}
                                    className="p-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                    title="Refresh"
                                >
                                    <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {loadingCerts ? (
                            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground text-sm">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading certificates...
                            </div>
                        ) : filteredCerts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
                                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                                    <ScrollText className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium">No certificates issued yet</p>
                                <p className="text-xs text-muted-foreground">Generate your first certificate using the form on the left</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {filteredCerts.map((cert) => (
                                    <div key={cert._id} className="px-5 py-3.5 hover:bg-muted/20 transition-colors flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                            <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                                <Award className="h-4 w-4 text-amber-400" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium truncate">{cert.user?.name || "Unknown"}</p>
                                                <p className="text-xs text-muted-foreground truncate">{cert.course?.title || "Unknown Course"}</p>
                                                <p className="text-xs text-amber-400/80 font-mono mt-0.5">{cert.certificateId}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <div className="text-right space-y-1">
                                                <p className="text-xs text-muted-foreground">
                                                    {cert.createdAt ? new Date(cert.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—"}
                                                </p>                                                {cert.pdfUrl && (
                                                    <a
                                                        href={cert.pdfUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline block"
                                                    >
                                                        <ExternalLink className="h-3 w-3" /> View
                                                    </a>
                                                )}
                                            </div>

                                            {/* Delete / Revoke Action Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(cert)}
                                                disabled={deletingId === cert._id}
                                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 disabled:opacity-50"
                                                title="Delete / Revoke Certificate"
                                            >
                                                {deletingId === cert._id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
