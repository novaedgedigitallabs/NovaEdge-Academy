"use client";

import { useAuth } from "@/context/auth-context";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from "@/components/course/CourseCard";
import PostCard from "@/components/post/PostCard";
import { getUserPosts } from "@/services/post";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, ArrowLeft, Loader2, Sparkles, BookOpen, Award, Github, Linkedin, Globe, Twitter, Camera } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  // redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Fetch user posts, enrolled courses and certificates
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch User Posts
        const postsRes = await getUserPosts(user._id).catch(() => ({ success: false }));
        if (postsRes.success && Array.isArray(postsRes.posts)) {
          setPosts(postsRes.posts);
        }

        // Fetch Enrollments
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/enrollments/me`,
          { credentials: "include" }
        );

        if (res.ok) {
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
        }

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  if (authLoading || !user) return null;

  const displayRole = (user.role === "admin" && (user.email?.toLowerCase().includes("admin") || user.isAdmin))
    ? "Admin"
    : user.role === "mentor"
    ? "Mentor"
    : "Student";

  return (
    <AppLayout className="w-full border-r border-border p-0 sm:pb-0">
      {/* Header / Back button */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-2 flex items-center gap-4 border-b border-border">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold leading-5">{user.name}</h1>
          <p className="text-xs text-muted-foreground">{posts.length} Posts · {courses.length} Courses</p>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-48 sm:h-56 bg-muted relative overflow-hidden group">
        {user.coverImage?.url ? (
          <img
            src={user.coverImage.url}
            alt="Profile Cover"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900/80 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-primary/20" />
          </div>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/settings/profile")}
          className="absolute top-3 right-3 rounded-full opacity-80 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm text-xs gap-1.5 cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Edit Cover</span>
        </Button>
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 relative">
        <div className="flex justify-between items-start">
          <div className="-mt-16 mb-3">
            <Avatar className="w-32 h-32 border-4 border-background shadow-lg overflow-hidden">
              <AvatarImage src={user.avatar?.url} alt={user.name} className="object-cover object-center w-full h-full" />
              <AvatarFallback className="text-4xl font-bold bg-primary/15 text-primary">{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-3">
            <Button variant="outline" className="rounded-full font-bold" onClick={() => router.push("/settings/profile")}>
              Edit profile
            </Button>
          </div>
        </div>

        <div className="mb-2">
          <h2 className="text-xl font-bold leading-6 text-foreground">{user.name}</h2>
          <p className="text-muted-foreground text-sm">@{user.username || user.email?.split('@')[0]}</p>
        </div>

        {/* User Bio */}
        {user.bio && (
          <p className="text-sm text-foreground/95 mb-3 leading-relaxed whitespace-pre-line">{user.bio}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
          <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize">
            {displayRole}
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
          </div>

          {/* Social & Web Links */}
          {user.socialLinks && (user.socialLinks.github || user.socialLinks.linkedin || user.socialLinks.portfolio || user.socialLinks.twitter) && (
            <div className="flex items-center gap-2">
              {user.socialLinks.github && (
                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-secondary/50 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="GitHub">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {user.socialLinks.linkedin && (
                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-secondary/50 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {user.socialLinks.portfolio && (
                <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-secondary/50 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="Portfolio">
                  <Globe className="w-4 h-4" />
                </a>
              )}
              {user.socialLinks.twitter && (
                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-secondary/50 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="Twitter / X">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-6 text-sm mb-2 border-t border-border/40 pt-3">
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-foreground">{posts.length}</span> <span className="text-muted-foreground text-xs">Posts</span>
          </div>
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-foreground">{courses.length}</span> <span className="text-muted-foreground text-xs">Enrolled</span>
          </div>
          <div className="hover:underline cursor-pointer">
            <span className="font-bold text-foreground">{certificates.length}</span> <span className="text-muted-foreground text-xs">Certificates</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-border/60 rounded-none h-auto p-0">
          <TabsTrigger
            value="posts"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground hover:bg-muted/30 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Posts ({posts.length})
          </TabsTrigger>
          <TabsTrigger
            value="courses"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground hover:bg-muted/30 transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            Courses ({courses.length})
          </TabsTrigger>
          <TabsTrigger
            value="certificates"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground hover:bg-muted/30 transition-colors flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4 text-primary" />
            Certificates ({certificates.length})
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="p-0 m-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Sparkles className="w-10 h-10 text-primary/40 mx-auto mb-3" />
              <h3 className="font-bold text-base text-foreground mb-1">No posts yet</h3>
              <p className="text-muted-foreground text-xs max-w-xs mx-auto mb-4">
                Share your thoughts, projects, or learning progress with the community!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={handleDeletePost}
                  onUpdate={handleUpdatePost}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="p-4 m-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4 text-sm">You haven&apos;t enrolled in any courses yet.</p>
              <Button onClick={() => router.push("/courses")} className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                Browse Courses
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => {
                const key = course._id || course.id || Math.random();
                return <CourseCard key={key} course={course} />;
              })}
            </div>
          )}
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="p-4 m-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No certificates earned yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {certificates.map((cert) => (
                <div key={cert._id} className="flex items-center justify-between p-4 border border-border/60 rounded-xl hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-bold text-sm text-foreground">{cert.course?.title || "Course Certificate"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Issued on {new Date(cert.issueDate).toLocaleDateString()}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="rounded-full">
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
