import { apiGet, apiPost } from "@/lib/api";

export async function getPlans() {
    return apiGet(`/api/v1/plans`);
}

export async function createSubscription(planId) {
    return apiPost(`/api/v1/subscribe`, { planId });
}

export async function verifySubscription(data) {
    return apiPost(`/api/v1/subscription/verify`, data);
}

export async function cancelSubscription() {
    return apiPost(`/api/v1/subscription/cancel`, {});
}

export async function getMySubscription() {
    return apiGet(`/api/v1/subscription/me`);
}
