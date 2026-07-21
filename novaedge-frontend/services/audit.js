import { apiGet, apiPost } from "@/lib/api";

export const getAuditLogs = async (params) => {
    // Construct query string manually since apiGet doesn't support params object
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/v1/admin/audit${queryString ? `?${queryString}` : ""}`;

    // apiGet returns the data directly (parsed JSON)
    return await apiGet(url);
};

export const getAuditLog = async (id) => {
    return await apiGet(`/api/v1/admin/audit/${id}`);
};

export const retractAuditLog = async (id, reason) => {
    return await apiPost(`/api/v1/admin/audit/${id}/retract`, { reason });
};
