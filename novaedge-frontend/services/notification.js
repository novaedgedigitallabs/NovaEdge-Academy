import { apiGet, apiPut, apiPost } from "@/lib/api";

export async function getNotifications(page = 1) {
    return apiGet(`/api/v1/notifications?page=${page}`);
}

export async function markRead(id) {
    return apiPut(`/api/v1/notifications/${id}/read`, {});
}

export async function markAllRead() {
    return apiPut(`/api/v1/notifications/read-all`, {});
}

export async function updatePreferences(prefs) {
    return apiPut(`/api/v1/user/preferences/notifications`, prefs);
}
