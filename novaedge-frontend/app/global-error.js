"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (error?.name === "ChunkLoadError" || error?.message?.includes("Loading chunk")) {
      window.location.reload();
    }
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-black text-primary">NovaEdge</h1>
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            A temporary system error occurred. Please click below to refresh the app.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Refresh Application
          </button>
        </div>
      </body>
    </html>
  );
}
