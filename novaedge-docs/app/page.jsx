"use client";

import Link from "next/link";
import {
  BookOpen,
  Terminal,
  Award,
  Users,
  MessageSquare,
  Shield,
  Code,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
} from "lucide-react";

const quickCards = [
  {
    icon: BookOpen,
    title: "Platform Overview",
    description: "Learn how NovaEdge Academy connects courses, interactive labs, and certificates.",
    href: "/getting-started/overview",
    badge: "Start Here",
  },
  {
    icon: Terminal,
    title: "Quick Start Guide",
    description: "Create your student profile and enroll in your first course in 2 minutes.",
    href: "/getting-started/quickstart",
    badge: "2 min read",
  },
  {
    icon: Shield,
    title: "Authentication & OAuth 2.0",
    description: "JWT cookie session structure and Google OAuth 2.0 integration.",
    href: "/getting-started/authentication",
    badge: "Security",
  },
  {
    icon: Award,
    title: "Certificates & QR Code",
    description: "Verifiable certificates with embedded QR codes and LinkedIn sharing.",
    href: "/features/certificates",
    badge: "Verification",
  },
  {
    icon: Code,
    title: "REST API Reference",
    description: "Complete API endpoints for Users, Courses, Enrollments, and Verification.",
    href: "/api-reference/authentication",
    badge: "API v1",
  },
  {
    icon: Layers,
    title: "NPM Packages & SDKs",
    description: "Integrate @novaedgedigitallabs/citykit and @novaedgedigitallabs/envkit.",
    href: "/sdks/citykit",
    badge: "NPM",
  },
];

export default function DocsHomePage() {
  return (
    <div className="space-y-12 w-full">
      {/* Hero Header */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/30 to-background border border-primary/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Official Documentation
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            NovaEdge Academy <span className="text-primary">Docs</span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Welcome to the official developer and user documentation for NovaEdge Academy. Explore guides, API endpoints, certification verification, and open-source packages.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/getting-started/overview"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 py-2.5 rounded-full text-xs transition-transform active:scale-95 shadow-lg shadow-primary/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/api-reference/authentication"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold px-5 py-2.5 rounded-full text-xs border border-white/10 transition-colors"
            >
              <Terminal className="w-4 h-4 text-primary" />
              <span>API Reference</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" /> Quick Explore
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group p-5 rounded-2xl bg-card/60 border border-white/10 hover:border-primary/40 hover:bg-secondary/40 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono bg-secondary/80 text-muted-foreground px-2 py-0.5 rounded border border-white/10">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {card.title}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
