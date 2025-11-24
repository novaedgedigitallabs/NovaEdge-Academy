// app/checkout/page.jsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams?.get("courseId");

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!courseId) {
      setErr("No course selected. Please choose a course from the catalog.");
      return;
    }

    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${base}/api/v1/course/${courseId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setCourse(data.course || data);
      } catch (e) {
        setErr(e.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId]);

  if (!courseId) {
    return (
      <>
        <Header />
        <main className="container mx-auto py-20 text-center">
          <h2 className="text-2xl font-semibold">Invalid Checkout</h2>
          <p className="text-muted mt-2">
            No course selected. Please go back and pick a course.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/courses")}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Browse Courses
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto py-20 text-center">
          Loading course...
        </main>
        <Footer />
      </>
    );
  }

  if (err) {
    return (
      <>
        <Header />
        <main className="container mx-auto py-20 text-center">
          <h2 className="text-2xl font-semibold">Error</h2>
          <p className="text-muted mt-2">{err}</p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/courses")}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Browse Courses
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Final guard: if course still null for any reason, show friendly message
  if (!course) {
    return (
      <>
        <Header />
        <main className="container mx-auto py-20 text-center">
          <h2 className="text-2xl font-semibold">Course not loaded</h2>
          <p className="text-muted mt-2">
            Please retry or go back to select a course.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border rounded mr-2"
            >
              Retry
            </button>
            <button
              onClick={() => router.push("/courses")}
              className="px-4 py-2 bg-black text-white rounded"
            >
              Browse Courses
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Safe rendering — use optional chaining for all course properties
  return (
    <>
      <Header />
      <main className="container mx-auto py-12 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Billing form (keep your existing form here) */}
            <div className="border p-4 rounded">
              <h2 className="font-semibold mb-3">Billing Information</h2>
              {/* Example fields */}
              <input
                className="w-full border p-2 rounded mb-2"
                placeholder="First name"
              />
              <input
                className="w-full border p-2 rounded mb-2"
                placeholder="Last name"
              />
              <input
                className="w-full border p-2 rounded mb-2"
                placeholder="Email"
              />
            </div>

            <div className="border p-4 rounded">
              <h2 className="font-semibold mb-3">Payment Method</h2>
              {/* Add your payment inputs */}
              <button className="px-4 py-2 bg-black text-white rounded">
                Pay ₹{course?.price ?? "0"}
              </button>
            </div>
          </div>

          <aside className="p-4 border rounded">
            <div className="relative aspect-video mb-4">
              {/* USE course? optional chaining to avoid null access */}
              <Image
                src={course?.poster?.url || course?.image || "/placeholder.svg"}
                alt={course?.title || "Course"}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="text-2xl font-bold mb-4">
              ₹{course?.price ?? "0"}
            </div>

            <Link href={`/checkout?courseId=${course?._id || course?.id}`}>
              <button className="w-full bg-primary text-white py-2 rounded">
                Proceed to Pay
              </button>
            </Link>

            <div className="mt-4 text-sm">
              <div className="flex justify-between">
                <span>Duration</span>
                <span>{course?.duration ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Level</span>
                <span>{course?.level ?? "Intermediate"}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
