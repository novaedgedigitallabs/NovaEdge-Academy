"use client";

import { useState } from "react";
import { enroll2FA, verify2FA } from "@/services/twoFactor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle, Copy } from "lucide-react";
import { toast } from "sonner";

export default function TwoFactorSetup({ onComplete }) {
    const [step, setStep] = useState("start"); // start, scan, verify, success
    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [code, setCode] = useState("");
    const [backupCodes, setBackupCodes] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        setLoading(true);
        try {
            const res = await enroll2FA();
            setQrCode(res.qrCode);
            setSecret(res.secret);
            setStep("scan");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            const res = await verify2FA(code);
            setBackupCodes(res.backupCodes);
            setStep("success");
            toast.success("2FA Enabled Successfully!");
            if (onComplete) onComplete();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (step === "start") {
        return (
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Protect your account with Two-Factor Authentication (2FA). You will need an authenticator app like Google Authenticator or Authy.
                </p>
                <Button onClick={handleStart} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enable 2FA
                </Button>
            </div>
        );
    }

    if (step === "scan") {
        return (
            <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <img src={qrCode} alt="2FA QR Code" className="border p-2 rounded bg-white" />
                    <div className="text-center">
                        <p className="text-sm font-medium">Scan this QR code with your authenticator app</p>
                        <p className="text-xs text-muted-foreground mt-2">Or enter this code manually:</p>
                        <code className="bg-muted px-2 py-1 rounded text-xs mt-1 block select-all">{secret}</code>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Enter Verification Code</label>
                    <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="text-center tracking-widest text-lg"
                    />
                </div>

                <Button onClick={handleVerify} disabled={loading || code.length !== 6} className="w-full">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify & Enable
                </Button>
            </div>
        );
    }

    if (step === "success") {
        return (
            <div className="space-y-6">
                <div className="flex flex-col items-center text-green-500">
                    <CheckCircle className="w-12 h-12 mb-2" />
                    <h3 className="font-bold text-lg">2FA Enabled!</h3>
                </div>

                <div className="bg-muted p-4 rounded-lg border border-yellow-500/20">
                    <h4 className="font-semibold text-yellow-500 mb-2 text-sm">Save your Backup Codes</h4>
                    <p className="text-xs text-muted-foreground mb-4">
                        If you lose access to your authenticator app, use these codes to log in. Each code can only be used once.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {backupCodes.map((bc, i) => (
                            <code key={i} className="bg-background px-2 py-1 rounded text-xs font-mono border text-center">{bc}</code>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigator.clipboard.writeText(backupCodes.join("\n"))}>
                        <Copy className="w-3 h-3 mr-2" /> Copy All
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}
