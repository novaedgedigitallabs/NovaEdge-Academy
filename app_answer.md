# NovaEdge Academy — Mobile App Questionnaire Answers

This document contains detailed answers to the questionnaire in [`app_questions.md`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/app_questions.md), verified directly against the NovaEdge Academy backend (`novaedge-backend`) and frontend (`novaedge-frontend`) codebase.

---

## 1. Auth & Backend

### 1. Backend auth kaise kaam karta hai — NextAuth (cookie/session), custom JWT (Bearer token), ya Firebase Auth?
- **Answer:** **Custom JWT-based Authentication** configured hai.
  - Token creation `jwtToken.js` mein handles session tracking in MongoDB (`Session` model) and returns JWT.
  - Auth Middleware ([`middleware/auth.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/middleware/auth.js#L8-L12)) supports **BOTH**:
    1. HTTP Cookies (`req.cookies.token`)
    2. HTTP Authorization Header (`Authorization: Bearer <token>`)
  - Flutter Mobile App standard `Authorization: Bearer <JWT_TOKEN>` header bhej kar secure endpoints access karegi.

### 2. Login kis se hota hai — email/password, phone OTP, Google sign-in, ya multiple?
- **Answer:** **Multiple Login Options Ready Hain:**
  - Email / Password (aur Username / Password) login (`POST /api/v1/login`)
  - Google Sign-in (`POST /api/v1/google-login`)
  - 2-Factor Authentication (2FA) support (`/api/v1/2fa`)
  - *Note:* User model mein `phoneNumber` field store hoti hai, but SMS OTP service currently default backend default route nahi hai; primary methods Email/Password + Google Login hain.

### 3. Backend repo access mil sakta hai (GitHub) taaki main actual API routes dekh sakoon?
- **Answer:** Repo local workspace mein complete present hai:
  - Backend path: [`novaedge-backend`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend)
  - All endpoints standard structured hain under `/api/v1/*` (Auth, Courses, Payments, Enrollments, Progress, Certificates, etc.).

### 4. API base URL kya hai (prod aur agar staging bhi hai to wo)?
- **Answer:**
  - **Production API Base URL:** `https://novaedgeacademy-backend.vercel.app/api/v1`
  - **Local / Development API Base URL:** `http://localhost:5000/api/v1` (or local IP e.g. `http://192.168.x.x:5000/api/v1`)

### 5. Existing API mein mobile clients ke liye already CORS/token support hai, ya ye add karna padega?
- **Answer:** **Already 100% Ready:**
  - **CORS:** [`server.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/server.js#L48-L53) origin filter check karta hai `if (!origin) return callback(null, true);`, jo cross-origin / mobile apps (Flutter, React Native) and curl requests pass karta hai.
  - **Bearer Token:** [`middleware/auth.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/middleware/auth.js#L10-L12) Bearer token parse karta hai header se (`req.headers.authorization.split(" ")[1]`).

---

## 2. Users & Roles

### 6. App sirf students ke liye hai, ya instructor/admin bhi app se access karenge?
- **Answer:** **Primary Focus Students (Users) ke liye hai.**
  - Backend role support: `["user", "admin", "mentor", "agent"]` ([`models/User.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/User.js#L67-L70)).
  - Administrative operations complete Web Admin Panel (`/admin`) se run hote hain. Mobile app primarily Student learning dashboard, course catalog, streaming, quizzes, community feed aur progress tracking handle karegi.

### 7. Free courses bhi hain ya sab paid hain?
- **Answer:** **Dono (Free + Paid) Supported Hain.**
  - [`models/Course.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Course.js#L55-L58) price field zero (`price: 0`) default allow karta hai.
  - Checkout controller (`/checkout`) `finalAmount <= 0` detect karke zero-cost automatic free enrollment create karta hai without opening payment gateway.

### 8. Guest browsing allowed hai (bina login courses dekh sakte ho) ya login mandatory hai entry pe?
- **Answer:** **Guest Browsing Allowed Hai.**
  - Courses list (`GET /api/v1/courses`), course details (`GET /api/v1/course/:id`), public profile, blogs, testimonials public APIs hain.
  - Course purchase/enrollment, video player progress, quiz attempt, certificate download aur community posts create karne ke liye login required hota hai.

---

## 3. Courses & Content

### 9. Course structure kaisa hai — sirf videos, ya modules/lessons/quizzes/assignments bhi hain?
- **Answer:** **Rich Curriculum Structure:**
  - Courses -> Lectures/Videos (Title, description, video URL, duration, PDF notes attachment, AI summaries).
  - Lecture-level Quizzes ([`Course.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Course.js#L124-L130)).
  - Standalone Quizzes & Assessments ([`models/Quiz.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Quiz.js), [`models/Assessment.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Assessment.js)).
  - Assignments & Submissions ([`models/Assignment.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Assignment.js), [`models/Submission.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Submission.js)).

### 10. Video progress tracking chahiye (kahan tak dekha, resume from there)?
- **Answer:** **Haan, Backend Model Fully Built Hai.**
  - [`models/Progress.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Progress.js) stores:
    - `lastPositionSec` (Resume position in seconds)
    - `watchedDurationSec`
    - `completed` (Boolean flag)
    - `percentComplete` (0 to 100%)

### 11. Downloadable/offline video access chahiye ya sirf streaming?
- **Answer:** Currently **Online Video Streaming** (YouTube embed / Cloudinary URL) active implementation hai. Offline DRM/downloading mobile app local storage strategy (e.g. Flutter Video caching/Hive) se handle kar sakte hain if required in future versions.

### 12. Certificates milte hain course complete karne pe? Agar haan, app se generate/download hona chahiye?
- **Answer:** **Haan, Certificate Automated System Configured Hai.**
  - 100% course completion detect hote hi unique `certificateId` and PDF ([`models/Certificate.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Certificate.js)) Cloudinary link create hota hai with verification QR code.
  - App se directly PDF View and Download trigger ho sakta hai via `pdfUrl`.

### 13. Course search aur filter (category, level, price) chahiye?
- **Answer:** **Haan.** Backend endpoints `/api/v1/courses` and `/api/v1/search` full-text search index and filters support karte hain for Categories (*App Dev, Full Stack, DSA, UI/UX, etc.*), Levels (*Beginner, Intermediate, Advanced*), and Price ranges.

---

## 4. Payments (Razorpay)

### 14. Website pe Razorpay integration kaise hai — Razorpay Checkout (web) ya custom order flow with backend verification?
- **Answer:** **Custom Order Flow + Signature Verification:**
  1. Client calls `POST /api/v1/checkout` -> Backend Razorpay Order object (`order_id`) create karta hai.
  2. Mobile App Razorpay Flutter SDK open karegi with `order_id` & `RAZORPAY_KEY_ID`.
  3. Payment complete hone par Razorpay SDK return karta hai: `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
  4. Client calls `POST /api/v1/paymentverification` -> Backend HMAC SHA256 signature verify karke payment record save aur course enroll karta hai.

### 15. One-time course purchase, ya subscription plans bhi hain?
- **Answer:** **Dono Supported Hain:**
  - One-time course purchases (Primary checkout pipeline via Razorpay Order).
  - Subscription Plans & Recurring access system ([`models/Subscription.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Subscription.js), [`models/Plan.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Plan.js)).

### 16. Coupons/discount codes support chahiye?
- **Answer:** **Haan, Full Coupon Engine Configured Hai.**
  - [`models/Coupon.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Coupon.js) & [`controllers/payment.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/controllers/payment.js#L30-L56) handle percentage & fixed amount discounts, expiry dates, usage counts, minimum order requirements, and user wallet balance redemptions.

### 17. Payment success ke baad backend webhook hai jo enrollment update karta hai, ya frontend hi confirm karta hai?
- **Answer:** Currently **Client verification call (`POST /api/v1/paymentverification`)** enrollment, invoice generation, wallet deduction, aur referral bonus process karti hai. Additional Razorpay Server Webhook fallback easily server environment me connect ho sakta hai for extra resilience.

---

## 5. Notifications

### 18. Push notifications ke liye Firebase already kahin use ho raha hai (web push wagera)?
- **Answer:** Backend Schema mein `notificationPreferences` (`push: true/false`) and [`models/Notification.js`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/novaedge-backend/models/Notification.js) included hai. Firebase Admin SDK (FCM) Flutter Mobile App release setup ke saath backend triggers par easily bind ki ja sakti hai.

### 19. Notification types kya honge — new course launch, payment confirmation, course reminders, admin announcements?
- **Answer:** Notification system supports:
  - Payment & Enrollment Confirmations (Invoices currently email bhi hote hain)
  - Course content / New lecture updates
  - Quiz & Assignment evaluations
  - Mentorship sessions & Social interactions (Friend requests, Chat messages)
  - System Announcements

---

## 6. Design & Branding

### 20. App icon, splash screen, aur logo assets ready hain?
- **Answer:** **Assets Ready Hain.** Logo PNG/SVG files and design assets repository public directory and documentation assets mein structured hain. Mobile build ke liye export/icon scaling process follow ki ja sakti hai.

### 21. DESIGN.md ka purple/cyan/gold theme hi mobile pe follow karna hai, ya mobile-specific adjustments chahiye?
- **Answer:** **Same Dark Premium EdTech Aesthetics Follow Hoga ([`design.md`](file:///home/amit/old_data/Development/myProject/novaedgeacademy-in/design.md)):**
  - **Backgrounds:** `#08080E` (Base), `#0E0E18` (Cards/Panels), `#141420` (Elevated)
  - **Primary Brand:** `#9333EA` (Electric Purple)
  - **Learning & Progress:** `#06B6D4` (Cyan)
  - **Gamification & Certificates:** `#F59E0B` (Gold)
  - Clean modern typography with micro-animations & smooth contrast.

---

## 7. Platforms & Distribution

### 22. Android only pehle, ya Android + iOS dono saath mein?
- **Answer:** Flutter framework single codebase se **Android (APK/AAB) + iOS (IPA)** produce karega. Initial deployment focus Android Play Store APK/AAB builds, followed by iOS App Store build.

### 23. Play Store/App Store developer accounts ready hain?
- **Answer:** Admin developer accounts target status (Confirm from owner/admin).

### 24. App ka target release timeline kya hai (rough estimate)?
- **Answer:** **Phase 1 MVP (Core Catalog, Auth, Video Player, Razorpay Payments, User Dashboard, Progress & Certificates):** ~3 to 4 Weeks estimated timeline.

---

## 8. Misc

### 25. Multi-language support chahiye (Hindi/English) ya English only?
- **Answer:** **Phase 1: English & Hinglish (Primary).** App architecture mein i18n localization support prepare rakhi jayegi taaki Future Phase mein Hindi language translation toggle easily integrate ho sake.

### 26. Dark mode chahiye?
- **Answer:** **Default Theme ही Dark Premium Mode Hai** as defined in `design.md`.

### 27. Koi existing Flutter/mobile codebase already hai jisse start karna hai, ya bilkul scratch se?
- **Answer:** **Clean Scratch Setup:** Standard modular Flutter architecture (with Provider/Riverpod/Bloc) setup keya jayega, directly connected to NovaEdge Backend REST APIs (`/api/v1`).
