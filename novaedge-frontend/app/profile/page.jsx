"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "@/components/course/CourseCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]); // array of course objects
  const [error, setError] = useState(null);

  // redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Fetch enrolled courses once user is available
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
          // if unauthorized, force logout or redirect
          if (res.status === 401 || res.status === 403) {
            // optional: logout user if token invalid
            // logout();
            router.push("/login");
            return;
          }
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to load enrollments");
        }

        const data = await res.json();

        // Support multiple response shapes:
        // 1) { courses: [ ... ] }
        // 2) { enrollments: [ { course: {...} }, ... ] }
        // 3) direct array
        let fetchedCourses = [];
        if (Array.isArray(data.courses)) {
          fetchedCourses = data.courses;
        } else if (Array.isArray(data.enrollments)) {
          // extract course object from enrollment entries if present
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

  // show nothing until auth resolved or redirect runs
  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 relative mx-auto w-24 h-24">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={logout}
                  >
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="enrolled" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="enrolled">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight mb-2">
                      My Courses
                    </h3>
                    <p className="text-muted-foreground">
                      Continue learning where you left off.
                    </p>
                  </div>

                  {/* Loading state */}
                  {loading && (
                    <div className="py-8 text-center text-muted-foreground">
                      Loading your courses...
                    </div>
                  )}

                  {/* Error state */}
                  {error && (
                    <div className="py-4 text-center text-destructive">
                      <p className="mb-2">Error: {error}</p>
                      <Button onClick={() => window.location.reload()}>
                        Retry
                      </Button>
                    </div>
                  )}

                  {/* Empty state */}
                  {!loading && !error && courses.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                      <p className="mb-4">
                        You are not enrolled in any courses yet.
                      </p>
                      <Button onClick={() => router.push("/courses")}>
                        Browse Courses
                      </Button>
                    </div>
                  )}

                  {/* Courses grid */}
                  {!loading && !error && courses.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {courses.map((course) => {
                        // CourseCard expects "course" prop; adapt if your shape differs
                        // if course has ._id use it as key, else .id
                        const key =
                          course._id ||
                          course.id ||
                          course.slug ||
                          Math.random();
                        return <CourseCard key={key} course={course} />;
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="certificates">
                <Card>
                  <CardHeader>
                    <CardTitle>My Certificates</CardTitle>
                    <CardDescription>
                      View and download your earned certificates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
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
                      <p>You haven&apos;t earned any certificates yet.</p>
                      <Button
                        variant="link"
                        className="mt-2"
                        onClick={() => router.push("/courses")}
                      >
                        Browse Courses
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Email Notifications
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="notify"
                          className="rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="notify" className="text-sm">
                          Receive updates about new courses
                        </label>
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
