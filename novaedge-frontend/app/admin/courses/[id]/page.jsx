// app/admin/courses/[id]/page.jsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import VersionHistory from "@/components/admin/VersionHistory";
import html2canvas from "html2canvas";

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
  const [newLecture, setNewLecture] = useState({ title: "", description: "", videoUrl: "", duration: "", notesUrl: "" });
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [importingPlaylist, setImportingPlaylist] = useState(false);

  const [categoriesList, setCategoriesList] = useState([
    "App Development",
    "Software Development",
    "Game Development",
    "UI/UX Design",
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Data Structures & Algorithms",
  ]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const lectureCardRefs = useRef([]);
  const [exportingIdx, setExportingIdx] = useState(null);

  const exportCardAsImage = useCallback(async (idx) => {
    const cardEl = lectureCardRefs.current[idx];
    if (!cardEl) return;
    setExportingIdx(idx);
    try {
      const canvas = await html2canvas(cardEl, {
        backgroundColor: "#1a1a2e",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      const lecTitle = lectures[idx]?.title || `Lecture_${idx + 1}`;
      link.download = `${lecTitle.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export card as image");
    } finally {
      setExportingIdx(null);
    }
  }, [lectures]);

  const addLecture = () => {
    if (!newLecture.title || !newLecture.videoUrl) return alert("Title and Video URL are required");
    setLectures([...lectures, newLecture]);
    setNewLecture({ title: "", description: "", videoUrl: "", duration: "", notesUrl: "" });
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
        alert(`Successfully imported ${res.lectures.length} lecture(s)! Click 'Save Changes' to save.`);
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

    apiGet("/api/v1/courses/categories")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data?.categories)) {
          setCategoriesList(res.data.categories);
        }
      })
      .catch((err) => console.error(err));

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
                  {isCustomCategory ? "← Choose Existing" : "+ New Category"}
                </button>
              </div>

              {isCustomCategory ? (
                <input
                  type="text"
                  placeholder="New Category Name"
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


              <div key={idx} ref={(el) => (lectureCardRefs.current[idx] = el)} className="p-4 border rounded bg-muted/20 relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => exportCardAsImage(idx)}
                    disabled={exportingIdx === idx}
                    className="text-emerald-500 hover:text-emerald-400 text-sm disabled:opacity-50"
                    title="Export as Image"
                  >
                    {exportingIdx === idx ? "Exporting..." : "📷 Export"}
                  </button>
                  {lec._id && (
                    <VersionHistory
                      courseId={courseId}
                      lectureId={lec._id}
                      onRollback={() => {
                        // Reload course data to reflect rollback
                        apiGet(`/api/v1/course/${courseId}`).then(data => {
                          const fetched = data.course || data;
                          setCourse(fetched);
                          setLectures(fetched.lectures || []);
                        });
                      }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeLecture(idx)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <h3 className="font-semibold">Lecture {idx + 1}: {lec.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{lec.description}</p>
                <div className="flex gap-4 text-xs mt-1">
                  <span className="text-blue-500 truncate max-w-[200px]">
                    {lec.videoUrl || (lec.video && lec.video.url)}
                  </span>
                  <span className="text-green-600 font-medium">
                    {lec.duration ? `${lec.duration} min` : "0 min"}
                  </span>
                  {lec.currentVersion && (
                    <span className="bg-blue-100 text-blue-800 px-1 rounded">v{lec.currentVersion}</span>
                  )}
                </div>

                {/* Resource URL */}
                <div className="mt-3 flex items-center gap-2">
                  <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">📎 Resource URL:</label>
                  <input
                    type="text"
                    placeholder="https://drive.google.com/... or any downloadable link"
                    value={lec.notesUrl || lec.notes?.url || ""}
                    onChange={(e) => {
                      const updated = [...lectures];
                      updated[idx] = { ...updated[idx], notesUrl: e.target.value };
                      setLectures(updated);
                    }}
                    className="flex-1 border p-1.5 rounded text-xs bg-background text-foreground border-input"
                  />
                  {(lec.notesUrl || lec.notes?.url) && (
                    <a
                      href={lec.notesUrl || lec.notes?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline whitespace-nowrap"
                    >
                      Preview ↗
                    </a>
                  )}
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
            <div>
              <input
                placeholder="Resource URL (optional — Google Drive, PDF link, etc.)"
                value={newLecture.notesUrl}
                onChange={(e) => setNewLecture({ ...newLecture, notesUrl: e.target.value })}
                className="w-full border p-2 rounded text-sm"
              />
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

