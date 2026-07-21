import { apiGet, apiPost } from "@/lib/api";

export async function createLectureVersion(courseId, lectureId, data) {
    return apiPost(`/api/v1/admin/course/${courseId}/lecture/${lectureId}/version`, data);
}

export async function getLectureVersions(courseId, lectureId) {
    return apiGet(`/api/v1/admin/course/${courseId}/lecture/${lectureId}/versions`);
}

export async function rollbackLectureVersion(versionId) {
    return apiPost(`/api/v1/admin/lecture-version/${versionId}/rollback`, {});
}
