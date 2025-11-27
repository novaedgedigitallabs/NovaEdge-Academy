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

  // Lectures State
  const [lectures, setLectures] = useState([]);
  const [newLecture, setNewLecture] = useState({ title: "", description: "", videoUrl: "", duration: "" });

  const addLecture = () => {
    if (!newLecture.title || !newLecture.videoUrl) return alert("Title and Video URL are required");
    setLectures([...lectures, newLecture]);
    setNewLecture({ title: "", description: "", videoUrl: "", duration: "" });
  };

  const removeLecture = (idx) => {
    setLectures(lectures.filter((_, i) => i !== idx));
  };

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
        setLectures(fetched.lectures || []);
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
        lectures,
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
            <div className="text-xs text-muted-foreground mt-1">
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
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
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
                setLectures(course.lectures || []);
              }}
              className="px-4 py-2 border rounded"
            >
              Reset
            </button>
          </div>
        </form>

        {/* LECTURES SECTION */}
        <div className="border-t pt-4 mt-6">
          <h2 className="text-xl font-bold mb-4">Course Lectures</h2>

          <div className="space-y-4 mb-6">
            {lectures.map((lec, idx) => (
              <div key={idx} className="p-4 border rounded bg-muted/20 relative">
                <button
                  type="button"
                  onClick={() => removeLecture(idx)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
                <h3 className="font-semibold">Lecture {idx + 1}: {lec.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{lec.description}</p>
                <div className="flex gap-4 text-xs mt-1">
                  <span className="text-blue-500 truncate max-w-[200px]">
                    {lec.videoUrl || (lec.video && lec.video.url)}
                  </span>
                  <span className="text-green-600 font-medium">
                    {lec.duration ? `${lec.duration} min` : "0 min"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-muted/10 p-4 rounded border space-y-3">
            <h3 className="font-medium">Add New Lecture</h3>
            <input
              placeholder="Lecture Title"
              value={newLecture.title}
              onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <textarea
              placeholder="Lecture Description"
              value={newLecture.description}
              onChange={(e) => setNewLecture({ ...newLecture, description: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <input
                  placeholder="Video URL (YouTube)"
                  value={newLecture.videoUrl}
                  onChange={(e) => setNewLecture({ ...newLecture, videoUrl: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={newLecture.duration}
                  onChange={(e) => setNewLecture({ ...newLecture, duration: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addLecture}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm"
            >
              Add Lecture
            </button>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

