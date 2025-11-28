import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export async function getReviews(courseId, page = 1) {
    return apiGet(`/api/v1/course/${courseId}/reviews?page=${page}`);
}

export async function createReview(courseId, data) {
    return apiPost(`/api/v1/course/${courseId}/review`, data);
}

export async function updateReview(reviewId, data) {
    return apiPut(`/api/v1/review/${reviewId}`, data);
}

export async function deleteReview(reviewId) {
    return apiDelete(`/api/v1/review/${reviewId}`);
}

export async function reportReview(reviewId, reason) {
    return apiPost(`/api/v1/review/${reviewId}/report`, { reason });
}

export async function markHelpful(reviewId) {
    return apiPost(`/api/v1/review/${reviewId}/helpful`, {});
}
