import { apiPost } from "@/lib/api";

export const generateLectureResources = async (courseId, lectureId) => {
    try {
        const data = await apiPost("/api/v1/ai/generate-resources", { courseId, lectureId });
        return data;
    } catch (error) {
        console.error("Failed to generate AI resources:", error);
        throw error;
    }
};
