"use client";

import { useEffect, useState } from "react";
import { getMyReferrals, generateReferralCode } from "@/services/referral";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Users, Wallet } from "lucide-react";
import { toast } from "sonner";

export default function ReferralPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await getMyReferrals();
            setData(res);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        try {
            await generateReferralCode();
            loadData();
        } catch (e) {
            toast.error("Failed to generate code");
        }
    };

    const copyLink = () => {
        if (!data?.referralCode) return;
        const link = `${window.location.origin}/register?ref=${data.referralCode}`;
        navigator.clipboard.writeText(link);
        toast.success("Link copied!");
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-8">Referral Program</h1>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{data?.walletBalance || 0}</div>
                            <p className="text-xs text-muted-foreground">Usable for purchases</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data?.referrals?.length || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-12 p-6 border rounded-lg bg-muted/50">
                    <h2 className="text-xl font-semibold mb-4">Your Referral Link</h2>
                    {data?.referralCode ? (
                        <div className="flex gap-4 items-center">
                            <code className="bg-background p-3 rounded border flex-grow">
                                {typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${data.referralCode}` : data.referralCode}
                            </code>
                            <Button onClick={copyLink} variant="outline">
                                <Copy className="w-4 h-4 mr-2" /> Copy
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleGenerate}>Generate Referral Code</Button>
                    )}
                </div>

                <h2 className="text-xl font-semibold mb-4">Referral History</h2>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Referee</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Reward</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.referrals?.map((ref) => (
                                <TableRow key={ref._id}>
                                    <TableCell>{ref.referee?.name}</TableCell>
                                    <TableCell className="capitalize">{ref.status}</TableCell>
                                    <TableCell>₹{ref.rewardAmount}</TableCell>
                                    <TableCell>{new Date(ref.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                            {data?.referrals?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4">No referrals yet</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
            <Footer />
        </div>
    );
}
