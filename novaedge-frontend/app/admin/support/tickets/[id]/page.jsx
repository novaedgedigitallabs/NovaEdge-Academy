"use client";

import { useParams, useRouter } from "next/navigation";
import TicketDetail from "@/components/support/TicketDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TicketPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    return (
        <div className="container mx-auto py-8">
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:pl-2 transition-all"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Support
            </Button>

            <TicketDetail ticketId={id} />
        </div>
    );
}
