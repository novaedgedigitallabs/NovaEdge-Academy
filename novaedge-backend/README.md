# API Endpoints Documentation

## Authentication
- **POST /api/v1/register**: Register a new user.
- **POST /api/v1/login**: Login a user.
- **GET /api/v1/logout**: Logout the current user.
- **GET /api/v1/me**: Get the profile of the logged-in user.

## Courses
- **GET /api/v1/courses**: Get all available courses.
- **GET /api/v1/course/:id**: Get lectures of a specific course (requires authentication).
- **POST /api/v1/course/new**: Create a new course (admin only).
- **POST /api/v1/course/:id**: Add a lecture to a course (admin only).
- **DELETE /api/v1/course/:id**: Delete a course (admin only).

## Payments
- **POST /api/v1/payment/checkout**: Create a payment order.
- **POST /api/v1/payment/verification**: Verify a payment.
- **GET /api/v1/payment/razorpaykey**: Get Razorpay API key.

## Enrollments
- **GET /api/v1/enrollments/me**: Get all courses the user is enrolled in.
- **GET /api/v1/enrollment/check/:courseId**: Check if the user is enrolled in a specific course.
- **GET /api/v1/admin/enrollments**: Get all enrollments (admin only).

## Progress
- **GET /api/v1/progress?courseId=...**: Get progress for a specific course.
- **POST /api/v1/progress**: Update progress for a course.

## Certificates
- **GET /api/v1/certificate/:courseId**: Get a certificate for a completed course.
- **GET /api/v1/certificate/verify/:id**: Verify a certificate by its ID.

## Assessments
- **GET /api/v1/assessment/:courseId**: Get the assessment for a specific course.
- **POST /api/v1/assessment/submit**: Submit answers for an assessment.
- **POST /api/v1/assessment/new**: Create a new assessment (admin only).
- **DELETE /api/v1/assessment/:id**: Delete an assessment (admin only).

## Admin
- **GET /api/v1/admin/stats**: Get dashboard statistics (admin only).
- **GET /api/v1/admin/users**: Get all users (admin only).
- **PUT /api/v1/admin/user/:id**: Update a user's role (admin only).
- **DELETE /api/v1/admin/user/:id**: Delete a user (admin only).