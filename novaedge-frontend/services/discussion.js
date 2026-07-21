import { apiGet, apiPost } from "@/lib/api";

export async function getDiscussions(courseId, lectureId) {
    return apiGet(`/api/v1/course/${courseId}/lecture/${lectureId}/discussions`);
}

export async function createDiscussion(courseId, lectureId, data) {
    return apiPost(`/api/v1/course/${courseId}/lecture/${lectureId}/discussions`, data);
}

export async function getDiscussion(discussionId) {
    return apiGet(`/api/v1/discussion/${discussionId}`);
}

export async function addComment(discussionId, data) {
    return apiPost(`/api/v1/discussion/${discussionId}/comment`, data);
}

export async function toggleUpvote(type, id) {
    return apiPost(`/api/v1/discussion/upvote`, { type, id });
}
