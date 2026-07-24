# NovaEdge Academy - Full Stack & Mobile EdTech Platform

NovaEdge Academy is a comprehensive, enterprise-grade Learning Management System (LMS) designed to deliver a premium academic edtech experience across Web and Mobile. It features a robust Node.js/Express REST backend, a modern Next.js 16 web application, and a cross-platform Flutter mobile application.

---

## 🚀 Technologies Used

### 📱 Mobile Application (`novaedge-app`)
- **Framework:** Flutter 3.35.7 (Dart)
- **State Management:** Flutter Riverpod (`flutter_riverpod`)
- **Routing:** GoRouter (`go_router`)
- **HTTP & Storage:** Dio HTTP Client with Auth Bearer Interceptor (`dio`), Flutter Secure Storage (`flutter_secure_storage`)
- **Video Engine:** Dual Video Player (`youtube_player_flutter` for YouTube, `chewie` + `video_player` for Cloudinary MP4 streams)
- **Payments:** Razorpay Flutter SDK (`razorpay_flutter`)
- **UI & Typography:** Google Fonts, Cached Network Image, Custom Dark Academic Design Tokens (`#08080E` base, `#0E0E18` surface, `#9333EA` primary purple, `#06B6D4` cyan, `#F59E0B` gold accent)

### 💻 Web Application (`novaedge-frontend`)
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4, CSS Modules
- **UI Components:** Shadcn UI (Radix Primitives), Lucide React
- **State/Forms:** React Hook Form, Zod
- **Charts:** Recharts
- **Notifications:** Sonner
- **Utilities:** Date-fns, CLSX, Tailwind Merge

### ⚙️ Backend API (`novaedge-backend`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT (JSON Web Tokens), Cookie-Parser
- **File Storage:** Cloudinary, Google Drive API
- **Payments:** Razorpay API
- **Email:** Nodemailer
- **PDF & Certificates:** PDFKit
- **Utilities:** Multer, BcryptJS, QR-Image

---

## ✨ Key Features

### 🎓 Learning & Course Experience
- **Course Catalog & Search:** Advanced search, category filters (App Dev, Full Stack, DSA, Backend, UI/UX), level badges, and price filters with full guest browsing support.
- **Course Curriculum & Materials:** Lecture unlock hierarchy, AI-generated lecture summaries, downloadable PDF notes, and tech stack chips.
- **Dual Video Player Engine:** Automatic detection and playback of both YouTube video links and direct Cloudinary MP4 streams.
- **Real-Time Progress Tracking:** Synchronized progress updates (`/progress/:courseId`) capturing position seconds, total duration, and completion status.
- **Certificates System:** Automated PDF certificate generation upon 100% course completion, featuring verification QR codes and download links.

### 💳 Payments & Checkout
- **Razorpay Integration:** Full Razorpay checkout flow with backend payment signature verification.
- **Coupon Engine:** Real-time coupon validation (`finalAmount` calculations).
- **Free Auto-Enrollment:** Seamless instant enrollment for zero-price courses.

### 🤝 Engagement & Community
- **Community Discussion Feed:** 4th main navigation tab for posting questions, code snippets, liking discussions, and student interaction.
- **Course Reviews & Ratings:** Star rating distribution and interactive "Write a Review" modal dialog for enrolled students.
- **Wishlist Management:** Heart icon quick toggle on course cards and detail screens.
- **Notifications Desk:** System and course alerts with "Mark All Read" action.
- **Blogs & Articles:** Platform news, tutorials, and tech articles.
- **Industry Mentors Directory:** Connect with expert instructors, view company affiliations, and ratings.
- **Careers & Opportunities:** Browse open software engineering roles and internships.

### 🛡️ Admin & Control Panel
- **Analytics Dashboard:** Overview of platform statistics (users, revenue, course enrollments).
- **Course & User Management:** Comprehensive CRUD operations for courses, lectures, students, and mentors.
- **Content & Support Moderation:** Blog management, career listings, testimonial approval, support ticket queues, and immutable audit logs.

---

## 📂 Project Structure

```
novaedgeacademy-in/
├── novaedge-app/           # Cross-Platform Flutter Mobile App
│   ├── lib/
│   │   ├── core/           # Theme, Network (Dio + Auth Interceptor), Storage, Router
│   │   └── features/       # Auth, Courses, Payment, Profile, Certificates, 
│   │                       # Notifications, Wishlist, Reviews, Community, Blogs, Mentors, Careers
│   └── test/               # Unit tests (UserModel, CourseModel JSON parsing)
│
├── novaedge-backend/       # Node.js & Express.js REST API Server
│   ├── config/             # DB and Cloudinary configuration
│   ├── controllers/        # Request handlers & logic
│   ├── middleware/         # Auth, admin, and error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # REST route definitions
│   └── server.js           # Entry point
│
└── novaedge-frontend/      # Next.js Web Client
    ├── app/                # App Router pages and layouts
    ├── components/         # Reusable UI components
    ├── lib/                # API wrapper and utils
    └── services/           # API service calls
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- Flutter SDK (v3.35+ recommended)
- MongoDB (Local or Atlas URI)
- Cloudinary Account
- Razorpay Account (for payments)

### 1. Backend Setup (`novaedge-backend`)
```bash
cd novaedge-backend
npm install
npm run dev
```

### 2. Web Frontend Setup (`novaedge-frontend`)
```bash
cd novaedge-frontend
npm install
npm run dev
```

### 3. Mobile App Setup (`novaedge-app`)
```bash
cd novaedge-app
flutter pub get
flutter run
```

---

## 📡 API Documentation

Base URL: `/api/v1`

- **Auth:** `POST /register`, `POST /login`, `GET /logout`, `GET /me`, `PUT /me/update`
- **Courses:** `GET /courses`, `GET /course/:id`, `POST /course/new`, `PUT /course/:id`, `DELETE /course/:id`
- **Progress:** `POST /progress/:courseId`
- **Payments & Enrollments:** `POST /checkout`, `POST /paymentverification`, `GET /enrollments`
- **Certificates:** `GET /my/certificates`, `POST /certificate/generate/:courseId`
- **Notifications:** `GET /notifications`, `PUT /notifications/read-all`
- **Wishlist:** `GET /wishlist`, `POST /wishlist/:courseId/toggle`
- **Reviews:** `GET /course/:courseId/reviews`, `POST /course/:courseId/review`
- **Community:** `GET /posts/all`, `POST /posts/create`, `PUT /posts/:id/like`
- **Blogs:** `GET /blogs`
- **Mentors:** `GET /mentors`
- **Careers:** `GET /careers`

---

## 📝 License

This project is proprietary and intended for educational purposes.
