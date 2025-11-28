# NovaEdge Backend

The backend API for the NovaEdge Academy Learning Management System (LMS). Built with Node.js, Express, and MongoDB, it provides a robust and scalable foundation for managing users, courses, enrollments, and more.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT (JSON Web Tokens), Cookies
- **File Storage:** Cloudinary
- **Payments:** Razorpay
- **Email:** Nodemailer
- **Validation:** Joi / Custom Middleware

## ✨ Features

- **Authentication & Authorization:**
  - User Registration & Login
  - Role-Based Access Control (Student, Mentor, Admin)
  - Two-Factor Authentication (2FA)
  - Password Reset & Recovery

- **Course Management:**
  - Create, Read, Update, Delete (CRUD) Courses
  - Lecture & Video Management
  - Course Categories & Search

- **Learning Experience:**
  - Enrollment System
  - Progress Tracking
  - Quizzes & Assessments
  - Assignments & Grading
  - Certificate Generation

- **Mentor Features:**
  - Dedicated Mentor Dashboard
  - Student Performance Analytics
  - Q&A / Discussion Management

- **Admin Features:**
  - User Management
  - Audit Logs
  - Content Moderation
  - System Analytics

- **Engagement:**
  - Reviews & Ratings
  - Discussion Forums
  - Real-time Chat
  - Badges & Gamification
  - Wishlist

- **Support:**
  - Helpdesk / Support Ticket System

## �️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd novaedge-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=5000
    MONGO_URI=<your_mongodb_connection_string>
    FRONTEND_URL=<frontend_application_url>
    
    # Authentication
    JWT_SECRET=<your_jwt_secret>
    JWT_EXPIRE=7d
    COOKIE_EXPIRE=7
    
    # Cloudinary (File Uploads)
    CLOUDINARY_CLOUD_NAME=<your_cloud_name>
    CLOUDINARY_API_KEY=<your_api_key>
    CLOUDINARY_API_SECRET=<your_api_secret>
    
    # Razorpay (Payments)
    RAZORPAY_API_KEY=<your_key_id>
    RAZORPAY_API_SECRET=<your_key_secret>
    
    # Email (Nodemailer)
    SMTP_HOST=<smtp_host>
    SMTP_PORT=<smtp_port>
    SMTP_EMAIL=<your_email>
    SMTP_PASSWORD=<your_password>
    ```

4.  **Run the server:**
    ```bash
    # Development mode (with nodemon)
    npm run dev

    # Production mode
    npm start
    ```

## � API Endpoints

The API is prefixed with `/api/v1`. Key endpoints include:

- **Auth:** `/api/v1/register`, `/api/v1/login`, `/api/v1/me`
- **Courses:** `/api/v1/courses`
- **Mentors:** `/api/v1/mentor`
- **Admin:** `/api/v1/admin`
- **Payments:** `/api/v1/payment`
- **Enrollment:** `/api/v1/enrollment`
- **Support:** `/api/v1/support`

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
