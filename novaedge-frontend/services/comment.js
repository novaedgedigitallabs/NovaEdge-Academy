import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export const addComment = async (content, postId, parentId = null) => {
    return apiPost("/api/v1/comments/add", { content, postId, parentId });
};

export const getComments = async (postId) => {
    return apiGet(`/api/v1/comments/post/${postId}`);
};

export const deleteComment = async (commentId) => {
    return apiDelete(`/api/v1/comments/${commentId}`);
};

export const likeComment = async (commentId) => {
    return apiPut(`/api/v1/comments/${commentId}/like`);
};
