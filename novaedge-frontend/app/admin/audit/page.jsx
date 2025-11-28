import AuditLogList from "@/components/admin/audit/AuditLogList";

export default function AuditPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Audit Logs</h1>
            <AuditLogList />
        </div>
    );
}
