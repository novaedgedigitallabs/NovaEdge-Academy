import AdminBadgeManager from "@/components/admin/gamification/AdminBadgeManager";

export default function AdminBadgesPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Badge Management</h1>
            <AdminBadgeManager />
        </div>
    );
}
