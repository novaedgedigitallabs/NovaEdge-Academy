"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Play, Star, Globe, Clock, Award, BarChart, Lock, Unlock, BookOpen, Users, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { apiGet, apiPost } from "@/lib/api";
import { getCourseProgress } from "@/services/progress";
import { useAuth } from "@/context/auth-context";
import CourseProgressBar from "@/components/course/CourseProgressBar";
import ReviewList from "@/components/review/ReviewList";
import LiveSchedule from "@/components/live/LiveSchedule";
import { formatCurrency } from "@/lib/currency";

/**
 * Normalize various shapes of image data to a usable string.
 */
function normalizeImageSrc(maybe) {
  if (!maybe) return "";
  if (typeof maybe === "string") return maybe;
  if (typeof maybe === "object") {
    if (maybe.url) return String(maybe.url);
    if (maybe.secure_url) return String(maybe.secure_url);
    if (maybe.src) return String(maybe.src);
    if (maybe.data && typeof maybe.data === "object") {
      return (
        String(
          maybe.data.url || maybe.data.secure_url || maybe.data.src || ""
        ) || ""
      );
    }
  }
  return "";
}

export default function CourseDetailPageClient() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Enrollment & Playback
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [fullLectures, setFullLectures] = useState([]);
  const [progress, setProgress] = useState(null);
  const [generatingCert, setGeneratingCert] = useState(false);

  // 1. Fetch Public Course Details
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await apiGet(`/api/v1/course/${id}`);
        setCourse(data.course || data);
      } catch (e) {
        setErr(e.message || "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // 2. Check Enrollment (if logged in)
  useEffect(() => {
    if (!id || !user || authLoading) return;

    const check = async () => {
      try {
        const data = await apiGet(`/api/v1/enrollment/check/${id}`);
        setIsEnrolled(!!data.accessGranted);
      } catch (e) {
        console.error("Enrollment check failed", e);
        setIsEnrolled(false);
      }
    };
    check();
  }, [id, user, authLoading]);

  // 3. Fetch Full Lectures (if enrolled)
  useEffect(() => {
    if (!id || !isEnrolled) return;

    const fetchLectures = async () => {
      try {
        const data = await apiGet(`/api/v1/course/${id}/lectures`);
        setFullLectures(data.lectures || []);

        // Fetch Progress
        const progressData = await getCourseProgress(id);
        setProgress(progressData.progress);
      } catch (e) {
        console.error("Failed to fetch lectures", e);
      }
    };
    fetchLectures();
  }, [id, isEnrolled]);

  const handleGetCertificate = async () => {
    setGeneratingCert(true);
    try {
      const res = await apiPost(`/api/v1/certificate/generate/${courseId}`);
      if (res.success && res.certificate) {
        router.push(`/certificate/${res.certificate.certificateId}`);
      } else {
        alert(res.message || "Failed to generate certificate");
      }
    } catch (e) {
      alert(e.message || "Error generating certificate");
    } finally {
      setGeneratingCert(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (err || !course) {
    return (
      <div className="w-full container mx-auto py-20 text-center px-4">
        <h2 className="text-2xl font-bold">Course not found</h2>
        <p className="text-muted-foreground mt-2">
          {err || "We couldn't find the course."}
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link
            href="/courses"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Browse Courses
          </Link>
          <Link href="/" className="px-4 py-2 border rounded-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const courseId = course._id || course.id || "";
  const posterRaw = course?.poster || course?.image || "";
  const posterSrc = normalizeImageSrc(posterRaw);

  const displayLectures = isEnrolled && fullLectures.length > 0 ? fullLectures : (course.lectures || []);

  return (
    <div className="w-full flex-grow">
      {/* Hero Banner - Course Poster + Title */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        {posterSrc && (
          <div className="absolute inset-0 opacity-10">
            <Image
              src={posterSrc}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="relative container mx-auto max-w-6xl px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">

            {/* Poster - visible on mobile too */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src={posterSrc || "/placeholder.svg"}
                  alt={String(course?.title || courseId || "Course thumbnail")}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight break-words">
                {course.title}
              </h1>
              <p className="text-slate-300 mt-3 text-sm md:text-base leading-relaxed break-words line-clamp-3 md:line-clamp-none">
                {course.description}
              </p>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-3 mt-4 text-sm">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5" /> {course.duration || "—"}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <BarChart className="w-3.5 h-3.5" /> {course.level || "Beginner"}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <BookOpen className="w-3.5 h-3.5" /> {displayLectures.length} Lectures
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <Globe className="w-3.5 h-3.5" /> English
                </span>
              </div>

              {/* Mobile CTA */}
              <div className="mt-5 md:hidden">
                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 p-3 rounded-lg text-center font-semibold text-sm">
                      ✓ You are enrolled!
                    </div>
                    <CourseProgressBar percentComplete={progress?.percentComplete || 0} />
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">
                      {formatCurrency(course.price)}
                    </span>
                    <Link href={`/checkout?courseId=${courseId}`} className="flex-1">
                      <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                        Enroll Now
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT - Content */}
          <div className="flex-1 min-w-0 space-y-8">

            {/* What you'll learn */}
            <div className="border rounded-xl p-5 bg-card">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                What you&apos;ll learn
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(
                  course.outcomes || [
                    "Master core concepts and build real apps.",
                    "Deploy applications to production.",
                  ]
                ).map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Index */}
            <div>
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Course Index
                <span className="text-sm font-normal text-muted-foreground">
                  ({displayLectures.length} lectures)
                </span>
              </h3>

              <div className="border rounded-xl overflow-hidden divide-y">
                {displayLectures.map((lec, idx) => {
                  const isLocked = !isEnrolled;

                  return (
                    <div
                      key={lec._id || lec.id || idx}
                      className={`
                        flex items-center gap-3 px-4 py-3 transition-colors
                        ${isEnrolled ? "cursor-pointer hover:bg-muted/50" : ""}
                      `}
                      onClick={() => {
                        if (isEnrolled) {
                          router.push(`/courses/${courseId}/lecture/${lec._id || lec.id}`);
                        }
                      }}
                    >
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                        {idx + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium break-words leading-snug">
                          {lec.title}
                        </p>
                        {lec.duration > 0 && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {lec.duration} min
                          </p>
                        )}
                      </div>

                      <span className="flex-shrink-0">
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-muted-foreground/50" />
                        ) : (
                          <Play className="w-4 h-4 text-primary fill-primary" />
                        )}
                      </span>
                    </div>
                  );
                })}
                {displayLectures.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No lectures available yet.
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <ReviewList courseId={courseId} />
            </div>

            {/* Live Schedule */}
            <div>
              <LiveSchedule courseId={courseId} isEnrolled={isEnrolled} />
            </div>
          </div>

          {/* RIGHT SIDEBAR - Desktop only sticky card */}
          <aside className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-20 border rounded-xl p-5 bg-card shadow-sm space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={posterSrc || "/placeholder.svg"}
                  alt={String(course?.title || courseId || "Course thumbnail")}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Price or Progress */}
              {!isEnrolled && (
                <div className="text-3xl font-bold">
                  {formatCurrency(course.price)}
                </div>
              )}

              {isEnrolled ? (
                <div className="space-y-3">
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-center font-semibold text-sm border border-emerald-500/20">
                    ✓ You are enrolled!
                  </div>

                  <CourseProgressBar percentComplete={progress?.percentComplete || 0} />

                  {progress?.percentComplete === 100 ? (
                    <button
                      onClick={handleGetCertificate}
                      disabled={generatingCert}
                      className="w-full bg-yellow-500 text-black font-bold py-2.5 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                    >
                      {generatingCert ? "Generating..." : (
                        <>
                          <Award className="w-4 h-4" /> Get Certificate
                        </>
                      )}
                    </button>
                  ) : (
                    displayLectures.length > 0 && (
                      <button
                        onClick={() => router.push(`/courses/${courseId}/lecture/${displayLectures[0]._id || displayLectures[0].id}`)}
                        className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                      >
                        {progress?.percentComplete > 0 ? "Continue Watching" : "Start Watching"}
                      </button>
                    )
                  )}
                </div>
              ) : (
                <Link href={`/checkout?courseId=${courseId}`}>
                  <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Enroll Now
                  </button>
                </Link>
              )}

              <div className="text-sm space-y-2.5 pt-2 border-t">
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" /> Duration
                  </span>
                  <span className="font-medium">{course.duration || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <BarChart className="w-4 h-4" /> Level
                  </span>
                  <span className="font-medium">{course.level || "Beginner"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" /> Language
                  </span>
                  <span className="font-medium">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="w-4 h-4" /> Lectures
                  </span>
                  <span className="font-medium">{displayLectures.length}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
