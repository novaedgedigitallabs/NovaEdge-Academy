"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/course/CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${base}/api/v1/courses`, {
          credentials: "include",
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.message || "Failed to load courses");
        }

        const data = await res.json();
        // support shapes: { courses: [...] } or direct array
        const fetched = Array.isArray(data.courses)
          ? data.courses
          : Array.isArray(data)
            ? data
            : data.data && Array.isArray(data.data)
              ? data.data
              : [];

        if (!ignore) setCourses(fetched);
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Something went wrong");
          setCourses([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchCourses();
    return () => {
      ignore = true;
    };
  }, []);

  const featured = courses.slice(0, 8); // show up to 8 featured on the homepage

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-20 lg:py-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6 text-center lg:text-left">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary w-fit mx-auto lg:mx-0">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                  New courses added weekly
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground text-balance">
                  Master the skills of{" "}
                  <span className="text-primary">tomorrow</span>.
                </h1>
                <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto lg:mx-0">
                  Join thousands of developers, designers, and marketers
                  building the future. Get access to world-class courses,
                  real-time mentorship, and a community that cares.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
                  <Link href="/courses" passHref>
                    <Button
                      size="lg"
                      className="rounded-full text-base px-8 h-12"
                    >
                      Explore Courses
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full text-base px-8 h-12 gap-2 bg-transparent"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>
                <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Certified Instructors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Lifetime Access</span>
                  </div>
                </div>
              </div>
              <div className="relative mx-auto lg:ml-auto w-full max-w-lg lg:max-w-none">
                <div className="relative rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-primary/10">
                  <div className="rounded-xl overflow-hidden bg-muted aspect-[4/3] relative">
                    <Image
                      src="/online-learning-platform.jpg"
                      alt="Platform Preview"
                      fill
                      className="object-cover w-full h-full"
                    />

                    {/* Floating UI Elements for decorative purpose */}
                    <div className="absolute -bottom-6 -left-6 bg-card border border-border p-4 rounded-xl shadow-xl max-w-[200px] hidden md:block">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">
                        Course Progress
                      </div>
                      <div className="flex items-end justify-between gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          78%
                        </span>
                        <span className="text-xs text-green-500 mb-1">
                          +12% this week
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-primary w-[78%] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-20 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Featured Courses
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  Explore our highest-rated courses handpicked for you. Start
                  learning today.
                </p>
              </div>
              <Link href="/courses" passHref>
                <Button variant="ghost" className="gap-2 group">
                  View all courses{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {loading && (
              <div className="py-12 text-center text-muted-foreground">
                Loading featured courses...
              </div>
            )}

            {error && (
              <div className="py-8 text-center text-destructive">
                <p className="mb-4">Error loading courses: {error}</p>
                <Button onClick={() => location.reload()}>Retry</Button>
              </div>
            )}

            {!loading && !error && featured.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No featured courses available.
              </div>
            )}

            {!loading && !error && featured.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((course) => {
                  const key =
                    course._id || course.id || course.slug || Math.random();
                  return <CourseCard key={key} course={course} />;
                })}
              </div>
            )}
          </div>
        </section>

        {/* Value Prop Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Expert Instructors</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Learn from industry experts who have worked at top companies
                  and know what it takes to succeed.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-secondary/30 border border-border">
                <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-6 text-secondary-foreground">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Structured Learning</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our learning paths are designed to take you from beginner to
                  master with hands-on projects.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-secondary/30 border border-border">
                <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-6 text-secondary-foreground">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Certificates</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Earn certificates upon completion to showcase your skills to
                  potential employers and network.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
