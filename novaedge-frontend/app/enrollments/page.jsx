"use client";

import AppLayout from "@/components/layout/AppLayout";
import CourseCard from "@/components/course/CourseCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

export default function EnrollmentsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
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

  if (authLoading || !user) return null;

  return (
    <AppLayout className="w-full">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              My Learning
            </h1>
            <p className="text-sm text-muted-foreground">
              Continue learning where you left off.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full px-5 h-10 text-xs font-semibold border-border/60 hover:bg-secondary">
            <Link href="/courses">Browse More Courses</Link>
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-muted-foreground">
            Loading your courses...
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-12 text-destructive">
            <p className="mb-4 text-sm font-semibold">Error: {error}</p>
            <Button className="rounded-full px-6" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {/* Courses grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => {
              const key =
                course._id || course.id || course.slug || Math.random();
              return <CourseCard key={key} course={course} />;
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl my-6">
            <div className="h-16 w-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">No courses yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              You haven&apos;t enrolled in any courses yet. Explore our catalog to start learning.
            </p>
            <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20">
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
