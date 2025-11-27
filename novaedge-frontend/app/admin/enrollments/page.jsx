// app/admin/enrollments/page.jsx
"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { apiGet } from "@/lib/api";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

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
        if (mounted) setErr(e.message || "Failed to load enrollments");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <AdminGuard>
      <div>
        <h1 className="text-2xl font-bold mb-4">Enrollments</h1>
        {loading && <div>Loading enrollments...</div>}
        {err && <div className="text-destructive">{err}</div>}
        {!loading && enrollments.length === 0 && (
          <div>No enrollments found</div>
        )}

        <div className="space-y-3">
          {enrollments.map((e, idx) => {
            const id = e._id || e.id || idx;
            // shape might be { user, course, createdAt }
            const user = e.user || e.student || e.userId || {};
            const course = e.course || e.courseId || {};
            return (
              <div
                key={id}
                className="p-4 border rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">
                    {user.name || user.email || "User"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Course:{" "}
                    {course.title || course.name || course._id || course}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(
                    e.createdAt || e.enrolledAt || Date.now()
                  ).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminGuard>
  );
}
