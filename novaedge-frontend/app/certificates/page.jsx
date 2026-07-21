"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Award, ShieldCheck } from "lucide-react";
import { getMyCertificates } from "@/services/certificate";

export default function CertificatesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchCertificates = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMyCertificates();
        setCertificates(Array.isArray(data?.certificates) ? data.certificates : []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to load certificates");
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <AppLayout className="max-w-5xl">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              My Certificates
            </h1>
            <p className="text-sm text-muted-foreground">
              View and share your earned course certificates.
            </p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-16 text-muted-foreground">
            Loading your certificates...
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12 text-destructive">
            <p className="mb-4 text-sm font-semibold">Error: {error}</p>
            <Button className="rounded-full px-6" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {!loading && !error && certificates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div key={cert._id} className="bg-card/40 border border-border/50 rounded-2xl p-6 backdrop-blur-md shadow-xl flex flex-col justify-between">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground line-clamp-1">{cert.course?.title || "Certificate of Completion"}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Issued: {new Date(cert.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button asChild className="rounded-full w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  <Link href={`/certificate/${cert._id}`}>View Certificate</Link>
                </Button>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && certificates.length === 0 && (
          <div className="text-center py-20 bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl my-6">
            <div className="h-16 w-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">No certificates yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Complete your enrolled courses to earn verifiable certificates.
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
