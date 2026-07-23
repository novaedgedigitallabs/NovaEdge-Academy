"use client";

import "./globals.css";
import { useState } from "react";
import DocsNavbar from "@/components/DocsNavbar";
import DocsSidebar from "@/components/DocsSidebar";

export default function RootLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <head>
        <title>NovaEdge Academy Documentation | doc.novaedgeacademy.in</title>
        <meta
          name="description"
          content="Official documentation for NovaEdge Academy platform, API reference, certificates, and developer SDKs."
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0b0e17] text-slate-100 antialiased">
        {/* Top Navbar */}
        <DocsNavbar
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        {/* Main Body Grid */}
        <div className="flex-1 flex w-full max-w-7xl mx-auto">
          <DocsSidebar
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          <main className="flex-1 min-w-0 px-4 sm:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
