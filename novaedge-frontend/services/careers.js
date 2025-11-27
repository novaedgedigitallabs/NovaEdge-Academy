import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export async function getAllPositions() {
    return apiGet("/api/v1/careers");
}

export async function getPosition(id) {
    return apiGet(`/api/v1/careers/${id}`);
}

export async function createPosition(data) {
    return apiPost("/api/v1/careers", data);
}

export async function updatePosition(id, data) {
    return apiPut(`/api/v1/careers/${id}`, data);
}

export async function deletePosition(id) {
    return apiDelete(`/api/v1/careers/${id}`);
}
