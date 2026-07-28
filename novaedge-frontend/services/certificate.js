import { apiGet, apiPost, apiDelete } from "@/lib/api";

export async function generateCertificate(courseId) {
    return apiPost(`/api/v1/certificate/generate/${courseId}`, {});
}

export async function getMyCertificates() {
    return apiGet(`/api/v1/my/certificates`);
}

export async function verifyCertificate(certId) {
    return apiGet(`/api/v1/certificate/${certId}`);
}

export async function adminGenerateCertificate(userId, courseId) {
    return apiPost(`/api/v1/admin/certificate/generate`, { userId, courseId });
}

export async function adminDeleteCertificate(certId) {
    return apiDelete(`/api/v1/admin/certificate/${certId}`);
}

export async function getUserCertificates(userId) {
    return apiGet(`/api/v1/certificates/user/${userId}`);
}
