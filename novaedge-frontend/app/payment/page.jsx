"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();

  const razorpay_payment_id = searchParams.get("razorpay_payment_id");
  const razorpay_order_id = searchParams.get("razorpay_order_id");
  const razorpay_signature = searchParams.get("razorpay_signature");
  const courseId = searchParams.get("courseId");

  const [status, setStatus] = useState(null); // success / failed
  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !courseId
    ) {
      setStatus("failed");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/verification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              courseId,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setStatus("failed");
          setError(data.message || "Payment verification failed");
        } else {
          setStatus("success");
          setTransactionId(data.orderId || razorpay_order_id);
        }
      } catch (err) {
        setStatus("failed");
        setError("Network error while verifying payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-muted-foreground">
        Verifying payment...
      </div>
    );
  }

  const isSuccess = status === "success";

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div
            className={`mx-auto rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4 ${isSuccess
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
              }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <XCircle className="w-8 h-8" />
            )}
          </div>

          <CardTitle className="text-2xl">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-6">
            {isSuccess
              ? "Thank you for your purchase. You have been successfully enrolled in the course."
              : error ||
              "Something went wrong with your transaction. Please try again."}
          </p>

          {isSuccess && (
            <div className="bg-muted p-4 rounded-lg text-sm mb-4">
              <p className="font-medium">Transaction ID</p>
              <p className="text-muted-foreground font-mono">{transactionId}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {isSuccess ? (
            <Button asChild className="w-full">
              <Link href="/enrollments">
                Go to My Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link href="/checkout">Try Again</Link>
            </Button>
          )}

          <Button asChild variant="ghost" className="w-full">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
