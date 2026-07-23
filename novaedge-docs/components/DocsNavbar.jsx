"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, ExternalLink, Github, Menu, Command } from "lucide-react";
import SearchModal from "@/components/SearchModal";

export default function DocsNavbar({ onToggleMobileSidebar }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b0e17]/90 backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 shrink-0"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Image
              src="/Header_logo.webp"
              alt="NovaEdge Academy Docs"
              width={130}
              height={30}
              className="h-auto sm:h-7 w-auto object-contain"
              priority
            />
            <span className="bg-primary/20 text-primary text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-primary/30 shrink-0">
              Docs
            </span>
          </Link>

          <span className="hidden md:inline-block text-xs font-mono text-muted-foreground/60 border-l border-white/10 pl-3 shrink-0">
            v1.0.0
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Button for Mobile (< sm) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 rounded-full bg-secondary/40 border border-white/10 text-primary hover:bg-secondary/70 transition-all cursor-pointer"
            aria-label="Search documentation"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Search Bar for Tablet & Desktop (>= sm) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search documentation"
            className="hidden sm:flex items-center gap-3 bg-secondary/40 hover:bg-secondary/70 border border-white/10 px-3.5 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground transition-all w-44 md:w-60 lg:w-72 justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">Search documentation...</span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] bg-secondary/80 px-1.5 py-0.5 rounded border border-white/10 text-muted-foreground font-mono shrink-0">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* Platform Link */}
          <a
            href="https://novaedgeacademy.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1 shrink-0"
          >
            <span>Platform</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* GitHub Repo */}
          <a
            href="https://github.com/novaedgedigitallabs/NovaEdge-Academy"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors shrink-0"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
