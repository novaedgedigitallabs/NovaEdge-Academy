"use client";

import { useAuth } from "@/context/auth-context";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "@/components/course/CourseCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Link as LinkIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);

  // redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Fetch enrolled courses and certificates
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch Enrollments
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/enrollments/me`,
          { credentials: "include" }
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

        // Fetch Certificates
        const certRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/my/certificates`,
          { credentials: "include" }
        );
        if (certRes.ok) {
          const certData = await certRes.json();
          setCertificates(certData.certificates || []);
        }

      } catch (err) {
        setError(err.message || "Something went wrong");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  if (authLoading || !user) return null;

  return (
    <AppLayout className="max-w-2xl xl:max-w-3xl border-r border-border p-0 sm:pb-0">
      {/* Header / Back button */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-2 flex items-center gap-4 border-b border-border">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold leading-5">{user.name}</h1>
          <p className="text-xs text-muted-foreground">{courses.length} Courses</p>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-48 bg-muted relative">
        {/* Placeholder for cover image */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 relative">
        <div className="flex justify-between items-start">
          <div className="-mt-16 mb-3">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={user.avatar?.url} alt={user.name} />
              <AvatarFallback className="text-4xl">{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-3">
            <Button variant="outline" className="rounded-full font-bold" onClick={() => router.push("/settings")}>
              Edit profile
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold leading-6">{user.name}</h2>
          <p className="text-muted-foreground">@{user.username || user.email.split('@')[0]}</p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
          {user.role === "admin" && (
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">Admin</span>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="flex gap-4 text-sm mb-4">
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-foreground">{courses.length}</span> <span className="text-muted-foreground">Enrolled</span>
          </div>
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-foreground">{certificates.length}</span> <span className="text-muted-foreground">Certificates</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0">
          <TabsTrigger
            value="courses"
            className="flex-1 rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground hover:bg-muted/50 transition-colors"
          >
            Courses
          </TabsTrigger>
          <TabsTrigger
            value="certificates"
            className="flex-1 rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground hover:bg-muted/50 transition-colors"
          >
            Certificates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="p-4">
          {loading && <div className="text-center py-8 text-muted-foreground">Loading...</div>}

          {!loading && courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
              <Button onClick={() => router.push("/courses")}>Browse Courses</Button>
            </div>
          )}

          {!loading && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => {
                const key = course._id || course.id || Math.random();
                return <CourseCard key={key} course={course} />;
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="certificates" className="p-4">
          {loading && <div className="text-center py-8 text-muted-foreground">Loading...</div>}

          {!loading && certificates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No certificates earned yet.</p>
            </div>
          )}

          {!loading && certificates.length > 0 && (
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert._id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-bold">{cert.course?.title || "Course Certificate"}</p>
                    <p className="text-sm text-muted-foreground">Issued on {new Date(cert.issueDate).toLocaleDateString()}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/certificate/${cert.certificateId}/download`} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
