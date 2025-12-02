# NovaEdge Academy - Full Stack LMS

NovaEdge Academy is a comprehensive Learning Management System (LMS) designed to provide a premium educational experience. It features a robust backend API built with Node.js and Express, and a modern, dynamic frontend built with Next.js 16 and Tailwind CSS.

## 🚀 Technologies Used

### Frontend (`novaedge-frontend`)
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4, CSS Modules
- **UI Components:** Shadcn UI (Radix Primitives), Lucide React
- **State/Forms:** React Hook Form, Zod
- **Charts:** Recharts
- **Notifications:** Sonner
- **Utilities:** Date-fns, CLSX, Tailwind Merge

### Backend (`novaedge-backend`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT (JSON Web Tokens), Cookie-Parser
- **File Storage:** Cloudinary
- **Payments:** Razorpay
- **Email:** Nodemailer
- **PDF/Certificates:** PDFKit
- **Utilities:** Multer, BcryptJS, QR-Image

---

## ✨ Features

### User Features
- **Course Catalog:** Browse and search for courses with advanced filtering.
- **Student Dashboard:** Track progress, view enrolled courses, and manage profile.
- **Learning Experience:** Watch video lectures, read materials, and track completion.
- **Gamification:** Earn badges for course completion and streaks. View achievements on profile.
- **Testimonials:** Submit video and text testimonials for courses.
- **Support:** Submit support tickets and track their status.
- **Assessments:** Take quizzes and assessments to test knowledge.
- **Certificates:** Auto-generate PDF certificates upon course completion.
- **Blog & Careers:** Read educational articles and explore career opportunities.
- **Mentorship:** Connect with mentors (view mentor profiles).
- **AI Assistant:** Smart lecture summaries, interactive quizzes, and a 24/7 AI Chat Assistant (powered by Gemini) to answer questions in simple language.
- **Social Network:** Connect with other learners, send friend requests, and manage your network.
- **Community Feed:** Create posts, share thoughts, comment, like, and repost content.
- **Real-time Chat:** Message friends directly and interact with the AI assistant in the same interface.

### Admin Features
- **Dashboard:** Overview of platform statistics (users, sales, courses).
- **Course Management:** Create, update, and delete courses and lectures.
- **User Management:** Manage student and instructor accounts.
- **Enrollment Management:** View and manage student enrollments.
- **Content Management:** Manage blogs, career listings, and mentors.
- **Gamification Management:** Create and manage badges and rules.
- **Testimonial Moderation:** Review, approve, reject, and feature user testimonials.
- **Support Desk:** Manage support tickets, queues, and SLAs.
- **Audit Logs:** View immutable logs of all admin actions for security and compliance.

---

## 📂 Project Structure

```
novaedge/
├── novaedge-backend/       # Express.js API Server
│   ├── config/             # DB and Cloudinary config
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth and error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   └── server.js           # Entry point
│
└── novaedge-frontend/      # Next.js Client
    ├── app/                # App Router pages
    ├── components/         # Reusable UI components
    ├── lib/                # API wrapper and utils
    └── services/           # API service calls
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URI)
- Cloudinary Account
- Razorpay Account (for payments)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd novaedge-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `novaedge-backend/` with the following variables:
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   COOKIE_EXPIRE=7

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # SMTP (Email)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_email_password
   SMTP_FROM_EMAIL=noreply@novaedge.com
   SMTP_FROM_NAME=NovaEdge

   # AI (Google Gemini)
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd novaedge-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in `novaedge-frontend/` with the following variable:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Documentation

Base URL: `/api/v1`

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /logout` - Logout user
- `GET /me` - Get current user profile

### Courses
- `GET /courses` - Get all courses
- `GET /course/:id` - Get single course details
- `POST /course/new` - Create a new course (Admin)
- `PUT /course/:id` - Update course (Admin)
- `DELETE /course/:id` - Delete course (Admin)
- `GET /course/:id/lectures` - Get course lectures (Enrolled/Admin)
- `POST /course/:id` - Add lecture to course (Admin)

### Enrollment
- `GET /enrollments/me` - Get logged-in user's enrollments
- `GET /enrollment/check/:courseId` - Check if user is enrolled in a course
- `GET /admin/enrollments` - Get all enrollments (Admin)

### Payment
- `POST /payment/process` - Process payment
- `GET /payment/key` - Get Razorpay API key

### Other Resources
- **Blogs:** `/blogs` (GET, POST, PUT, DELETE)
- **Careers:** `/careers` (GET, POST, PUT, DELETE)
- **Mentors:** `/mentors` (GET, POST, PUT, DELETE)
- **Badges:** `/badges` (GET, POST, PUT)
- **Testimonials:** `/testimonials` (GET, POST, PUT, DELETE)
- **Support:** `/support` (Tickets, Queues, SLAs)
- **Audit:** `/admin/audit` (GET, POST)
- **Contact:** `/contact` (POST)
- **Upload:** `/upload` (POST - for file uploads)
- **Friends:** `/friends` (Request, Accept, Reject, List)
- **Messages:** `/messages` (Send, Get History)
- **Posts:** `/posts` (Create, Feed, Like, Delete)
- **Comments:** `/comments` (Add, Reply, Like, Delete)

---

## 🖥️ Frontend Pages & Flow

### Public Flow
- **Home (`/`)**: Landing page with hero section, featured courses, and testimonials.
- **Courses (`/courses`)**: Grid view of all available courses with search and filters.
- **Course Details (`/courses/[id]`)**: Detailed view of a course, including curriculum and instructor info.
- **About (`/about`)**: Information about NovaEdge Academy.
- **Contact (`/contact`)**: Contact form for inquiries.
- **Blog (`/blog`)**: Educational articles and updates.
- **Careers (`/careers`)**: Job openings at NovaEdge.

### Student Flow
- **Authentication**: Login (`/login`) and Register (`/register`) pages.
- **Dashboard (`/profile`)**: User profile management.
- **My Learning (`/enrollments`)**: Access to purchased courses.
- **My Learning (`/enrollments`)**: Access to purchased courses.
- **Checkout (`/checkout`)**: Secure checkout page for purchasing courses.
- **Network (`/network`)**: Manage friends and requests.
- **Messages (`/messages`)**: Chat with friends and AI.
- **Public Profile (`/user/[id]` or `/@username`)**: View user profiles, certificates, and posts.

### Admin Flow
- **Admin Panel (`/admin`)**: Protected route for administrators.
    - Manage Courses
    - Manage Users
    - Manage Content (Blogs, Careers, Mentors)
    - Gamification (Badges)
    - Testimonials
    - Support Desk
    - Audit Logs
    - View Analytics

---

## 📝 License

This project is proprietary and intended for educational purposes.
