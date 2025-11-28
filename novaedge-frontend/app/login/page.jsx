// app/login/page.jsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import TwoFactorVerify from "@/components/auth/TwoFactorVerify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const [error, setError] = useState(null);
  const [show2FA, setShow2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await login(email.trim(), password);
    if (!result.ok) {
      setError(result.message || "Login failed");
    } else if (result.require2fa) {
      setTempToken(result.tempToken);
      setShow2FA(true);
    }
    // on success (no 2fa), auth-context redirects user
  };

  const handle2FASuccess = () => {
    // Force reload to pick up the new cookie and update auth context
    window.location.href = "/courses";
  };

  if (show2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <TwoFactorVerify tempToken={tempToken} onSuccess={handle2FASuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 justify-center mb-4"
            >
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                L
              </div>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>
              <Link
                href="#"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign In
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              type="button"
            >
              Sign In with Google
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:block bg-muted relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md space-y-8 text-center relative z-10">
            <h2 className="text-3xl font-bold text-foreground">
              &quot;This platform completely transformed the way I learn. The courses
              are structured perfectly.&quot;
            </h2>
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-white border border-border overflow-hidden relative">
                <Image
                  src="/diverse-avatars.png"
                  alt="User"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-sm font-medium">Alex Johnson</div>
              <div className="text-xs text-muted-foreground">
                Frontend Developer
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10"></div>
        </div>
      </div>
    </div>
  );
}
