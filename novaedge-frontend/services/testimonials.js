import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export const getTestimonials = async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `/api/v1/testimonials${queryString ? `?${queryString}` : ""}`;
    return await apiGet(url);
};

export const createTestimonial = async (formData) => {
    // Note: We use fetch directly here because we need to send FormData (multipart/form-data)
    // and our apiPost helper might default to JSON.
    // However, let's check if apiPost handles FormData.
    // Looking at lib/api.js, it sets Content-Type to application/json.
    // So we need a custom request for FormData.

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/testimonials`, {
        method: "POST",
        body: formData,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data;
};

export const getAdminTestimonials = async () => {
    return await apiGet("/api/v1/testimonials/admin");
};

export const updateTestimonial = async (id, data) => {
    return await apiPut(`/api/v1/testimonials/admin/${id}`, data);
};

export const deleteTestimonial = async (id) => {
    return await apiDelete(`/api/v1/testimonials/admin/${id}`);
};
