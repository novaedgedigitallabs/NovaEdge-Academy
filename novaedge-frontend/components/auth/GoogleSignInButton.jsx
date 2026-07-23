"use client";

import { useEffect, useState } from "react";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "623850477444-prom61v6an0f1fffing6oo0p5ppjm588.apps.googleusercontent.com";

export default function GoogleSignInButton({ text = "Continue with Google", className = "" }) {
  const [loading, setLoading] = useState(false);
  const [gsiLoaded, setGsiLoaded] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script if not already present
    if (typeof window !== "undefined" && !window.google?.accounts) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleGsi();
      };
      document.head.appendChild(script);
    } else if (typeof window !== "undefined" && window.google?.accounts) {
      initGoogleGsi();
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      toast.error("Google authentication was cancelled.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await apiPost("/api/v1/google-login", {
        credential: response.credential,
      });

      if (res && res.success) {
        toast.success("Successfully logged in with Google!");
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      } else {
        toast.error(res?.message || "Google authentication failed");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      toast.error("Failed to authenticate with Google.");
    } finally {
      setLoading(false);
    }
  };

  const initGoogleGsi = () => {
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        setGsiLoaded(true);
      } catch (e) {
        console.error("Google GSI Init Error:", e);
      }
    }
  };

  const handleGoogleClick = () => {
    if (loading) return;

    setLoading(true);
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      try {
        // Trigger One Tap or Account Selector Prompt
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback: render hidden button and click it or show error
            const div = document.getElementById("google-hidden-btn-container");
            if (div) {
              window.google.accounts.id.renderButton(div, {
                type: "standard",
                theme: "outline",
                size: "large",
              });
              const btn = div.querySelector('div[role="button"]');
              if (btn) btn.click();
            }
          }
          setLoading(false);
        });
      } catch (e) {
        setLoading(false);
        toast.error("Could not load Google Sign-In prompt. Please refresh.");
      }
    } else {
      setLoading(false);
      toast.error("Google Sign-In is initializing. Please try again in a moment.");
    }
  };

  return (
    <>
      {/* Hidden container for Google fallback button */}
      <div id="google-hidden-btn-container" className="hidden" />

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleClick}
        disabled={loading}
        className={`w-full bg-background hover:bg-secondary/60 text-foreground border-border font-medium h-11 rounded-xl flex items-center justify-center gap-3 shadow-xs transition-colors cursor-pointer ${className}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        ) : (
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{text}</span>
      </Button>
    </>
  );
}
