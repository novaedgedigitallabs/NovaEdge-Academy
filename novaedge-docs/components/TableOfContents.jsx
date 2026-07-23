"use client";

import { List } from "lucide-react";

export default function TableOfContents({ sections = [] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="hidden xl:block w-56 shrink-0 py-6 px-4 border-l border-white/10 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="space-y-3 text-xs">
        <h4 className="font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 text-[10px]">
          <List className="w-3 h-3 text-primary" /> On This Page
        </h4>
        <nav className="space-y-1.5 border-l border-white/10 pl-2">
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="block text-muted-foreground hover:text-primary transition-colors text-[11px] truncate py-0.5"
            >
              {sec.title}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
