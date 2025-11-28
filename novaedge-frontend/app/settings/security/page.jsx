"use client";

import { useState, useEffect } from "react";
import TwoFactorSetup from "@/components/auth/TwoFactorSetup";
import { get2FAStatus, disable2FA } from "@/services/twoFactor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function SecuritySettingsPage() {
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showSetup, setShowSetup] = useState(false);
    const [disablePassword, setDisablePassword] = useState("");
    const [disableCode, setDisableCode] = useState("");

    useEffect(() => {
        get2FAStatus()
            .then((res) => setEnabled(res.enabled))
            .finally(() => setLoading(false));
    }, []);

    const handleDisable = async () => {
        try {
            await disable2FA(disablePassword, disableCode);
            setEnabled(false);
            setDisablePassword("");
            setDisableCode("");
            toast.success("2FA Disabled");
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Security Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {enabled ? <ShieldCheck className="text-green-500" /> : <ShieldAlert className="text-yellow-500" />}
                        Two-Factor Authentication (2FA)
                    </CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account by requiring a code from your authenticator app.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {enabled ? (
                        <div className="space-y-4">
                            <div className="bg-green-500/10 text-green-500 p-4 rounded-lg border border-green-500/20">
                                2FA is currently <strong>ENABLED</strong>.
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-semibold mb-2 text-destructive">Disable 2FA</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    To disable 2FA, please enter your password and a current 2FA code.
                                </p>
                                <div className="flex gap-2 max-w-md">
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={disablePassword}
                                        onChange={e => setDisablePassword(e.target.value)}
                                    />
                                    <Input
                                        placeholder="2FA Code"
                                        value={disableCode}
                                        onChange={e => setDisableCode(e.target.value)}
                                        className="w-32"
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    className="mt-2"
                                    onClick={handleDisable}
                                    disabled={!disablePassword || !disableCode}
                                >
                                    Disable 2FA
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {!showSetup ? (
                                <Button onClick={() => setShowSetup(true)}>Set up 2FA</Button>
                            ) : (
                                <TwoFactorSetup onComplete={() => { setEnabled(true); setShowSetup(false); }} />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
