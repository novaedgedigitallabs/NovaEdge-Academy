import { apiGet, apiPost } from "@/lib/api";

export async function getWishlist() {
    return apiGet("/api/v1/wishlist");
}

export async function toggleWishlist(courseId) {
    return apiPost(`/api/v1/wishlist/${courseId}/toggle`, {});
}
