import api from "@/lib/api";

export const getMentorProfile = async () => {
    const response = await api.get("/mentor/me");
    return response.data;
};

export const getMentorAnalytics = async () => {
    const response = await api.get("/mentor/analytics/overview");
    return response.data;
};

export const uploadLecture = async (courseId, data) => {
    const response = await api.post(`/mentor/course/${courseId}/lecture`, data);
    return response.data;
};

export const editLecture = async (courseId, lectureId, data) => {
    const response = await api.put(`/mentor/course/${courseId}/lecture/${lectureId}`, data);
    return response.data;
};

export const createAssignment = async (courseId, data) => {
    const response = await api.post(`/mentor/course/${courseId}/assignment`, data);
    return response.data;
};

export const getCourseAssignments = async (courseId) => {
    const response = await api.get(`/mentor/course/${courseId}/assignments`);
    return response.data;
};

export const getCourseStudents = async (courseId) => {
    const response = await api.get(`/mentor/course/${courseId}/students`);
    return response.data;
};

export const getStudentPerformance = async (courseId, studentId) => {
    const response = await api.get(`/mentor/course/${courseId}/student/${studentId}/performance`);
    return response.data;
};

export const getCourseQuestions = async (courseId, params) => {
    const response = await api.get(`/mentor/course/${courseId}/questions`, { params });
    return response.data;
};

export const replyToQuestion = async (questionId, content) => {
    const response = await api.post(`/question/${questionId}/reply`, { content });
    return response.data;
};

export const gradeSubmission = async (submissionId, data) => {
    const response = await api.put(`/mentor/assignment/${submissionId}/grade`, data);
    return response.data;
};
