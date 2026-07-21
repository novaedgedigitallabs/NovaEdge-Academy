import { apiGet, apiPost } from "@/lib/api";

export async function recordEvent(data) {
    // Fire and forget (don't await strictly in UI)
    return apiPost(`/api/v1/analytics/event`, data).catch(e => console.error("Analytics failed", e));
}

export async function getAnalyticsOverview(range = 30) {
    return apiGet(`/api/v1/admin/analytics/overview?range=${range}`);
}

export async function getCourseFunnel(courseId) {
    return apiGet(`/api/v1/admin/analytics/course/${courseId}/funnel`);
}
