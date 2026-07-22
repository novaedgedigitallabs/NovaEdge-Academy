"use client";

import { useAuth } from "@/context/auth-context";
import { Suspense } from "react";
import { RegisterForm } from "@/app/register/page";
import Feed from "@/components/home/Feed";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    );
  }

  return <Feed />;
}
