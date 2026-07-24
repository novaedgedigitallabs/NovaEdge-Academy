# NovaEdge Academy — Flutter App: Project Plan

Backend: `novaedge-backend` (Node/Express + MongoDB), reused as-is.
API base (prod): `https://novaedgeacademy-backend.vercel.app/api/v1`
Frontend: Flutter (Android first, then iOS), Riverpod, scratch build.
Timeline: Phase 1 MVP ~3–4 weeks.

---

## Phase 0 — Foundation (Done)

- [x] Project scaffold: folder structure, pubspec.yaml, theme (design.md tokens)
- [x] Network layer: Dio client + Bearer token interceptor + secure storage
- [x] Auth: login, 2FA, Google login, register, me, logout — repository + Riverpod state
- [x] Routing: go_router with auth-guard redirect
- [x] Login screen UI

---

## Phase 1 — Core Learning Experience (MVP)

### 1. Course Catalog
- `GET /courses` — list with search/filter (category, level, price)
- `GET /course/:id` — detail page
- `GET /search` — full-text search
- Guest browsing allowed (no login needed for listing/detail)
- Screens: catalog grid, filters, course detail, free vs paid badge

### 2. Video Player
- YouTube embed (`youtube_player_flutter`) for YouTube-hosted lectures
- Cloudinary streaming (`video_player` + `chewie`) for direct-hosted videos
- Lecture list with PDF notes attachment link, AI summary display

### 3. Progress Tracking
- `/progress` — send `lastPositionSec`, `watchedDurationSec` on player events
- Resume-from-last-position on re-open
- `percentComplete` shown on course card + detail

### 4. Enrollment & Payments (Razorpay)
- Free courses: `POST /checkout` → `finalAmount <= 0` → auto-enroll, no gateway
- Paid courses: `POST /checkout` → Razorpay order → `razorpay_flutter` SDK →
  `POST /paymentverification` (signature check) → enrollment confirmed
- Coupons: apply code before checkout (`/coupons`)
- My enrollments list / "My Courses" screen

### 5. Profile & Dashboard
- `GET /me` — profile screen, edit basic info
- Enrolled courses with progress bars
- Logout

---

## Phase 2 — Engagement Features

### 6. Quizzes & Assignments
- Lecture-level quizzes + standalone quizzes/assessments
- Assignment submission flow (`/assignments`, `/submissions`)
- Score/result display

### 7. Certificates
- Auto-issued on 100% course completion
- View + download PDF (`certificateId`, QR verification link)

### 8. Notifications
- Firebase Cloud Messaging integration (`firebase_messaging`)
- Types: payment/enrollment confirmation, new lecture, quiz/assignment
  results, mentorship/social (friend requests, chat), system announcements
- In-app notification list (`/notifications`) + push

---

## Phase 3 — Polish & Distribution

- Google Sign-in production config (SHA-1 for Android, URL scheme for iOS)
- App icon, splash screen (assets already available from web project)
- i18n scaffolding for future Hindi support (English/Hinglish for Phase 1)
- Android release build (APK/AAB) → Play Store
- iOS release build (IPA) → App Store
- Subscription plans UI (`/subscriptions`, `models/Plan.js`) — if needed
  for launch, otherwise defer

---

## Out of scope for now

- Offline video download (flagged for a future version — local caching
  strategy e.g. Hive, not part of MVP)
- Admin/mentor/agent role UI (handled entirely by existing web admin panel)
- Razorpay server-side webhook (client-side verification is primary path;
  webhook is a resilience add-on for the backend team, not the app)

---

## Suggested build order (matches priority above)

1. Course catalog + detail
2. Video player + progress tracking
3. Razorpay checkout + enrollment
4. Profile/dashboard + my courses
5. Quizzes/assignments
6. Certificates
7. Notifications
8. Google Sign-in polish + release builds