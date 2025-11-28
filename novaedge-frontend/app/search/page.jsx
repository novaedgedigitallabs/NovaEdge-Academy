"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { globalSearch } from "@/services/search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, User, FileText } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, course, blog, mentor

    useEffect(() => {
        if (q) {
            setLoading(true);
            globalSearch(q, filter === "all" ? null : filter)
                .then((res) => {
                    setResults(res.data || []);
                })
                .finally(() => setLoading(false));
        }
    }, [q, filter]);

    const getIcon = (type) => {
        switch (type) {
            case "course": return <BookOpen className="w-4 h-4" />;
            case "mentor": return <User className="w-4 h-4" />;
            case "blog": return <FileText className="w-4 h-4" />;
            default: return <BookOpen className="w-4 h-4" />;
        }
    };

    const getLink = (item) => {
        switch (item.type) {
            case "course": return `/courses/${item.slug || item._id}`; // Fallback if slug missing
            case "mentor": return `/mentors/${item._id}`;
            case "blog": return `/blogs/${item.slug || item._id}`;
            default: return "#";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">
                Search Results for <span className="text-primary">"{q}"</span>
            </h1>

            {/* Filters */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {["all", "course", "blog", "mentor"].map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? "default" : "outline"}
                        onClick={() => setFilter(f)}
                        className="capitalize"
                    >
                        {f}
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : results.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No results found. Try a different query.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {results.map((item, idx) => (
                        <Link key={idx} href={getLink(item)} className="block group">
                            <Card className="h-full hover:border-primary transition-colors overflow-hidden">
                                {item.image || item.poster?.url ? (
                                    <div className="aspect-video w-full overflow-hidden bg-muted">
                                        <img
                                            src={item.image || item.poster?.url}
                                            alt={item.title || item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ) : null}
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="secondary" className="flex items-center gap-1 uppercase text-[10px]">
                                            {getIcon(item.type)} {item.type}
                                        </Badge>
                                        {item.score && <span className="text-xs text-muted-foreground">Relevance: {item.score.toFixed(1)}</span>}
                                    </div>
                                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                                        {item.title || item.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {item.description || item.bio || item.content?.substring(0, 150)}...
                                    </p>
                                    {item.skills && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {item.skills.split(",").slice(0, 3).map((s, i) => (
                                                <span key={i} className="text-xs bg-muted px-1.5 py-0.5 rounded">{s.trim()}</span>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
