"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { globalSearch } from "@/services/search";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, BookOpen, User, FileText, Search, X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryParam = searchParams?.get ? searchParams.get("q") || "" : "";
    
    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");

    // Sync queryParam state when URL queryParam changes
    useEffect(() => {
        setSearchQuery(queryParam);
    }, [queryParam]);

    // Perform global search
    useEffect(() => {
        if (queryParam.trim()) {
            setLoading(true);
            globalSearch(queryParam.trim(), filter === "all" ? null : filter)
                .then((res) => {
                    setResults(res.data || []);
                })
                .catch(() => setResults([]))
                .finally(() => setLoading(false));
        } else {
            setResults([]);
            setLoading(false);
        }
    }, [queryParam, filter]);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearchSubmit();
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "course": return <BookOpen className="w-3.5 h-3.5" />;
            case "mentor": return <User className="w-3.5 h-3.5" />;
            case "user": return <User className="w-3.5 h-3.5" />;
            case "blog": return <FileText className="w-3.5 h-3.5" />;
            default: return <BookOpen className="w-3.5 h-3.5" />;
        }
    };

    const getLink = (item) => {
        switch (item.type) {
            case "course": return `/courses/${item.slug || item._id}`;
            case "mentor": return `/mentors`;
            case "user": return `/user/${item._id}`;
            case "blog": return `/blog/${item.slug || item._id}`;
            default: return "#";
        }
    };

    return (
        <AppLayout className="w-full">
            <div className="px-4 py-6 space-y-6">
                {/* Search Bar Input */}
                <div className="relative">
                    <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                        <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search courses, mentors, blogs, users..."
                            className="rounded-full bg-secondary/50 border border-border/60 pl-12 pr-32 h-13 text-base focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="absolute right-24 text-muted-foreground hover:text-foreground transition-colors p-1"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                        <Button 
                            type="submit" 
                            className="absolute right-1.5 rounded-full px-5 h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md"
                        >
                            Search
                        </Button>
                    </form>
                </div>

                {/* Search Query Header & Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            {queryParam.trim() ? (
                                <>
                                    Search Results for <span className="text-primary">&quot;{queryParam}&quot;</span>
                                </>
                            ) : (
                                "Explore & Search NovaEdge"
                            )}
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {loading 
                                ? "Searching across the platform..." 
                                : `${results.length} ${results.length === 1 ? 'result' : 'results'} found`}
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {["all", "course", "blog", "mentor", "user"].map((f) => (
                            <Button
                                key={f}
                                size="sm"
                                variant={filter === f ? "default" : "outline"}
                                onClick={() => setFilter(f)}
                                className={`capitalize rounded-full text-xs h-8 px-3.5 font-semibold transition-all ${
                                    filter === f 
                                        ? "bg-primary text-primary-foreground shadow-sm" 
                                        : "border-border/60 hover:bg-secondary/60"
                                }`}
                            >
                                {f}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Results Section */}
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-16 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl my-4 px-6">
                        <div className="h-16 w-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold tracking-tight text-foreground mb-2">
                            {queryParam.trim() ? `No results found for "${queryParam}"` : "Search for anything on NovaEdge"}
                        </h3>
                        <p className="text-muted-foreground text-xs max-w-md mx-auto mb-6">
                            Try searching for popular topics like <strong className="text-foreground">React</strong>, <strong className="text-foreground">Next.js</strong>, <strong className="text-foreground">Design</strong>, or mentor names.
                        </p>

                        {/* Popular Quick Tags */}
                        <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                            {["React", "Web Development", "Python", "UI/UX", "Next.js"].map((tag) => (
                                <Button
                                    key={tag}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSearchQuery(tag);
                                        router.push(`/search?q=${encodeURIComponent(tag)}`);
                                    }}
                                    className="rounded-full text-xs border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-colors"
                                >
                                    <Sparkles className="w-3 h-3 mr-1 text-primary" />
                                    {tag}
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {results.map((item, idx) => (
                            <Link key={idx} href={getLink(item)} className="block group">
                                <Card className="h-full hover:border-primary/50 transition-all duration-200 border-border/60 bg-card/40 backdrop-blur-md overflow-hidden flex flex-col hover:-translate-y-0.5 shadow-md">
                                    {item.image || item.poster?.url || item.avatar?.url ? (
                                        <div className="aspect-video w-full overflow-hidden bg-muted relative border-b border-border/40">
                                            <img
                                                src={item.image || item.poster?.url || item.avatar?.url}
                                                alt={item.title || item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    ) : null}
                                    <CardHeader className="pb-2 flex-grow-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="secondary" className="flex items-center gap-1 uppercase text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary/80 border border-border/50">
                                                {getIcon(item.type)} {item.type}
                                            </Badge>
                                        </div>
                                        <CardTitle className="line-clamp-2 text-base font-bold group-hover:text-primary transition-colors text-foreground">
                                            {item.title || item.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow pt-0 pb-4">
                                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                            {item.description || item.bio || (item.username ? `@${item.username}` : "") || item.content?.substring(0, 150)}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
