import { apiGet } from "@/lib/api";

export async function getRecommendations(limit = 4) {
    return apiGet(`/api/v1/recommendations?limit=${limit}`);
}
