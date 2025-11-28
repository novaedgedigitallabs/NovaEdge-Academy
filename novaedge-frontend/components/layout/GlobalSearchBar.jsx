"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { getAutocompleteSuggestions } from "@/services/search";

import Link from "next/link";

export default function GlobalSearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Debounce logic manually if hook not available
    const [debouncedQuery, setDebouncedQuery] = useState("");
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        if (debouncedQuery.length > 2) {
            setLoading(true);
            getAutocompleteSuggestions(debouncedQuery)
                .then((res) => {
                    setSuggestions(res.suggestions || []);
                    setIsOpen(true);
                })
                .finally(() => setLoading(false));
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [debouncedQuery]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md hidden md:block">
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search courses, mentors, blogs..."
                    className="w-full pl-9 bg-background/50 border-muted focus:bg-background transition-colors"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 2 && setIsOpen(true)}
                />
            </form>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-card border rounded-md shadow-lg z-50 overflow-hidden">
                    <div className="p-1">
                        {suggestions.map((item, idx) => (
                            <Link
                                key={idx}
                                href={
                                    item.type === "course" ? `/courses/${item.id}` :
                                        item.type === "blog" ? `/blogs/${item.id}` :
                                            item.type === "mentor" ? `/mentors/${item.id}` : "#"
                                }
                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-sm cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="uppercase text-[10px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                    {item.type}
                                </span>
                                <span className="truncate">{item.text}</span>
                            </Link>
                        ))}
                        <div
                            className="border-t mt-1 pt-1 px-3 py-2 text-xs text-center text-primary cursor-pointer hover:underline"
                            onClick={handleSearch}
                        >
                            View all results for "{query}"
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
