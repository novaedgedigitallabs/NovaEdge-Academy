"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Play, Star, Globe, Clock, Award, BarChart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CourseDetailPageClient() {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      setErr(null);

      try {
        // Use your API base or relative path if backend is proxied
        const base = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${base}/api/v1/course/${id}`, {
          credentials: "include", // send cookies
          cache: "no-store",
        });

        if (!res.ok) {
          // capture server error text
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setCourse(data.course || data);
      } catch (e) {
        setErr(e.message || "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto py-20 text-center">
          Loading course…
        </main>
        <Footer />
      </>
    );
  }

  if (err || !course) {
    return (
      <>
        <Header />
        <main className="container mx-auto py-20 text-center">
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
      </>
    );
  }

  const courseId = course._id || course.id;

  return (
    <>
      <Header />
      <main className="container mx-auto py-12 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted mb-6">{course.description}</p>

            <div className="space-y-6">
              <div className="border rounded p-4">
                <h3 className="font-semibold">What you'll learn</h3>
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

              <div>
                <h3 className="font-semibold mb-2">Course Content</h3>
                <div className="space-y-2">
                  {(course.lectures || []).map((lec, idx) => (
                    <div
                      key={lec._id || idx}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <div className="font-medium">{lec.title}</div>
                        <div className="text-sm text-muted">
                          {lec.description}
                        </div>
                      </div>
                      <div className="text-sm text-muted">
                        {lec.duration || ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="p-4 border rounded">
            <div className="relative aspect-video mb-4">
              <Image
                src={course.poster?.url || course.image || "/placeholder.svg"}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-2xl font-bold mb-4">₹{course.price}</div>
            <Link href={`/checkout?courseId=${courseId}`}>
              <button className="w-full bg-primary text-white py-2 rounded">
                Enroll Now
              </button>
            </Link>

            <div className="mt-4 text-sm">
              <div className="flex justify-between">
                <span>Duration</span>
                <span>{course.duration || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Level</span>
                <span>{course.level || "Intermediate"}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
