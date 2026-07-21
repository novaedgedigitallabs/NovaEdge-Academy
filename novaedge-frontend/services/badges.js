import { apiGet, apiPost, apiPut } from "@/lib/api";

export const getBadges = async () => {
    return await apiGet("/api/v1/badges");
};

export const getMyBadges = async () => {
    return await apiGet("/api/v1/badges/me");
};

export const createBadge = async (data) => {
    return await apiPost("/api/v1/badges/admin", data);
};

export const updateBadge = async (id, data) => {
    return await apiPut(`/api/v1/badges/admin/${id}`, data);
};

export const awardBadge = async (id, userId) => {
    return await apiPost(`/api/v1/badges/admin/${id}/award`, { userId });
};
