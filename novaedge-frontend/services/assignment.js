import { apiGet, apiPost, apiPut } from "@/lib/api";

export async function getAssignments(courseId) {
    return apiGet(`/api/v1/course/${courseId}/assignments`);
}

export async function submitAssignment(assignmentId, formData) {
    // Note: formData should be an instance of FormData for file uploads
    // We need to use a custom fetch or modify apiPost to handle FormData if it doesn't already
    // Our apiPost uses JSON.stringify, so we need a separate handler for FormData or modify api.js
    // Let's assume we need to use fetch directly or create a helper for multipart

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignment/${assignmentId}/submit`, {
        method: "POST",
        body: formData,
        headers: {
            // Do NOT set Content-Type header for FormData, browser does it with boundary
        },
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Submission failed");
    return data;
}
