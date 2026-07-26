// app/admin/courses/new/page.jsx
"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { apiGet, apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

const DEFAULT_CATEGORIES = [
  "App Development",
  "Software Development",
  "Game Development",
  "UI/UX Design",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Data Structures & Algorithms",
];

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

  // Lectures State
  const [lectures, setLectures] = useState([]);
  const [newLecture, setNewLecture] = useState({ title: "", description: "", videoUrl: "", duration: "" });
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [importingPlaylist, setImportingPlaylist] = useState(false);

  const addLecture = () => {
    if (!newLecture.title || !newLecture.videoUrl) return alert("Title and Video URL are required");
    setLectures([...lectures, newLecture]);
    setNewLecture({ title: "", description: "", videoUrl: "", duration: "" });
  };

  const removeLecture = (idx) => {
    setLectures(lectures.filter((_, i) => i !== idx));
  };

  const handleImportPlaylist = async () => {
    if (!playlistUrl.trim()) return alert("Please enter a YouTube Playlist URL, ID, or video links");
    setImportingPlaylist(true);
    try {
      const res = await apiPost("/api/v1/course/fetch-playlist", { playlistUrl: playlistUrl.trim() });
      if (res?.success && Array.isArray(res?.lectures)) {
        setLectures((prev) => [...prev, ...res.lectures]);
        alert(`Successfully imported ${res.lectures.length} lecture(s)!`);
        setPlaylistUrl("");
      } else {
        alert(res?.message || "Failed to fetch playlist");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Error importing playlist";
      alert(errMsg);
    } finally {
      setImportingPlaylist(false);
    }
  };

  // required fields now
  const [createdBy, setCreatedBy] = useState("");
  const [category, setCategory] = useState("");
  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  useEffect(() => {
    if (user) {
      // Prefill creator from logged-in user if available
      setCreatedBy(user.name || user.email || "");
    }

    // Fetch existing categories from backend
    apiGet("/api/v1/courses/categories")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data?.categories)) {
          setCategoriesList(res.data.categories);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
      });
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
        lectures, // Add lectures to payload
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium">Category</label>
              <button
                type="button"
                onClick={() => {
                  if (isCustomCategory) {
                    setIsCustomCategory(false);
                    setCategory("");
                  } else {
                    setIsCustomCategory(true);
                    setCategory(customCategoryInput);
                  }
                }}
                className="text-xs text-blue-500 hover:underline font-medium"
              >
                {isCustomCategory ? "← Choose Existing Category" : "+ Create New Category"}
              </button>
            </div>

            {isCustomCategory ? (
              <input
                type="text"
                required
                placeholder="Enter new category name (e.g. AI & Machine Learning)"
                value={customCategoryInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomCategoryInput(val);
                  setCategory(val);
                }}
                className="w-full border p-2 rounded bg-background text-foreground border-input"
              />
            ) : (
              <select
                required
                value={category}
                onChange={(e) => {
                  if (e.target.value === "__NEW__") {
                    setIsCustomCategory(true);
                    setCategory(customCategoryInput);
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                className="w-full border p-2 rounded bg-background text-foreground border-input"
              >
                <option value="" className="bg-slate-900 text-slate-100 dark:bg-slate-900 dark:text-slate-100">
                  -- Select category --
                </option>
                {categoriesList.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-slate-100 dark:bg-slate-900 dark:text-slate-100">
                    {c}
                  </option>
                ))}
                <option value="__NEW__" className="bg-slate-900 text-amber-400 dark:bg-slate-900 dark:text-amber-400 font-semibold">
                  + Add New Category
                </option>
              </select>
            )}
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
            <div className="text-xs text-muted-foreground mt-1">
              This will be saved as the course creator (required)
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tech Stack{" "}
              <span className="text-xs text-muted-foreground">(comma separated)</span>
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

          {/* LECTURES SECTION */}
          <div className="border-t pt-4 mt-6">
            <h2 className="text-xl font-bold mb-4">Course Lectures</h2>

            {/* YOUTUBE PLAYLIST AUTO-IMPORT */}
            <div className="bg-blue-950/30 border border-blue-500/30 p-4 rounded-lg mb-6 space-y-2">
              <h3 className="font-semibold text-sm text-blue-400 flex items-center gap-2">
                <span>▶</span> Import from YouTube Playlist
              </h3>
              <p className="text-xs text-muted-foreground">
                Paste a public YouTube playlist URL (e.g. https://www.youtube.com/playlist?list=PL...) to automatically fetch all video titles and URLs.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube Playlist Link or ID..."
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  className="flex-1 border p-2 rounded bg-background text-foreground border-input text-sm"
                />
                <button
                  type="button"
                  onClick={handleImportPlaylist}
                  disabled={importingPlaylist}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm disabled:opacity-50 transition-colors"
                >
                  {importingPlaylist ? "Fetching Videos..." : "Import Playlist"}
                </button>
              </div>
            </div>

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
                    <span className="text-blue-500 truncate max-w-[200px]">{lec.videoUrl}</span>
                    <span className="text-green-600 font-medium">{lec.duration ? `${lec.duration} min` : "0 min"}</span>
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

          <div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-primary text-primary-foreground"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </AdminGuard>
  );
}
