import { apiGet, apiPost } from "@/lib/api";

export async function getQuizzes(courseId) {
    return apiGet(`/api/v1/course/${courseId}/quizzes`);
}

export async function submitQuiz(quizId, answers) {
    return apiPost(`/api/v1/quiz/${quizId}/submit`, { answers });
}

export async function getQuizResult(quizId) {
    return apiGet(`/api/v1/quiz/${quizId}/result`);
}
