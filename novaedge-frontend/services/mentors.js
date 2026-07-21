import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export async function getAllMentors() {
    return apiGet("/api/v1/mentors");
}

export async function getMentor(id) {
    return apiGet(`/api/v1/mentors/${id}`);
}

export async function createMentor(data) {
    return apiPost("/api/v1/mentors", data);
}

export async function updateMentor(id, data) {
    return apiPut(`/api/v1/mentors/${id}`, data);
}

export async function deleteMentor(id) {
    return apiDelete(`/api/v1/mentors/${id}`);
}
