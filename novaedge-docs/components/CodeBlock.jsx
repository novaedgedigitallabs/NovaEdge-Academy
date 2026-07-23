"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

export default function CodeBlock({ code, language = "bash" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-white/10 bg-[#070910] shadow-xl">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/30 border-b border-white/10 text-xs text-muted-foreground font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="uppercase text-[10px] font-bold tracking-wider">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors px-2 py-1 rounded bg-secondary/50 hover:bg-secondary border border-white/10 text-[11px] cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Snippet Content */}
      <div className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed custom-scrollbar">
        <pre className="whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
