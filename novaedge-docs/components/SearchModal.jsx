"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DOCS_ARTICLES } from "@/lib/docsData";
import { Search, X, BookOpen, ArrowRight, CornerDownLeft } from "lucide-react";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  // Listen for Cmd + K or Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search
          const btn = document.querySelector('button[aria-label="Search documentation"]');
          if (btn) btn.click();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Live filter
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const matched = Object.entries(DOCS_ARTICLES)
      .map(([slug, data]) => ({
        slug,
        ...data,
      }))
      .filter(
        (article) =>
          article.title.toLowerCase().includes(q) ||
          article.description?.toLowerCase().includes(q) ||
          article.sections?.some(
            (s) =>
              s.title.toLowerCase().includes(q) ||
              s.content?.toLowerCase().includes(q)
          )
      );

    setResults(matched);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#0b0e17] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 gap-3">
          <Search className="w-4 h-4 text-primary shrink-0" />
          <input
            type="text"
            placeholder="Type to search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5 custom-scrollbar">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.slug}
                onClick={() => {
                  router.push(`/${item.slug}`);
                  onClose();
                }}
                className="p-3 hover:bg-primary/10 rounded-xl transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 pl-5">
                    {item.description}
                  </p>
                </div>
                <CornerDownLeft className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            ))
          ) : query.trim() ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No matching documentation found for &quot;{query}&quot;.
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Quick Search</p>
              <p>Type keywords like &quot;Authentication&quot;, &quot;Certificates&quot;, or &quot;CityKit&quot;...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
