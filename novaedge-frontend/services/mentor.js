import { apiGet, apiPost, apiPut } from "@/lib/api";

export const getMentorProfile = async () => {
    return await apiGet("/mentor/me");
};

export const getMentorAnalytics = async () => {
    return await apiGet("/mentor/analytics/overview");
};

export const uploadLecture = async (courseId, data) => {
    return await apiPost(`/mentor/course/${courseId}/lecture`, data);
};

export const editLecture = async (courseId, lectureId, data) => {
    return await apiPut(`/mentor/course/${courseId}/lecture/${lectureId}`, data);
};

export const createAssignment = async (courseId, data) => {
    return await apiPost(`/mentor/course/${courseId}/assignment`, data);
};

export const getCourseAssignments = async (courseId) => {
    return await apiGet(`/mentor/course/${courseId}/assignments`);
};

export const getCourseStudents = async (courseId) => {
    return await apiGet(`/mentor/course/${courseId}/students`);
};

export const getStudentPerformance = async (courseId, studentId) => {
    return await apiGet(`/mentor/course/${courseId}/student/${studentId}/performance`);
};

export const getCourseQuestions = async (courseId, params) => {
    return await apiGet(`/mentor/course/${courseId}/questions`, { params });
};

export const replyToQuestion = async (questionId, content) => {
    return await apiPost(`/question/${questionId}/reply`, { content });
};

export const gradeSubmission = async (submissionId, data) => {
    return await apiPut(`/mentor/assignment/${submissionId}/grade`, data);
};

