// app/admin/courses/new/page.jsx
"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function AdminNewCoursePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [techStack, setTechStack] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  // required fields now
  const [createdBy, setCreatedBy] = useState("");
  const [category, setCategory] = useState("");

  // categories that match your Course schema enum
  const CATEGORIES = [
    "App Development",
    "Software Development",
    "Game Development",
    "UI/UX Design",
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Data Structures & Algorithms",
  ];

  useEffect(() => {
    if (user) {
      // Prefill creator from logged-in user if available
      setCreatedBy(user.name || user.email || "");
    }
  }, [user]);

  // convert selected file to base64 data URL
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) {
      setImageFile(null);
      setImagePreview("");
      return;
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const submit = async (e) => {
    e.preventDefault();

    // client-side validation to give immediate feedback
    if (!title.trim()) return alert("Please enter a title");
    if (!description.trim()) return alert("Please enter a description");
    if (!category) return alert("Please select a category");
    if (!createdBy.trim()) return alert("Please enter creator name");
    // price can be zero

    setLoading(true);
    try {
      let imageData = null;
      if (imageFile) {
        imageData = await fileToDataUrl(imageFile);
      }

      const payload = {
        title,
        description,
        category,
        createdBy,
        price: Number(price || 0),
        techStack, // optional: backend will parse comma separated
        prerequisites,
        image: imageData, // optional: dataURL or null
      };

      const res = await apiPost("/api/v1/course/new", payload);
      // success -> redirect to courses list
      router.push("/admin/courses");
    } catch (err) {
      alert(err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div>
        <h1 className="text-2xl font-bold mb-4">Create Course</h1>

        <form onSubmit={submit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              required
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
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select category --</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Creator (createdBy)
            </label>
            <input
              required
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <div className="text-xs text-muted mt-1">
              This will be saved as the course creator (required)
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tech Stack{" "}
              <span className="text-xs text-muted">(comma separated)</span>
            </label>
            <input
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="React,Node,Postgres"
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
              placeholder="Basic JS, HTML"
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

          <div>
            <label className="block text-sm font-medium mb-1">
              Thumbnail (optional)
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-32 rounded object-cover border"
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-primary text-white"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}
