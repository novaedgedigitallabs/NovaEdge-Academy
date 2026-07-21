"use client";

import { useParams, useRouter } from "next/navigation";
import AuditLogDetail from "@/components/admin/audit/AuditLogDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AuditDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    return (
        <div className="glass-card bg-white/30 backdrop-blur-sm p-6 space-y-6">
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:pl-2 transition-all"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Logs
            </Button>

            <AuditLogDetail logId={id} />
        </div>
    );
}
