import { apiGet, apiPost } from "@/lib/api";

// Update progress for a specific lecture
export async function updateLectureProgress(courseId, lectureId, { lastPositionSec, watchedDurationSec, completed }) {
    return apiPost(`/api/v1/progress/${courseId}/lecture/${lectureId}`, {
        lastPositionSec,
        watchedDurationSec,
        completed,
    });
}

// Get progress for the entire course
export async function getCourseProgress(courseId) {
    return apiGet(`/api/v1/progress/${courseId}`);
}

// Get resume position
export async function getResumePosition(courseId) {
    return apiGet(`/api/v1/progress/${courseId}/resume`);
}

// Mark course as complete
export async function markCourseComplete(courseId) {
    return apiPost(`/api/v1/progress/${courseId}/mark-complete`, {});
}
