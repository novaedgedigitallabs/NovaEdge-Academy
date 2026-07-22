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

export const updatePost = async (postId, content) => {
    try {
        return await apiPut(`/api/v1/posts/${postId}`, { content });
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return await apiPut(`/api/v1/posts/update/${postId}`, { content });
        }
        throw err;
    }
};

export const likePost = async (postId) => {
    return apiPut(`/api/v1/posts/${postId}/like`);
};

export const getPostById = async (postId) => {
    return apiGet(`/api/v1/posts/${postId}`);
};
