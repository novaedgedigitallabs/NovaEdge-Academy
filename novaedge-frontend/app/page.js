"use client";

import { useAuth } from "@/context/auth-context";
import LandingPage from "@/components/home/LandingPage";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import Feed from "@/components/home/Feed";
import { Loader2 } from "lucide-react";

import MobileNav from "@/components/layout/MobileNav";

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
    return <LandingPage />;
  }

  return (
    <div className="flex min-h-screen justify-center bg-background text-foreground">
      <LeftSidebar />
      <Feed />
      <RightSidebar />
      <MobileNav />
    </div>
  );
}
