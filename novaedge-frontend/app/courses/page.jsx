"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/course/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState, useRef } from "react";

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Explore Courses
              </h1>
              <p className="text-muted-foreground">
                Discover new skills with our expert-led courses.
              </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    // reset paging & results as user types visually (debounced fetch will update)
                    setPage(1);
                    setHasMore(true);
                  }}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                title="Filters (not implemented)"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-6 mb-2 no-scrollbar">
            {CATEGORIES.map((cat, i) => (
              <Badge
                key={cat}
                variant={cat === category ? "default" : "secondary"}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
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
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                variant="outline"
                size="lg"
                className="min-w-[150px] bg-transparent"
                disabled
              >
                Loading...
              </Button>
            ) : hasMore ? (
              <Button
                variant="outline"
                size="lg"
                className="min-w-[150px] bg-transparent"
                onClick={loadMore}
              >
                Load More
              </Button>
            ) : (
              <div className="text-muted-foreground">No more courses</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
