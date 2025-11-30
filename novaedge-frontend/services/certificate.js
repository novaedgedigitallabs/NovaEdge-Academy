import { apiGet, apiPost } from "@/lib/api";

export async function generateCertificate(courseId) {
    return apiPost(`/api/v1/certificate/generate/${courseId}`, {});
}

export async function getMyCertificates() {
    return apiGet(`/api/v1/my/certificates`);
}

export async function verifyCertificate(certId) {
    // This is a public route, so we might not need credentials, but apiGet includes them by default.
    // It shouldn't hurt.
    return apiGet(`/api/v1/certificate/${certId}`);
}

export async function adminGenerateCertificate(userId, courseId) {
    return apiPost(`/api/v1/admin/certificate/generate`, { userId, courseId });
}

export async function getUserCertificates(userId) {
    return apiGet(`/api/v1/certificates/user/${userId}`);
}
