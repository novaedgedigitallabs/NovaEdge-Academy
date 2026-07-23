"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/lib/docsData";
import { cn } from "@/lib/utils";
import { BookOpen, Terminal, Sparkles, Code, Cpu } from "lucide-react";

export default function DocsSidebar({ mobileOpen, onCloseMobile }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed top-14 bottom-0 left-0 z-40 w-64 bg-[#0b0e17] border-r border-white/10 overflow-y-auto p-5 transition-transform duration-200 lg:translate-x-0 lg:static lg:w-72 lg:shrink-0 custom-scrollbar",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-6">
          {DOCS_NAV.map((group) => (
            <div key={group.title} className="space-y-2">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2">
                {group.title}
              </h4>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all font-medium",
                        isActive
                          ? "bg-primary/15 text-primary font-bold border-l-2 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                      )}
                    >
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
