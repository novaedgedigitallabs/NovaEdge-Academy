"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/Course/CourseCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export default function EnrollmentsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]); // array of course objects
  const [error, setError] = useState(null);

  // redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // fetch enrolled courses when user is present
  useEffect(() => {
    if (!user) return;

    const fetchEnrollments = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/enrollments/me`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push("/login");
            return;
          }
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to load enrollments");
        }

        const data = await res.json();

        // Support multiple shapes
        let fetchedCourses = [];
        if (Array.isArray(data.courses)) {
          fetchedCourses = data.courses;
        } else if (Array.isArray(data.enrollments)) {
          fetchedCourses = data.enrollments.map((e) => e.course || e);
        } else if (Array.isArray(data)) {
          fetchedCourses = data;
        } else if (Array.isArray(data?.enrolledCourses)) {
          fetchedCourses = data.enrolledCourses;
        }

        setCourses(fetchedCourses);
      } catch (err) {
        setError(err.message || "Something went wrong");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user, router]);

  // hide until auth resolved / redirect runs
  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              My Enrollments
            </h1>
            <p className="text-muted-foreground">
              Continue learning where you left off.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/courses">Browse More Courses</Link>
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground">
            Loading your courses...
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-8 text-destructive">
            <p className="mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Courses grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const key =
                course._id || course.id || course.slug || Math.random();
              return <CourseCard key={key} course={course} />;
            })}
          </div>
        )}

        {/* Empty state */}
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
            <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              You haven't enrolled in any courses yet. Explore our catalog to
              start learning.
            </p>
            <Button asChild>
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
