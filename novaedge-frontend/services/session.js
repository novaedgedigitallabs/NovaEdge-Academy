import { apiGet, apiDelete, apiPost } from "@/lib/api";

export async function getSessions() {
    return apiGet("/api/v1/sessions");
}

export async function revokeSession(id) {
    return apiDelete(`/api/v1/sessions/${id}`);
}

export async function revokeOtherSessions() {
    return apiPost("/api/v1/sessions/revoke-others");
}
