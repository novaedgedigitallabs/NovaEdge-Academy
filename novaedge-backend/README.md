# NovaEdge Backend API Server (`novaedge-backend`)

The core RESTful API backend for the **NovaEdge Academy** EdTech Platform. Built with Node.js, Express.js, and MongoDB, it serves both the Next.js Web Frontend (`novaedge-frontend`) and the Flutter Mobile Application (`novaedge-app`).

---

## 🚀 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ORM)
- **Authentication:** JWT (JSON Web Tokens) with Cookie-Parser & Bearer Header support
- **Media Storage:** Cloudinary & Google Drive API integration
- **Payment Gateway:** Razorpay API (Orders & Signature Verification)
- **Email Delivery:** Nodemailer (SMTP)
- **AI Integration:** Google Gemini Generative AI (Lecture Summaries & Quizzes)
- **PDF Generation:** PDFKit (Automated Course Completion Certificates)

---

## ✨ API Features & Modules

- **Authentication & User Profiles:**
  - Registration, Login, Google Auth, Logout
  - Profile Retrieval (`GET /me`) and Profile Update (`PUT /me/update`)
  - Role-Based Access Control (`student`, `mentor`, `admin`)

- **Course Catalog & Video Progress:**
  - Course CRUD operations & Lecture Management
  - Progress Tracking endpoint (`POST /progress/:courseId`) recording watched duration, last position seconds, and completion state.

- **Payments & Enrollment:**
  - Razorpay order creation (`POST /checkout`) and verification (`POST /paymentverification`)
  - Free course auto-enrollment for zero-amount checkout.
  - Enrolled courses list (`GET /enrollments`).

- **Certificates & Verification:**
  - PDF certificate generation (`POST /certificate/generate/:courseId`)
  - Certificate list with QR verification code (`GET /my/certificates`).

- **Engagement & Community:**
  - Wishlist toggle (`POST /wishlist/:courseId/toggle`) and list (`GET /wishlist`).
  - Course Reviews (`GET /course/:courseId/reviews`, `POST /course/:courseId/review`).
  - Notifications list (`GET /notifications`) and Mark Read (`PUT /notifications/read-all`).
  - Community Feed posts (`GET /posts/all`, `POST /posts/create`, `PUT /posts/:id/like`).
  - Blogs & Articles (`GET /blogs`).
  - Mentors Directory (`GET /mentors`).
  - Careers & Jobs (`GET /careers`).

---

## 🛠️ Setup & Execution

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment (`.env`):**
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   COOKIE_EXPIRE=7

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # SMTP Email
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_app_password

   # AI (Google Gemini)
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Run Server:**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

---

## 📝 License
Proprietary — NovaEdge Academy.
