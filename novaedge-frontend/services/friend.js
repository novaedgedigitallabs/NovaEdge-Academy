import { apiGet, apiPost } from "@/lib/api";

export async function sendFriendRequest(receiverId) {
    return apiPost("/api/v1/friends/request/send", { receiverId });
}

export async function acceptFriendRequest(requestId) {
    return apiPost("/api/v1/friends/request/accept", { requestId });
}

export async function rejectFriendRequest(requestId) {
    return apiPost("/api/v1/friends/request/reject", { requestId });
}

export async function getFriendRequests() {
    return apiGet("/api/v1/friends/requests");
}

export async function getFriends() {
    return apiGet("/api/v1/friends/list");
}

export async function getFriendStatus(otherUserId) {
    return apiGet(`/api/v1/friends/status/${otherUserId}`);
}

export async function removeFriend(friendId) {
    return apiPost("/api/v1/friends/remove", { friendId });
}
