import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

export const getMentorProfile = async () => apiGet("/mentor/me");

export const getMentorAnalytics = async () => apiGet("/mentor/analytics/overview");

export const uploadLecture = async (courseId, data) =>
    apiPost(`/mentor/course/${courseId}/lecture`, data);

export const editLecture = async (courseId, lectureId, data) =>
    apiPut(`/mentor/course/${courseId}/lecture/${lectureId}`, data);

export const createAssignment = async (courseId, data) =>
    apiPost(`/mentor/course/${courseId}/assignment`, data);

export const getCourseAssignments = async (courseId) =>
    apiGet(`/mentor/course/${courseId}/assignments`);

export const getCourseStudents = async (courseId) =>
    apiGet(`/mentor/course/${courseId}/students`);

export const getStudentPerformance = async (courseId, studentId) =>
    apiGet(`/mentor/course/${courseId}/student/${studentId}/performance`);

export const getCourseQuestions = async (courseId, params) => {
    let path = `/mentor/course/${courseId}/questions`;
    if (params && Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        path += `?${queryString}`;
    }
    return apiGet(path);
};

export const replyToQuestion = async (questionId, content) =>
    apiPost(`/question/${questionId}/reply`, { content });

export const gradeSubmission = async (submissionId, data) =>
    apiPut(`/mentor/assignment/${submissionId}/grade`, data);
