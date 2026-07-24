class ApiEndpoints {
  // Production Base URL
  static const String baseUrl = 'https://novaedgeacademy-backend.vercel.app/api/v1';

  // Auth
  static const String login = '/login';
  static const String register = '/register';
  static const String googleLogin = '/google-login';
  static const String me = '/me';
  static const String updateProfile = '/me/update';
  static const String logout = '/logout';

  // Courses
  static const String courses = '/courses';
  static const String courseDetail = '/course'; // /course/:id
  static const String search = '/search';

  // Progress
  static const String progress = '/progress'; // /progress/:courseId

  // Payment & Enrollment
  static const String checkout = '/checkout';
  static const String paymentVerification = '/paymentverification';
  static const String myEnrollments = '/enrollments';
  static const String razorpayKey = '/razorpaykey';

  // Certificates
  static const String myCertificates = '/my/certificates';
  static const String generateCertificate = '/certificate/generate'; // /certificate/generate/:courseId

  // Quizzes & Assessments
  static const String courseQuizzes = '/course'; // /course/:courseId/quizzes
  static const String submitQuiz = '/quiz'; // /quiz/:quizId/submit

  // Assignments
  static const String courseAssignments = '/course'; // /course/:courseId/assignments
  static const String submitAssignment = '/assignment'; // /assignment/:assignmentId/submit

  // Notifications
  static const String notifications = '/notifications';
  static const String readAllNotifications = '/notifications/read-all';

  // Wishlist
  static const String wishlist = '/wishlist'; // GET /wishlist, POST /wishlist/:courseId/toggle

  // Reviews
  static const String courseReviews = '/course'; // GET /course/:courseId/reviews, POST /course/:courseId/review

  // Blogs & Articles
  static const String blogs = '/blogs';

  // Mentors & Experts
  static const String mentors = '/mentors';

  // Careers & Opportunities
  static const String careers = '/careers';

  // Community Posts
  static const String postsAll = '/posts/all';
  static const String createPost = '/posts/create';
  static const String posts = '/posts'; // /posts/:id/like
}
