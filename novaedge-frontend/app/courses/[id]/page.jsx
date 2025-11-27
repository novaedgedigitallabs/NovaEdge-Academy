"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Play, Star, Globe, Clock, Award, BarChart, Lock, Unlock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  // const [currentLecture, setCurrentLecture] = useState(null); // Removed inline player state

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
        // Auto-select first lecture if none selected
        if (data.lectures && data.lectures.length > 0) {
          // Optional: don't auto-play, just have data ready
        }
      } catch (e) {
        console.error("Failed to fetch lectures", e);
      }
    };
    fetchLectures();
  }, [id, isEnrolled]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-20 text-center">
          Loading course...
        </main>
        <Footer />
      </div>
    );
  }

  if (err || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-20 text-center">
          <h2 className="text-2xl font-bold">Course not found</h2>
          <p className="text-muted-foreground mt-2">
            {err || "We couldn't find the course."}
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link
              href="/courses"
              className="px-4 py-2 bg-black text-white rounded"
            >
              Browse Courses
            </Link>
            <Link href="/" className="px-4 py-2 border rounded">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const courseId = course._id || course.id || "";
  const posterRaw = course?.poster || course?.image || "";
  const posterSrc = normalizeImageSrc(posterRaw);

  // Merge public lectures with full lectures (if available)
  // Public lectures might not have video URLs. Full lectures do.
  const displayLectures = isEnrolled && fullLectures.length > 0 ? fullLectures : (course.lectures || []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-12 max-w-6xl px-4">

        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT CONTENT */}
          <div className="md:col-span-2">
            <>
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-muted-foreground mb-6">{course.description}</p>
            </>

            <div className="space-y-6">
              {/* Learning outcomes */}
              <div className="border rounded p-4">
                <h3 className="font-semibold">What you&apos;ll learn</h3>
                <ul className="list-disc ml-6 mt-2">
                  {(
                    course.outcomes || [
                      "Master core concepts and build real apps.",
                      "Deploy applications to production.",
                    ]
                  ).map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>

              {/* Lectures Table / Index */}
              <div>
                <h3 className="font-semibold mb-4 text-xl">Course Index</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Duration</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayLectures.map((lec, idx) => {
                        const isLocked = !isEnrolled;

                        return (
                          <TableRow
                            key={lec._id || lec.id || idx}
                            className={`
                              ${isEnrolled ? "cursor-pointer hover:bg-muted/50" : "opacity-80"} 
                            `}
                            onClick={() => {
                              if (isEnrolled) {
                                router.push(`/courses/${courseId}/lecture/${lec._id || lec.id}`);
                              }
                            }}
                          >
                            <TableCell className="font-medium">{idx + 1}</TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {lec.title}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                              {lec.description}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                              {lec.duration || "—"}
                            </TableCell>
                            <TableCell>
                              {isLocked ? (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Play className="w-4 h-4 fill-current" />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {displayLectures.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No lectures available yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="h-fit p-4 border rounded sticky top-20">
            <div className="relative aspect-video mb-4 bg-muted rounded overflow-hidden">
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
              <div className="text-2xl font-bold mb-4">
                ₹{course.price ?? "0"}
              </div>
            )}

            {isEnrolled ? (
              <div className="space-y-3">
                <div className="bg-green-100 text-green-700 p-3 rounded text-center font-semibold">
                  You are enrolled!
                </div>
                {displayLectures.length > 0 && (
                  <button
                    onClick={() => router.push(`/courses/${courseId}/lecture/${displayLectures[0]._id || displayLectures[0].id}`)}
                    className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition-colors"
                  >
                    Start Watching
                  </button>
                )}
              </div>
            ) : (
              <Link href={`/checkout?courseId=${courseId}`}>
                <button className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition-colors">
                  Enroll Now
                </button>
              </Link>
            )}

            <div className="mt-4 text-sm space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Duration
                </span>
                <span>{course.duration || "—"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="flex items-center gap-2">
                  <BarChart className="w-4 h-4" /> Level
                </span>
                <span>{course.level || "Intermediate"}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Language
                </span>
                <span>English</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
