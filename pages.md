# NovaEdge Academy - Frontend Pages & Components Checklist

This document lists all the pages, views, and their essential sub-components that need to be created for the new frontend.

---

## 0. Global / Shared Components
*Components used across multiple pages throughout the application.*
- [ ] **Navbar (Header):** Logo, Global Search Bar, Navigation Links, User Avatar Dropdown, Notifications Bell, Cart Icon.
- [ ] **Footer:** Links, Social Media Icons, Newsletter Signup.
- [ ] **Dashboard Sidebar:** Navigation for Admin and Student panels.
- [ ] **UI Elements:** Buttons, Inputs, Modals/Dialogs, Dropdowns, Tabs, Tooltips, Accordions.
- [ ] **Feedback:** Toast Notifications, Loading Spinners, Skeleton Loaders.
- [ ] **Cards:** Course Card, Mentor Card, Blog Card.

---

## 1. Public Pages (Unauthenticated)
- [ ] **Home Page** (`/`)
  - Hero Banner (Title, Subtitle, CTA)
  - Features/Why Choose Us Section
  - Featured/Trending Courses Carousel
  - Top Mentors Grid
  - Testimonials Slider
  - Call to Action (CTA) Banner
- [ ] **About Us** (`/about`)
  - Mission/Vision Statement
  - Team Members / Founders Grid
  - Platform Stats (Students, Courses, etc.)
- [ ] **Contact Us** (`/contact`)
  - Contact Form (Name, Email, Message)
  - Map / Office Location Details
  - FAQ Accordion
- [ ] **Pricing / Subscriptions** (`/pricing`)
  - Pricing Tables / Tiers (Monthly vs Annual toggle)
  - Plan Feature Comparison List
- [ ] **Careers** (`/careers`)
  - Job Openings List
  - Job Application Modal/Form
- [ ] **NovaEdge for Business** (`/business`)
  - B2B Lead Generation Form
  - Client Logos Carousel

---

## 2. Authentication & Authorization
- [ ] **Login** (`/login`)
  - Email/Password Form
  - Social Login Buttons (Google, GitHub, etc.)
- [ ] **Register / Sign Up** (`/register`)
  - Multi-step Registration Form (Student/Mentor toggle)
- [ ] **Verify Email/OTP** (`/verify`)
  - OTP Input Fields & Resend Button
- [ ] **Two-Factor Authentication (2FA)** 
  - QR Code display & Code Verification Input
- [ ] **Forgot / Reset Password**
  - Email Input Form -> New Password Form

---

## 3. Course Discovery & Browsing
- [ ] **Course Catalog / Search** (`/courses`, `/search`)
  - Advanced Filters Sidebar (Category, Price, Level, Rating)
  - Search Results Grid/List toggle
  - Pagination / Load More
- [ ] **Course Details Page** (`/courses/[id]`)
  - Course Header (Title, Rating, Instructor, Price, Intro Video)
  - Course Curriculum / Syllabus Accordion
  - Instructor Bio Section
  - Reviews & Ratings List
  - "Add to Cart" / "Enroll Now" Sticky Bar
- [ ] **Learning Paths** (`/learning-paths`)
  - Roadmap / Flowchart View of courses
- [ ] **Mentor Directory** (`/mentors`)
  - Mentor Filter & Search
- [ ] **Mentor Profile** (`/mentor/[id]`)
  - Mentor Bio & Stats
  - Courses Taught by Mentor Grid
  - Session Booking Calendar Component

---

## 4. E-Commerce & Checkout
- [ ] **Cart / Checkout** (`/checkout`)
  - Order Summary List
  - Billing Address Form
  - Apply Coupon Code Input
- [ ] **Payment Processing** (`/payment`)
  - Stripe / Razorpay Integration Modal
  - Payment Success / Failure Screen
- [ ] **Subscription Plans Management** (`/subscription`)
  - Active Plan Details Card
  - Upgrade/Cancel Subscription Buttons

---

## 5. User / Student Dashboard (Authenticated)
- [ ] **Student Dashboard** (`/user/dashboard`)
  - Progress Overview Widgets (Hours watched, Courses completed)
  - "Continue Learning" Widget
  - Upcoming Assignments/Classes Widget
- [ ] **My Enrollments / My Courses** (`/enrollments`)
  - Enrolled Courses Grid with Progress Bars
- [ ] **My Profile** (`/profile`) & **Settings** (`/settings`)
  - Edit Profile Form (Avatar upload, Bio, Links)
  - Change Password Form
  - Active Sessions Management (Logout from other devices)
- [ ] **Referrals & Rewards** (`/referrals`)
  - Referral Link Generator & Copy Button
  - Rewards Points Display
- [ ] **My Certificates & Badges** (`/certificate`)
  - Download/Share Certificate Button
  - Earned Badges Grid
- [ ] **Purchase History / Invoices**
  - Transaction List Table & Download Invoice

---

## 6. Learning Experience (LMS Player)
- [ ] **Course Video Player / Lecture View**
  - Video Player Component (Play, Pause, Speed, Quality)
  - Sidebar Playlist / Curriculum Navigation
  - Lecture Transcripts Tab
  - Course Notes Editor Tab (Markdown editor)
- [ ] **Assignments & Quizzes**
  - Quiz Interface (Multiple choice, Timers, Submit)
  - Assignment File Upload Dropzone
- [ ] **Course Discussions / Q&A**
  - Q&A Thread List
  - Post Question / Reply Form
- [ ] **Live Classes**
  - Zoom/WebRTC Embed Component
  - Live Chat Component

---

## 7. Community & Social Features
- [ ] **Community Feed** (`/community`)
  - Create Post Form (Text, Image, Code snippet)
  - Feed / Timeline of Posts
  - Post Interaction (Like, Comment, Share)
- [ ] **Network / Friends List** (`/network`)
  - Friend Requests Tab
  - Suggested Connections
- [ ] **Messaging / Chat** (`/messages`)
  - Chat List Sidebar
  - Chat Window (Message bubbles, Attachments)
- [ ] **Notifications Dropdown/Page**
  - Grouped Notifications List (Unread/Read)

---

## 8. Admin Dashboard (`/admin/*`)
- [ ] **Admin Overview Dashboard** (`/admin/dashboard`)
  - Revenue & User Analytics Charts (Line, Bar, Pie)
  - Recent Activity Feed
- [ ] **Data Management Pages** (Users, Courses, Mentors, Blogs, etc.)
  - Advanced Data Table (Sort, Filter, Pagination, Bulk Actions)
  - Add/Edit Entity Modal Form (e.g., Add new User, Edit Course)
  - Delete Confirmation Dialog
- [ ] **System Audit Logs** (`/admin/audit`)
  - Activity Log Table

---

## 9. Content & Marketing
- [ ] **Blog Listing** (`/blog`)
  - Category Pills
  - Featured Post Layout
- [ ] **Blog Post Details** (`/blog/[slug]`)
  - Rich Text Content Renderer
  - Author Bio & Share Buttons
  - Comments Section

## 10. Miscellaneous Utilities
- [ ] **File / Drive Upload UI** (`/drive-upload`)
  - Drag & Drop File Manager
- [ ] **404 Not Found & 500 Error Pages**
  - Fun Illustration & "Go Back Home" Button
