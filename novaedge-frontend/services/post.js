import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export const createPost = async (content, repostOf = null) => {
    return apiPost("/api/v1/posts/create", { content, repostOf });
};

export const getAllPosts = async () => {
    return apiGet("/api/v1/posts/all");
};

export const getUserPosts = async (userId) => {
    return apiGet(`/api/v1/posts/user/${userId}`);
};

export const deletePost = async (postId) => {
    return apiDelete(`/api/v1/posts/${postId}`);
};

export const likePost = async (postId) => {
    return apiPut(`/api/v1/posts/${postId}/like`);
};
