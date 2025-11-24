// app/admin/courses/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export default function AdminCourseEditPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id;

  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [error, setError] = useState(null);

  // edit fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [techStack, setTechStack] = useState("");
  const [prerequisites, setPrerequisites] = useState("");

  // ... other state for saving
  const [saving, setSaving] = useState(false);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    if (!courseId) return;
    let mounted = true;

    const fetchCourse = async () => {
      setLoadingCourse(true);
      setError(null);
      try {
        const data = await apiGet(`/api/v1/course/${courseId}`);
        const fetched = data.course || data;
        if (!mounted) return;
        setCourse(fetched);

        // prefill
        setTitle(fetched.title || "");
        setDescription(fetched.description || "");
        setCategory(fetched.category || "");
        setPrice(fetched.price != null ? String(fetched.price) : "");
        setImagePreview(fetched.image || "");
        setTechStack(fetched.techStack || "");
        setPrerequisites(fetched.prerequisites || "");
      } catch (e) {
        if (!mounted) return;
        setError(e.message || "Failed to load course");
      } finally {
        if (!mounted) return;
        setLoadingCourse(false);
      }
    };

    fetchCourse();
    return () => {
      mounted = false;
    };
  }, [courseId]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      setImageFile(null);
      setImagePreview(course?.image || "");
      return;
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!courseId) return;
    setSaving(true);
    try {
      let imageData = null;
      if (imageFile) {
        imageData = await fileToDataUrl(imageFile);
      }

      const payload = {
        title,
        description,
        category,
        price: Number(price || 0),
        image: imageData || imagePreview, // send dataURL if new file, else existing image URL
        techStack,
        prerequisites,
      };

      await apiPut(`/api/v1/course/${courseId}`, payload);
      const data = await apiGet(`/api/v1/course/${courseId}`);
      setCourse(data.course || data);
      alert("Course updated");
    } catch (err) {
      alert(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // rest unchanged (lectures, add lecture...)
  // render form includes new fields + file input + preview

  if (loadingCourse) {
    return (
      <AdminGuard>
        <div>Loading course...</div>
      </AdminGuard>
    );
  }

  if (error) {
    return (
      <AdminGuard>
        <div className="text-destructive">Error: {error}</div>
      </AdminGuard>
    );
  }

  if (!course) {
    return (
      <AdminGuard>
        <div>Course not found</div>
      </AdminGuard>
    );
  }

  const lectures = Array.isArray(course.lectures)
    ? course.lectures
    : course.lectures || [];

  return (
    <AdminGuard>
      <div className="max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Course</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/courses")}
              className="px-3 py-1 border rounded"
            >
              Back
            </button>
            <button
              onClick={async () => {
                if (!confirm("Delete this course permanently?")) return;
                try {
                  await apiDelete(`/api/v1/course/${courseId}`);
                  alert("Deleted");
                  router.push("/admin/courses");
                } catch (err) {
                  alert(err.message || "Delete failed");
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete Course
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 p-4 border rounded">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (INR)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="mt-2 h-28 rounded object-cover border"
              />
            )}
            <div className="text-xs text-muted mt-1">
              Upload new file or keep existing thumbnail.
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tech Stack</label>
            <input
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="React, Node, PostgreSQL"
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Prerequisites
            </label>
            <input
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
              placeholder="Basic JS knowledge"
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle(course.title || "");
                setDescription(course.description || "");
                setCategory(course.category || "");
                setPrice(course.price != null ? String(course.price) : "");
                setImagePreview(course.image || "");
                setTechStack(course.techStack || "");
                setPrerequisites(course.prerequisites || "");
              }}
              className="px-4 py-2 border rounded"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Lectures section unchanged below... */}
        <div className="p-4 border rounded space-y-3">
          <h2 className="text-lg font-semibold">
            Lectures ({lectures.length})
          </h2>
          {lectures.length === 0 && (
            <div className="text-sm text-muted">No lectures yet</div>
          )}
          <div className="space-y-2">
            {lectures.map((lec, idx) => (
              <div
                key={lec._id || lec.id || idx}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <div className="font-medium">
                    {lec.title || `Lecture ${idx + 1}`}
                  </div>
                  <div className="text-sm text-muted">
                    {lec.duration || lec.length || ""}
                  </div>
                </div>
                <div className="flex gap-2">
                  {lec.videoUrl && (
                    <a
                      href={lec.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 border rounded text-sm"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add lecture form — same as before (not repeated for brevity) */}
      </div>
    </AdminGuard>
  );
}
