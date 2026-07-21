import { apiGet, apiPost } from "@/lib/api";

export async function getTranscript(courseId, lectureId) {
    return apiGet(`/api/v1/course/${courseId}/lecture/${lectureId}/transcript`);
}

export async function uploadTranscript(courseId, lectureId, data) {
    return apiPost(`/api/v1/course/${courseId}/lecture/${lectureId}/transcript`, data);
}
