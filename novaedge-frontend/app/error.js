"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // If error is due to chunk load failure after new Vercel deployment, auto reload once
    if (error?.name === "ChunkLoadError" || error?.message?.includes("Loading chunk")) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
        Something went wrong!
      </h2>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        An unexpected error occurred while loading this page. This can happen during live updates.
      </p>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => (reset ? reset() : window.location.reload())}
          className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-md cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          Reload Page
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="rounded-full px-6 font-semibold cursor-pointer"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
