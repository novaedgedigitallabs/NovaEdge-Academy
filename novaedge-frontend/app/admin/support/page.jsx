import AgentDashboard from "@/components/support/AgentDashboard";
import TicketList from "@/components/support/TicketList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SupportPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Support Dashboard</h1>
            </div>

            <Tabs defaultValue="tickets" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="tickets">All Tickets</TabsTrigger>
                    <TabsTrigger value="dashboard">My Dashboard</TabsTrigger>
                </TabsList>

                <TabsContent value="tickets" className="space-y-6">
                    <TicketList />
                </TabsContent>

                <TabsContent value="dashboard" className="space-y-6">
                    <AgentDashboard />
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">My Assigned Tickets</h2>
                        {/* We could reuse TicketList here with a filter prop, but for now just showing the main list */}
                        <TicketList />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
