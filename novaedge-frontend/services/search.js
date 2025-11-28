import { apiGet } from "@/lib/api";

export async function globalSearch(query, type, page = 1) {
    const params = new URLSearchParams({ q: query, page });
    if (type) params.append("type", type);
    return apiGet(`/api/v1/search?${params.toString()}`);
}

export async function getAutocompleteSuggestions(query) {
    return apiGet(`/api/v1/search/autocomplete?q=${query}`);
}
