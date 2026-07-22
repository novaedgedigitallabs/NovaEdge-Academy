"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { apiPost } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const data = await apiPost("/api/v1/password/forgot", { email: email.trim() }, { validateStatus: status => status < 500 });

      if (data.success === false) {
        setError(data.message || "Failed to send reset link");
      } else {
        setSuccessMessage(data.message || `Password reset instructions have been sent to ${email}`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "An error occurred while sending reset email");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6 bg-card border border-border p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col space-y-2 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors self-start mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
          <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xl mx-auto mb-2">
            N
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot Password?</h1>
          <p className="text-sm text-muted-foreground">
            Enter your registered email address and we will send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-xl font-medium">
            {error}
          </div>
        )}

        {successMessage ? (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or try again in a few minutes.
            </p>
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => setSuccessMessage(null)}
            >
              Try Another Email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <Button type="submit" className="w-full rounded-xl font-semibold" disabled={isSubmitting || !email.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
