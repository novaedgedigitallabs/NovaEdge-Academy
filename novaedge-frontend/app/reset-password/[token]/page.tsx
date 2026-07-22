"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Lock } from "lucide-react";
import { apiPost } from "@/lib/api";

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params?.token as string;
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || isSubmitting || !token) return;

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const data = await apiPost(
        `/api/v1/password/reset/${token}`,
        { password },
        { validateStatus: (status) => status < 500 }
      );

      if (data.success === false) {
        setError(data.message || "Failed to reset password");
      } else {
        if (data.token && typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
        }
        setSuccess(true);
        setTimeout(() => {
          router.push("/courses");
        }, 2000);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "An error occurred while resetting your password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6 bg-card border border-border p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col space-y-2 text-center">
          <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Set New Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Please enter your new password below.
          </p>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center py-4">
            <div className="flex flex-col items-center justify-center gap-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl text-sm font-medium">
              <CheckCircle2 className="w-8 h-8" />
              <span className="font-bold text-base text-foreground">
                Password Reset Successfully!
              </span>
              <span className="text-xs text-muted-foreground">
                Redirecting you to dashboard...
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl font-semibold"
              disabled={isSubmitting || !password || !confirmPassword}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
          Back to{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
