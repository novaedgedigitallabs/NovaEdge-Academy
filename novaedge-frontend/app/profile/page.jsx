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
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/placeholder.svg");

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
        handleUpdateProfile(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleUpdateProfile = async (newAvatar) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/me/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          avatar: newAvatar
        }),
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        window.location.reload();
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed");
    }
  };

  // redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Fetch enrolled courses and certificates once user is available
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch Enrollments
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/enrollments/me`,
          {
            credentials: "include",
          }
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

        // Fetch Certificates (using fetch directly to keep it simple within this effect, or import service)
        // Let's use fetch directly to match existing style in this file
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
                <div className="mb-4 relative mx-auto w-24 h-24 group cursor-pointer">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={avatarPreview === "/placeholder.svg" ? (user.avatar?.url || "/placeholder.svg") : avatarPreview}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label htmlFor="avatar-upload" className="text-white text-xs cursor-pointer">Edit</label>
                  </div>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
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
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      const url = `${window.location.origin}/user/${user._id}`;
                      navigator.clipboard.writeText(url);
                      // You might want to add a toast here
                      alert("Profile link copied to clipboard!");
                    }}
                  >
                    Share Profile
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
                    {loading ? (
                      <div className="py-8 text-center text-muted-foreground">Loading certificates...</div>
                    ) : certificates.length === 0 ? (
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
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {certificates.map((cert) => (
                          <div
                            key={cert._id}
                            className="flex items-start space-x-4 rounded-lg border p-4"
                          >
                            <div className="flex-1 space-y-1">
                              <p className="font-medium leading-none">
                                {cert.course?.title || "Course Certificate"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Issued on {new Date(cert.issueDate).toLocaleDateString()}
                              </p>
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
