"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { apiGet, apiPost } from "@/lib/api";
import { Loader2 } from "lucide-react";

/**
 * same normalize helper as course detail
 */
function normalizeImageSrc(maybe) {
  if (!maybe) return "";
  if (typeof maybe === "string") return maybe;
  if (typeof maybe === "object") {
    if (maybe.url) return String(maybe.url);
    if (maybe.secure_url) return String(maybe.secure_url);
    if (maybe.src) return String(maybe.src);
    if (maybe.data && typeof maybe.data === "object") {
      return String(
        maybe.data.url || maybe.data.secure_url || maybe.data.src || ""
      );
    }
  }
  return "";
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams?.get("courseId");

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
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
        const data = await apiGet(`/api/v1/course/${courseId}`);
        setCourse(data.course || data);
      } catch (e) {
        setErr(e.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId]);

  const handlePayment = async () => {
    if (!course) return;
    setProcessing(true);
    try {
      // 1. Get Razorpay Key
      const { key } = await apiGet("/api/v1/payment/razorpaykey");

      // 2. Create Order
      const { order } = await apiPost("/api/v1/payment/checkout", {
        courseId: course._id || course.id,
      });

      // 3. Initialize Razorpay
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "NovaEdge Academy",
        description: `Enrollment for ${course.title}`,
        image: normalizeImageSrc(course.poster || course.image),
        order_id: order.id,
        handler: function (response) {
          // Redirect to payment verification page with params
          const query = new URLSearchParams({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            courseId: course._id || course.id,
          }).toString();
          router.push(`/payment?${query}`);
        },
        prefill: {
          name: "User Name", // You might want to fetch user details if available
          email: "user@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "NovaEdge Corporate Office",
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.description);
        setProcessing(false);
      });
      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment initiation failed. Please try again.");
      setProcessing(false);
    }
  };

  if (!courseId) {
    return (
      <main className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Invalid Checkout</h2>
        <p className="text-muted-foreground mt-2">
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
    );
  }

  if (loading) {
    return (
      <main className="container mx-auto py-20 text-center">
        Loading course...
      </main>
    );
  }

  if (err) {
    return (
      <main className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Error</h2>
        <p className="text-muted-foreground mt-2">{err}</p>
        <div className="mt-6">
          <button
            onClick={() => router.push("/courses")}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Browse Courses
          </button>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Course not loaded</h2>
        <p className="text-muted-foreground mt-2">
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
    );
  }

  // normalize poster
  const posterRaw = course?.poster || course?.image || "";
  const posterSrc = normalizeImageSrc(posterRaw);
  if (process.env.NODE_ENV === "development") {
    console.log("Checkout poster raw:", posterRaw, "-> posterSrc:", posterSrc);
  }

  return (
    <main className="container mx-auto py-12 max-w-4xl px-4">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="border p-4 rounded">
            <h2 className="font-semibold mb-3">Billing Information</h2>
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
            <button
              onClick={handlePayment}
              disabled={processing}
              className="px-4 py-2 bg-black text-white rounded w-full flex items-center justify-center"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${course?.price ?? "0"}`
              )}
            </button>
          </div>
        </div>

        <aside className="p-4 border rounded h-fit">
          <div className="relative aspect-video mb-4 bg-muted rounded overflow-hidden">
            <Image
              src={posterSrc || "/placeholder.svg"}
              alt={String(course?.title || course?._id || "Course thumbnail")}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="text-2xl font-bold mb-4">
            ₹{course?.price ?? "0"}
          </div>

          <div className="mt-4 text-sm space-y-2">
            <div className="flex justify-between border-b pb-2">
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
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense
        fallback={
          <div className="container mx-auto py-20 text-center">
            Loading checkout...
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}
