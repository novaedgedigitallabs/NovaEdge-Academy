import { apiGet, apiPost } from "@/lib/api";

export async function sendMessage(receiverId, message, image) {
    return apiPost("/api/v1/messages/send", { receiverId, message, image });
}

export async function getMessages(otherUserId) {
    return apiGet(`/api/v1/messages/history/${otherUserId}`);
}
