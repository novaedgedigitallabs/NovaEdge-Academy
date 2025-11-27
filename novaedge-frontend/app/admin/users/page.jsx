// app/admin/users/page.jsx
"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { apiGet, apiPut, apiDelete } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

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
        if (mounted) setErr(e.message || "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  async function updateRole(id, role) {
    try {
      await apiPut(`/api/v1/admin/user/${id}`, { role });
      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === id ? { ...u, role } : u))
      );
    } catch (e) {
      alert(e.message || "Update failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await apiDelete(`/api/v1/admin/user/${id}`);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  return (
    <AdminGuard>
      <div>
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        {loading && <div>Loading users...</div>}
        {err && <div className="text-destructive">{err}</div>}
        {!loading && users.length === 0 && <div>No users found</div>}

        <div className="space-y-3">
          {users.map((user) => {
            const id = user._id || user.id;
            return (
              <div
                key={id}
                className="p-4 border rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{user.name || user.email}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
                <div className="flex gap-2">
                  {user.role !== "admin" ? (
                    <button
                      onClick={() => updateRole(id, "admin")}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded"
                    >
                      Promote
                    </button>
                  ) : (
                    <button
                      onClick={() => updateRole(id, "user")}
                      className="px-3 py-1 border rounded"
                    >
                      Demote
                    </button>
                  )}
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
