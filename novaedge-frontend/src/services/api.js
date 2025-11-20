import api from '@/lib/api';

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export const courseService = {
    getAllCourses: async () => {
        const response = await api.get('/courses');
        return response.data;
    },
    getCourseDetails: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },
    createCourse: async (data) => {
        const response = await api.post('/courses', data);
        return response.data;
    },
};

export const paymentService = {
    createCheckoutSession: async () => {
        const response = await api.post('/payments/create-checkout-session');
        return response.data;
    },
    verifyPayment: async () => {
        const response = await api.post('/payments/verify-payment');
        return response.data;
    },
};

export const enrollmentService = {
    checkEnrollment: async (courseId) => {
        // User requested: GET /api/v1/enrollment/check/:courseId
        const response = await api.get(`/enrollment/check/${courseId}`);
        return response.data;
    },
    getMyEnrollments: async () => {
        // User requested: GET /api/v1/enrollments/me (in Dashboard section)
        // But in Task 2 it was getMyEnrollments()
        // Let's stick to the Dashboard request: GET /api/v1/enrollments/me
        const response = await api.get('/enrollments/me');
        return response.data;
    },
};

export const progressService = {
    markLectureComplete: async (data) => {
        const response = await api.post('/progress', data);
        return response.data;
    },
};

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },
    updateUserRole: async (id, role) => {
        const response = await api.put(`/admin/user/${id}`, { role });
        return response.data;
    },
    createCourse: async (data) => {
        const response = await api.post('/course/new', data);
        return response.data;
    },
    addLecture: async (courseId, data) => {
        const response = await api.post(`/course/${courseId}`, data);
        return response.data;
    },
};
