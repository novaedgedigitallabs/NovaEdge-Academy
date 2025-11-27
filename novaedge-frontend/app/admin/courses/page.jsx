// app/admin/courses/page.jsx
"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { apiGet, apiDelete } from "@/lib/api";
import Link from "next/link";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await apiGet("/api/v1/courses");
        const list = Array.isArray(data.courses)
          ? data.courses
          : Array.isArray(data)
          ? data
          : data.data || [];
        if (mounted) setCourses(list);
      } catch (e) {
        if (mounted) setErr(e.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this course?")) return;
    try {
      await apiDelete(`/api/v1/course/${id}`);
      setCourses((prev) => prev.filter((c) => (c._id || c.id) !== id));
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  return (
    <AdminGuard>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Courses</h1>
          <Link href="/admin/courses/new">
            <button className="px-4 py-2 rounded bg-primary text-white">
              New Course
            </button>
          </Link>
        </div>

        {loading && <div>Loading courses...</div>}
        {err && <div className="text-destructive">{err}</div>}
        {!loading && !err && courses.length === 0 && (
          <div>No courses found</div>
        )}

        <div className="space-y-3">
          {courses.map((course) => {
            const id = course._id || course._id;
            return (
              <div
                key={id}
                className="p-4 border rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">
                    {course.title || course.name}
                  </div>
                  <div className="text-sm text-muted">
                    {course.category || course.description}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/courses/${id}`}>
                    <button className="px-3 py-1 border rounded">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminGuard>
  );
}
