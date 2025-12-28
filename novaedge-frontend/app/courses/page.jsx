"use client";

import AppLayout from "@/components/layout/AppLayout";
import CourseCard from "@/components/course/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Development",
  "Design",
  "Marketing",
  "Business",
  "Photography",
  "Music",
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]); // accumulated list
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("All");

  const debounceTimer = useRef(null);

  // debounce search input
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1); // reset paging on new search
    }, 450);

    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  // whenever debouncedQuery or category or page changes, fetch
  useEffect(() => {
    let ignore = false;
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        // build query params - backend may ignore unknown params; adjust if needed
        const params = new URLSearchParams();
        if (debouncedQuery) params.set("search", debouncedQuery);
        if (category && category !== "All") params.set("category", category);
        params.set("page", page);

        const base = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${base}/api/v1/courses?${params.toString()}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to load courses");
        }

        const data = await res.json();

        // expected shapes:
        // 1) { courses: [...], totalPages: n }
        // 2) [...courses]
        // 3) { data: [...] }
        let fetched = [];
        let totalPages = null;

        if (Array.isArray(data.courses)) {
          fetched = data.courses;
          totalPages = data.totalPages ?? null;
        } else if (Array.isArray(data)) {
          fetched = data;
        } else if (Array.isArray(data.data)) {
          fetched = data.data;
          totalPages = data.totalPages ?? null;
        }

        if (ignore) return;

        if (page === 1) {
          setCourses(fetched);
        } else {
          // append, but avoid duplicates by id
          const existingIds = new Set(courses.map((c) => c._id || c.id));
          const newOnes = fetched.filter(
            (c) => !existingIds.has(c._id || c.id)
          );
          setCourses((prev) => [...prev, ...newOnes]);
        }

        // determine hasMore
        if (totalPages != null) {
          setHasMore(page < totalPages);
        } else {
          // if fetched length is 0 or less than a typical page size, stop
          setHasMore(fetched.length > 0);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Something went wrong");
          setCourses([]);
          setHasMore(false);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchCourses();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, category, page]);

  const onSelectCategory = (cat) => {
    if (cat === category) return;
    setCategory(cat);
    setPage(1);
    setCourses([]);
    setHasMore(true);
  };

  const loadMore = () => {
    if (loading) return;
    setPage((p) => p + 1);
  };

  return (
    <AppLayout className="max-w-5xl">
      <div className="px-4 py-6">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Explore Courses
            </h1>
            <p className="text-muted-foreground">
              Discover new skills with our expert-led courses.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10 rounded-full bg-secondary/50 border-none h-12"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                  setHasMore(true);
                }}
              />
            </div>
            {/* <Button
              variant="outline"
              size="icon"
              title="Filters (not implemented)"
              className="rounded-full h-12 w-12"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button> */}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
          {CATEGORIES.map((cat, i) => (
            <Badge
              key={cat}
              variant={cat === category ? "default" : "secondary"}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap rounded-full"
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* states */}
        {loading && courses.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Loading courses...
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-destructive">
            <p className="mb-4">Error: {error}</p>
            <Button
              onClick={() => {
                setPage(1);
                setDebouncedQuery(query);
              }}
            >
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              Try a different search or category.
            </p>
            <Button
              onClick={() => {
                setQuery("");
                setDebouncedQuery("");
                setCategory("All");
                setPage(1);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* courses grid */}
        {courses.length > 0 && (
          <div className={cn(
            "grid gap-6",
            courses.length === 1 ? "grid-cols-1 max-w-xl mx-auto" :
              courses.length === 2 ? "grid-cols-1 md:grid-cols-2" :
                "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
          )}>
            {courses.map((course) => {
              const key =
                course._id || course.id || course.slug || Math.random();
              return <CourseCard key={key} course={course} />;
            })}
          </div>
        )}

        {/* load more */}
        <div className="mt-16 flex justify-center">
          {loading && courses.length > 0 ? (
            <Button
              variant="ghost"
              size="lg"
              disabled
            >
              Loading...
            </Button>
          ) : hasMore ? (
            <Button
              variant="outline"
              size="lg"
              className="rounded-full min-w-[150px]"
              onClick={loadMore}
            >
              Load More
            </Button>
          ) : (
            <div className="text-muted-foreground">No more courses</div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
