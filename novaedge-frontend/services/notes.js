import { apiGet, apiPost, apiPut } from "@/lib/api";

export async function getLectureNotes(courseId, lectureId) {
    return apiGet(`/api/v1/notes/${courseId}/${lectureId}`);
}

export async function generateLectureNotes(courseId, lectureId) {
    return apiPost(`/api/v1/notes/generate/${courseId}/${lectureId}`, {});
}

export async function updateLectureNotes(courseId, lectureId, data) {
    return apiPut(`/api/v1/notes/${courseId}/${lectureId}`, data);
}
