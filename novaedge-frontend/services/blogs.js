import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export async function getAllPosts() {
    return apiGet("/api/v1/blogs");
}

export async function getPost(id) {
    return apiGet(`/api/v1/blogs/${id}`);
}

export async function createPost(data) {
    return apiPost("/api/v1/blogs", data);
}

export async function updatePost(id, data) {
    return apiPut(`/api/v1/blogs/${id}`, data);
}

export async function deletePost(id) {
    return apiDelete(`/api/v1/blogs/${id}`);
}
