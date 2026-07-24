# NovaEdge Academy — Flutter Mobile Application (`novaedge-app`)

The official cross-platform mobile application for the **NovaEdge Academy** EdTech Platform, built with Flutter, Riverpod, and Dio. Designed with a **Dark Academic Premium** aesthetic for seamless, high-performance mobile learning.

---

## 🎨 Design System & Aesthetic

- **Background Base:** `#08080E` (Obsidian Dark)
- **Surface Elevation:** `#0E0E18` (Card Surface)
- **Primary Brand Color:** `#9333EA` (Electric Purple)
- **Secondary Accent:** `#06B6D4` (Cyan Glow)
- **Accent Gold:** `#F59E0B` (Certificates & Star Ratings)
- **Typography:** Modern Google Fonts (Inter / Outfit)

---

## 🚀 Tech Stack & Libraries

- **Framework:** Flutter 3.35.7 (Dart 3.x)
- **State Management:** Flutter Riverpod (`flutter_riverpod: ^2.6.1`)
- **Navigation:** GoRouter (`go_router: ^14.8.0`)
- **HTTP Client:** Dio (`dio: ^5.8.0+1`) with custom `AuthInterceptor`
- **Secure Token Persistence:** `flutter_secure_storage: ^9.2.4`
- **Dual Video Player Engine:**
  - `youtube_player_flutter: ^9.1.1` (YouTube video embeds)
  - `chewie: ^1.8.5` + `video_player: ^2.9.2` (Cloudinary MP4 streams)
- **Payment Gateway:** Razorpay Flutter SDK (`razorpay_flutter: ^1.3.7`)
- **Image Caching & Utilities:** `cached_network_image`, `intl`, `url_launcher`

---

## ✨ Features Breakdown

1. **Authentication & Session:**
   - Login & Registration screens with form validation.
   - Edit Profile screen (`PUT /api/v1/me/update`) to update Name, Username, and Avatar.
   - Automatic Bearer JWT token injection on HTTP requests.

2. **Course Catalog & Player:**
   - Catalog browsing with category chips, search bar, level chips, and price badges.
   - Course detail view featuring curriculum list, tech stack, downloadable PDF notes, and AI summaries.
   - Dual Video Player automatically switching between YouTube and Cloudinary MP4 streams.
   - Real-time video progress sync (`/api/v1/progress/:courseId`).

3. **Payments & Enrollment:**
   - Razorpay Checkout SDK integration.
   - Coupon verification and zero-price free auto-enrollment.
   - My Courses dashboard tracking completion progress.

4. **Engagement & Community:**
   - **Certificates:** Earned PDF certificates view & download with verification QR code.
   - **Notifications:** In-app alert center with "Mark All Read" action.
   - **Wishlist:** Favorite courses heart toggle on catalog cards and detail screens.
   - **Reviews & Ratings:** Student review list and interactive "Write a Review" modal dialog.
   - **Community Feed:** Discussion tab for asking questions, publishing posts, and liking content.
   - **Blogs, Mentors & Careers:** Dedicated screens for platform articles, expert instructors directory, and tech job openings.

---

## 📂 Project Directory Structure

```
lib/
├── core/
│   ├── constants/        # ApiEndpoints definitions
│   ├── network/          # ApiClient & AuthInterceptor (Dio)
│   ├── router/           # AppRouter (GoRouter setup)
│   ├── storage/          # TokenStorage (flutter_secure_storage)
│   └── theme/            # AppColors & AppTheme (Dark Academic tokens)
│
└── features/
    ├── auth/             # Login, Register, UserModel, AuthRepository, AuthController
    ├── blogs/            # BlogsScreen, BlogModel, BlogRepository
    ├── careers/          # CareersScreen, CareerModel, CareerRepository
    ├── certificates/     # CertificatesScreen, CertificateModel, CertificateRepository
    ├── community/        # CommunityScreen, PostModel, CommunityRepository
    ├── courses/          # CatalogScreen, CourseDetailScreen, PlayerScreen, CourseModel, CourseRepository
    ├── main_layout/      # MainScreen (4-Tab Bottom Navigation)
    ├── mentors/          # MentorsScreen, MentorModel, MentorRepository
    ├── notifications/    # NotificationsScreen, NotificationModel, NotificationRepository
    ├── payment/          # CheckoutScreen, PaymentRepository, PaymentController
    ├── profile/          # ProfileScreen, EditProfileScreen, MyCoursesScreen
    ├── reviews/          # ReviewModel, ReviewRepository, ReviewController
    └── wishlist/         # WishlistScreen, WishlistNotifier, WishlistRepository
```

---

## 🛠️ Setup & Running Instructions

### 1. Prerequisites
- Flutter SDK (v3.35.7+)
- Android Studio / VS Code with Flutter extension
- Connected Android/iOS device or emulator

### 2. Install Dependencies
```bash
flutter pub get
```

### 3. Run Analysis & Tests
```bash
# Check static code analysis (0 errors expected)
flutter analyze

# Run unit tests (100% pass expected)
flutter test test/unit_test.dart
```

### 4. Launch Application
```bash
flutter run
```

---

## 📝 License
Proprietary — NovaEdge Academy EdTech.
