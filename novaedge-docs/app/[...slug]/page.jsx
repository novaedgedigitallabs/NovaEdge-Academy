"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOCS_ARTICLES, DOCS_NAV } from "@/lib/docsData";
import CodeBlock from "@/components/CodeBlock";
import TableOfContents from "@/components/TableOfContents";
import FeedbackWidget from "@/components/FeedbackWidget";
import FormattedContent from "@/components/FormattedContent";
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, Sparkles } from "lucide-react";

export default function DocArticlePage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slugPath = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;

  const article = DOCS_ARTICLES[slugPath];

  if (!article) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <BookOpen className="w-12 h-12 text-primary/40 mx-auto" />
        <h1 className="text-xl font-bold text-foreground">Documentation Article Not Found</h1>
        <p className="text-xs text-muted-foreground">
          The documentation page &quot;{slugPath}&quot; does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-4 py-2 rounded-full text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Docs Home
        </Link>
      </div>
    );
  }

  // Calculate prev and next articles from nav
  const flatNav = DOCS_NAV.flatMap((g) => g.items);
  const currentIndex = flatNav.findIndex((item) => item.href === `/${slugPath}`);
  const prevArticle = currentIndex > 0 ? flatNav[currentIndex - 1] : null;
  const nextArticle = currentIndex < flatNav.length - 1 ? flatNav[currentIndex + 1] : null;

  return (
    <div className="flex w-full gap-8 justify-between">
      {/* Article Core Content */}
      <article className="flex-1 min-w-0 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Docs
          </Link>
          <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-foreground font-medium truncate">{article.title}</span>
        </div>

        {/* Header */}
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {article.title}
            </h1>
            {article.badge && (
              <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {article.badge}
              </span>
            )}
          </div>
          {article.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {article.description}
            </p>
          )}
        </div>

        {/* Article Sections */}
        <div className="space-y-10">
          {article.sections?.map((sec) => (
            <section key={sec.id} id={sec.id} className="space-y-4 scroll-mt-20">
              <h2 className="text-lg font-bold text-foreground border-b border-white/5 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-primary inline-block" />
                {sec.title}
              </h2>

              {sec.content && <FormattedContent content={sec.content} />}

              {sec.code && <CodeBlock code={sec.code} language="javascript" />}
            </section>
          ))}
        </div>

        {/* Feedback */}
        <FeedbackWidget />

        {/* Previous / Next Article Nav */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          {prevArticle ? (
            <Link
              href={prevArticle.href}
              className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/60 border border-white/10 transition-all flex flex-col gap-1 group text-left"
            >
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Previous
              </span>
              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                {prevArticle.title}
              </span>
            </Link>
          ) : <div />}

          {nextArticle ? (
            <Link
              href={nextArticle.href}
              className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/60 border border-white/10 transition-all flex flex-col gap-1 group text-right sm:items-end"
            >
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                Next <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                {nextArticle.title}
              </span>
            </Link>
          ) : <div />}
        </div>
      </article>

      {/* Right Side Table of Contents */}
      <TableOfContents sections={article.sections} />
    </div>
  );
}
