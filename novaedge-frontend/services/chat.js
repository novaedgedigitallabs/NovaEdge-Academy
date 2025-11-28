import { apiGet, apiPost } from "@/lib/api";

export async function getChatSession(courseId) {
    return apiGet(`/api/v1/chat/session/${courseId}`);
}

export async function sendChatMessage(sessionId, message, currentLectureId) {
    return apiPost(`/api/v1/chat/${sessionId}/message`, { message, currentLectureId });
}
