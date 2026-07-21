import { apiGet, apiPost, apiPut } from "@/lib/api";

export const createTicket = async (ticketData) => {
    return await apiPost("/api/v1/support/tickets", ticketData);
};

export const getTickets = async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/v1/support/tickets${queryString ? `?${queryString}` : ""}`;
    return await apiGet(url);
};

export const getTicket = async (id) => {
    return await apiGet(`/api/v1/support/tickets/${id}`);
};

export const addComment = async (id, commentData) => {
    return await apiPost(`/api/v1/support/tickets/${id}/comments`, commentData);
};

export const updateTicket = async (id, ticketData) => {
    return await apiPut(`/api/v1/support/tickets/${id}`, ticketData);
};

export const getQueues = async () => {
    return await apiGet("/api/v1/support/queues");
};

export const createQueue = async (queueData) => {
    return await apiPost("/api/v1/support/queues", queueData);
};
