import { apiGet, apiPost, apiPut } from "@/lib/api";

export async function getLiveClasses(courseId) {
    return apiGet(`/api/v1/course/${courseId}/live`);
}

export async function createLiveClass(courseId, data) {
    return apiPost(`/api/v1/course/${courseId}/live`, data);
}

export async function getLiveClass(liveId) {
    return apiGet(`/api/v1/live/${liveId}`);
}

export async function updateLiveStatus(liveId, status) {
    return apiPut(`/api/v1/live/${liveId}/status`, { status });
}

export async function uploadRecording(liveId, recordingUrl) {
    return apiPost(`/api/v1/live/${liveId}/recording`, { recordingUrl });
}
