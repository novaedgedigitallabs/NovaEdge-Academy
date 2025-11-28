# NovaEdge Frontend

The frontend application for the NovaEdge Academy LMS. Built with Next.js 14, Tailwind CSS, and Shadcn UI, it delivers a modern, responsive, and immersive learning experience.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript / React
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI, Radix UI
- **Icons:** Lucide React
- **State Management:** React Context / Hooks
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios (via custom API wrapper)
- **Theming:** next-themes (Dark/Light mode)

## ✨ Features

- **Modern UI/UX:**
  - Dark/Light Mode Toggle
  - Responsive Design for all devices
  - Glassmorphism and premium aesthetics

- **Student Portal:**
  - Course Catalog with Search & Filtering
  - Detailed Course Landing Pages
  - "My Learning" Dashboard
  - Interactive Video Player
  - Profile Management

- **Mentor Dashboard:**
  - Course Creation & Management
  - Student Progress Views
  - Assignment Grading
  - Q&A Management

- **Admin Panel:**
  - User & Mentor Management
  - Course Approval & Editing
  - System-wide Settings

- **Authentication:**
  - Secure Login & Registration
  - Protected Routes
  - Session Management

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd novaedge-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add the following:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
  - `(auth)/`: Authentication routes (login, register).
  - `admin/`: Admin dashboard routes.
  - `mentor/`: Mentor dashboard routes.
  - `courses/`: Course browsing and viewing routes.
- `components/`: Reusable UI components (buttons, inputs, cards).
- `lib/`: Utility functions and API configuration (`api.js`).
- `services/`: API service functions organized by feature (auth, courses, etc.).
- `hooks/`: Custom React hooks.
- `context/`: Global state providers.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
