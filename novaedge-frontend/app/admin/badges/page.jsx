import AdminBadgeManager from "@/components/admin/gamification/AdminBadgeManager";

export default function AdminBadgesPage() {
    return (
        <div className="glass-card bg-white/30 backdrop-blur-sm p-4 rounded-xl shadow-sm">
            <h1 className="text-3xl font-bold mb-8">Badge Management</h1>
            <AdminBadgeManager />
        </div>
    );
}
