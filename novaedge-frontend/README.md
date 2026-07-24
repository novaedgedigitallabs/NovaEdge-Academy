# NovaEdge Web Frontend (`novaedge-frontend`)

The responsive web application for the **NovaEdge Academy** EdTech Platform, built with Next.js 16 (App Router), React 19, and Tailwind CSS 4.

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4, CSS Modules
- **UI Components:** Shadcn UI (Radix Primitives), Lucide React
- **Form Handling:** React Hook Form + Zod validation
- **HTTP Client:** Axios (via custom API wrapper)
- **State & Utils:** Date-fns, CLSX, Tailwind Merge

---

## ✨ Features

- **Student Learning Portal:**
  - Course Catalog with search and category filters.
  - Interactive lecture player with downloadable notes and curriculum.
  - AI Assistant for lecture summaries, quizzes, and instant Q&A.
  - My Learning dashboard & profile management.

- **Community & Social:**
  - Community Feed for creating, liking, and commenting on posts.
  - Direct messaging and friends network.
  - Public student profile pages with badge achievements and certificates.

- **Instructor & Mentor Portal:**
  - Course creation & lecture management.
  - Student progress monitoring and assignment grading.

- **Admin Panel (`/admin`):**
  - Platform analytics dashboard (users, enrollments, sales).
  - User management, course approvals, content moderation, support ticket queues, and audit logs.

---

## 🛠️ Setup & Execution

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables (`.env.local`):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 License
Proprietary — NovaEdge Academy.
