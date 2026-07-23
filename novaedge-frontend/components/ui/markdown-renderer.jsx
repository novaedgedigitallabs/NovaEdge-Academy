"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Terminal, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

function CodeBlock({ children, className }) {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const codeString = String(children).replace(/\n$/, "");

    const handleCopy = () => {
        if (!codeString) return;
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative my-3 rounded-xl overflow-hidden border border-border/60 bg-[#0d1117] text-gray-100 shadow-md">
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#161b22] border-b border-border/40 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 mr-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <Terminal className="w-3.5 h-3.5 text-primary/80" />
                    <span className="font-semibold text-primary/90 uppercase text-[11px] tracking-wider">
                        {language || "code"}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 hover:text-white px-2 py-0.5 rounded transition-colors text-[11px] font-sans bg-white/5 hover:bg-white/10"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy code</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-3.5 overflow-x-auto font-mono text-xs leading-relaxed selection:bg-primary/30">
                <code className="block text-gray-200">{codeString}</code>
            </pre>
        </div>
    );
}

export default function MarkdownRenderer({ content = "", className = "" }) {
    // Replace **NovaEdge AI:** prefix if present
    let cleanedContent = content.replace(/^\*\*NovaEdge AI:\*\*\s*/i, "").trim();

    // Clean up math notations like $O(1)$ or $low = 0$ so they don't look broken
    // Replace $expression$ with inline markdown code `expression` if not inside code block
    cleanedContent = cleanedContent.replace(/(?<!\`)\$([^$\n]+)\$(?!\`)/g, "`$1`");

    return (
        <div className={cn("markdown-content text-sm leading-relaxed text-foreground/90 space-y-2", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }) => (
                        <h1 className="text-lg font-bold text-foreground mt-4 mb-2 pb-1 border-b border-border/40 flex items-center gap-2" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-base font-bold text-foreground mt-3.5 mb-1.5 flex items-center gap-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-sm font-bold text-foreground mt-3 mb-1" {...props} />
                    ),
                    h4: ({ node, ...props }) => (
                        <h4 className="text-xs font-bold text-foreground mt-2 mb-1" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                        <p className="mb-2 last:mb-0 leading-relaxed text-foreground/95" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5 my-2 space-y-1 text-foreground/95" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5 my-2 space-y-1 text-foreground/95" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="leading-relaxed" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-primary/70 bg-primary/10 pl-3.5 py-2 my-2.5 rounded-r-lg text-muted-foreground italic text-xs" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                        <a
                            className="text-primary underline font-medium hover:opacity-80 inline-flex items-center gap-0.5"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        >
                            {props.children}
                            <ExternalLink className="w-3 h-3 inline" />
                        </a>
                    ),
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-3 rounded-lg border border-border">
                            <table className="w-full text-xs text-left border-collapse" {...props} />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead className="bg-muted/80 text-foreground font-semibold border-b border-border" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                        <tr className="border-b border-border/50 last:border-0 hover:bg-muted/30" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                        <th className="p-2.5 font-semibold" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="p-2.5" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                        <strong className="font-bold text-foreground" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                        <em className="italic text-foreground/90" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                        const isBlock = !inline && (className || String(children).includes("\n"));
                        if (isBlock) {
                            return <CodeBlock className={className}>{children}</CodeBlock>;
                        }
                        return (
                            <code
                                className="bg-primary/15 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-mono text-xs font-semibold inline-block my-0.5"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children }) => <>{children}</>,
                }}
            >
                {cleanedContent}
            </ReactMarkdown>
        </div>
    );
}
