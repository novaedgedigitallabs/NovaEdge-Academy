// app/admin/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { apiGet } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await apiGet("/api/v1/admin/stats");
        if (mounted) setStats(data);
      } catch (e) {
        if (mounted) setErr(e.message || "Failed to load stats");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <AdminGuard>
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {loading && <div>Loading stats...</div>}
        {err && <div className="text-destructive">{err}</div>}

        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded">
              <div className="text-sm text-muted">Users</div>
              <div className="text-xl font-semibold">
                {stats.usersCount ?? "—"}
              </div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-sm text-muted">Courses</div>
              <div className="text-xl font-semibold">
                {stats.coursesCount ?? "—"}
              </div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-sm text-muted">Revenue</div>
              <div className="text-xl font-semibold">₹{stats.revenue ?? 0}</div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
