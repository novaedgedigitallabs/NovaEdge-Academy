import { apiGet } from "@/lib/api";

export async function getMyEnrollments() {
    return apiGet("/api/v1/enrollments/me");
}

export async function checkEnrollment(courseId) {
    return apiGet(`/api/v1/enrollment/check/${courseId}`);
}
