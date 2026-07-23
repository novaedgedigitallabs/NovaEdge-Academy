"use client";

import { use } from "react";
import AppLayout from "@/components/layout/AppLayout";
import TicketDetail from "@/components/support/TicketDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UserTicketPage({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    return (
        <AppLayout className="w-full">
            <div className="w-full px-4 py-6 space-y-6">
                <Link href="/help-center">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Help Center
                    </Button>
                </Link>
                <TicketDetail ticketId={id} />
            </div>
        </AppLayout>
    );
}
