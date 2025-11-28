"use client";

import { useState } from "react";
import { login2FA } from "@/services/twoFactor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

export default function TwoFactorVerify({ tempToken, onSuccess }) {
    const [code, setCode] = useState("");
    const [isBackup, setIsBackup] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // We might need to manually handle the token set since login context usually takes email/pass

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login2FA(tempToken, code, isBackup);
            // Success!
            // We need to manually set the user/token in context or just reload/redirect
            // Since useAuth.login usually calls the API, here we already have the token.
            // We should probably expose a `setAuth` method or just reload the page if the cookie is set.
            // But `login2FA` sets the cookie. So a reload or `router.push` + `checkAuth` might work.
            // Ideally, pass the token to `onSuccess`.
            onSuccess(res);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-card border rounded-xl shadow-lg">
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Two-Factor Authentication</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    {isBackup ? "Enter one of your backup codes." : "Enter the code from your authenticator app."}
                </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
                <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={isBackup ? "Backup Code" : "000000"}
                    className="text-center text-lg tracking-widest"
                    autoFocus
                />

                <Button type="submit" className="w-full" disabled={loading || !code}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify
                </Button>
            </form>

            <div className="text-center">
                <button
                    type="button"
                    onClick={() => { setIsBackup(!isBackup); setCode(""); }}
                    className="text-sm text-primary hover:underline"
                >
                    {isBackup ? "Use Authenticator App" : "Use Backup Code"}
                </button>
            </div>
        </div>
    );
}
