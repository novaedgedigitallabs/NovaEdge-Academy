export const DOCS_NAV = [
  {
    title: "Getting Started",
    items: [
      { id: "overview", title: "Platform Overview", href: "/getting-started/overview" },
      { id: "quickstart", title: "Quick Start Guide", href: "/getting-started/quickstart" },
      { id: "authentication", title: "Authentication & OAuth 2.0", href: "/getting-started/authentication" },
    ],
  },
  {
    title: "Core Features",
    items: [
      { id: "courses", title: "Courses & Video Lectures", href: "/features/courses" },
      { id: "quizzes", title: "Interactive Quizzes & Code", href: "/features/quizzes" },
      { id: "certificates", title: "Certificates & QR Verification", href: "/features/certificates" },
      { id: "mentorship", title: "1-on-1 Mentorship Sessions", href: "/features/mentorship" },
      { id: "community", title: "Community Feed & Posts", href: "/features/community" },
      { id: "messaging", title: "Messages & NovaEdge AI", href: "/features/messaging" },
    ],
  },
  {
    title: "REST API Reference",
    items: [
      { id: "api-auth", title: "Authentication & Headers", href: "/api-reference/authentication" },
      { id: "api-users", title: "Users & Profiles Endpoint", href: "/api-reference/users" },
      { id: "api-courses", title: "Courses & Enrollment API", href: "/api-reference/courses" },
      { id: "api-certificates", title: "Certificates Verification API", href: "/api-reference/certificates" },
    ],
  },
  {
    title: "SDKs & Open Source",
    items: [
      { id: "citykit", title: "@novaedgedigitallabs/citykit", href: "/sdks/citykit" },
      { id: "envkit", title: "@novaedgedigitallabs/envkit", href: "/sdks/envkit" },
    ],
  },
];

export const DOCS_ARTICLES = {
  "getting-started/overview": {
    title: "NovaEdge Academy Platform Overview",
    description: "Learn about NovaEdge Academy's next-generation tech learning ecosystem, AI assistant, and certification network.",
    badge: "v1.0",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        content: `NovaEdge Academy is an enterprise-grade online learning platform designed to bridge the gap between academic learning and high-impact tech careers.

Key pillars of NovaEdge Academy:
- **Structured Video Courses & Labs**: Interactive courses in Fullstack Development, AI/LLM Engineering, System Design, and UI/UX.
- **Automated Grading & Quizzes**: Instant feedback on coding assignments and multiple-choice quizzes.
- **LinkedIn-Verifiable Certificates**: Cryptographically signed certificates with QR code verification.
- **1-on-1 Mentorship**: Direct booking with industry leaders from Google, Microsoft, OpenAI, Airbnb, and Spotify.
- **Integrated AI Learning Assistant**: Real-time AI chat support tagged via \`@NovaEdge Academy\`.`,
      },
      {
        id: "architecture",
        title: "System Architecture",
        content: `NovaEdge Academy operates on a decoupled modern architecture:
1. **Frontend Application**: Next.js 16 (App Router), Tailwind CSS, Framer Motion, deployed at \`https://novaedgeacademy.in\`.
2. **Documentation Portal**: Next.js Docs Engine deployed at \`https://doc.novaedgeacademy.in\`.
3. **Backend API Services**: Node.js, Express, MongoDB Atlas, Cloudinary Media Engine, Razorpay Payments, and Gemini/OpenRouter AI.`,
      },
    ],
  },
  "getting-started/quickstart": {
    title: "Quick Start Guide",
    description: "Get up and running with your NovaEdge Academy account in less than 2 minutes.",
    badge: "Getting Started",
    sections: [
      {
        id: "create-account",
        title: "1. Account Registration",
        content: `You can create a free student account using either:
- **Standard Email & Password Registration**
- **One-Click Google Sign-In** (OAuth 2.0)`,
        code: `// Example: Creating an account via REST API
fetch("https://novaedgeacademy.in/api/v1/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "SecurePassword123!",
    username: "alexjohnson"
  })
});`,
      },
      {
        id: "enroll-first-course",
        title: "2. Enroll in Your First Course",
        content: `Navigate to the **Explore Courses** tab (\`/courses\`) and click on any course. Click **Enroll Now** to add the course to **My Learning** (\`/enrollments\`).`,
      },
    ],
  },
  "getting-started/authentication": {
    title: "Authentication & OAuth 2.0",
    description: "Understanding JWT session tokens, Google OAuth 2.0, and two-factor authentication (2FA).",
    badge: "Security",
    sections: [
      {
        id: "jwt-sessions",
        title: "JWT Cookie Sessions",
        content: `NovaEdge Academy uses HTTP-Only, Secure JWT cookies for authenticating API requests across frontend and backend microservices.`,
        code: `// Verified response headers on login
Set-Cookie: token=eyJhbGciOiJIUzI1Ni...; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`,
      },
      {
        id: "google-auth",
        title: "Google OAuth 2.0 Integration",
        content: `Google Sign-In utilizes Google Identity Services SDK (\`https://accounts.google.com/gsi/client\`). The backend verifies the credential ID token directly with Google's tokeninfo API.`,
        code: `// Backend verification endpoint
POST /api/v1/google-login
Payload: { "credential": "GOOGLE_ID_TOKEN_STRING" }`,
      },
    ],
  },
  "features/courses": {
    title: "Courses & Video Lectures",
    description: "Comprehensive guides on video playback, lecture progress tracking, and exercise files.",
    badge: "Learning",
    sections: [
      {
        id: "video-player",
        title: "HD Video Player & Progress Tracking",
        content: `Every course features modular video lectures with automatic progress persistence. Completed lectures earn green checkmarks in the sidebar course outline.`,
      },
    ],
  },
  "features/quizzes": {
    title: "Interactive Quizzes & Code Assignments",
    description: "Automated grading system and instant AI explanation for incorrect options.",
    badge: "Assessment",
    sections: [
      {
        id: "quiz-engine",
        title: "Automated Quiz Engine",
        content: `Quizzes test student comprehension after key lectures. Every option contains AI-generated explanations to help students understand why an answer is correct or incorrect.`,
      },
    ],
  },
  "features/certificates": {
    title: "Certificates & QR Verification",
    description: "Cryptographically verified completion certificates with instant LinkedIn share integration.",
    badge: "Certification",
    sections: [
      {
        id: "verification-qr",
        title: "QR Code Verification System",
        content: `Each certificate issued by NovaEdge Academy contains a unique certificate ID and embedded QR code pointing to \`https://novaedgeacademy.in/certificate/[ID]\`.`,
        code: `// Certificate Verification Endpoint
GET /api/v1/certificates/verify/:certificateId`,
      },
    ],
  },
  "features/mentorship": {
    title: "1-on-1 Mentorship Booking",
    description: "Schedule 1-on-1 calls with industry mentors, review code, and get career advice.",
    badge: "Mentorship",
    sections: [
      {
        id: "booking-flow",
        title: "Booking a 1-on-1 Call",
        content: `Students can select available time slots and topics (Code Review, System Design, Portfolio Review) to book sessions with verified industry mentors.`,
      },
    ],
  },
  "features/community": {
    title: "Community Feed & Posts",
    description: "Share project updates, code snippets, location tags, and engage with fellow learners.",
    badge: "Social",
    sections: [
      {
        id: "post-creation",
        title: "Interactive Posts & Reactions",
        content: `Create posts with image attachments, polls, location tags via CityKit, and custom tags. Like, comment, and bookmark posts across the community.`,
      },
    ],
  },
  "features/messaging": {
    title: "Messages & NovaEdge AI Assistant",
    description: "Direct messaging between friends and inline AI tagging using @NovaEdge Academy.",
    badge: "AI & Chat",
    sections: [
      {
        id: "ai-mention",
        title: "Tagging NovaEdge AI in Chat",
        content: `Tag \`@NovaEdge Academy\` in any chat message to get instant AI assistance directly inside your conversation!`,
        code: `@NovaEdge Academy Explain how binary search works in Python.`,
      },
    ],
  },
  "api-reference/authentication": {
    title: "REST API Authentication",
    description: "How to authenticate requests to the NovaEdge Academy API.",
    badge: "API v1",
    sections: [
      {
        id: "headers",
        title: "Request Headers",
        content: `All API requests require appropriate Content-Type headers and Cookie headers when calling protected endpoints.`,
        code: `GET /api/v1/me
Host: novaedgeacademy.in
Content-Type: application/json
Cookie: token=YOUR_JWT_TOKEN`,
      },
    ],
  },
  "api-reference/users": {
    title: "Users & Profiles Endpoint",
    description: "Retrieve public profiles, search users, and manage friendships.",
    badge: "API v1",
    sections: [
      {
        id: "get-profile",
        title: "Get User Profile",
        content: `Fetch public profile details by username or user ID.`,
        code: `GET /api/v1/user/:id
Response:
{
  "success": true,
  "user": {
    "_id": "6791...a1",
    "name": "Prince Kashyap",
    "username": "princeKashyap",
    "role": "student",
    "avatar": { "url": "https://res.cloudinary..." }
  }
}`,
      },
    ],
  },
  "api-reference/courses": {
    title: "Courses & Enrollment API",
    description: "Query available courses, lectures, and student enrollment status.",
    badge: "API v1",
    sections: [
      {
        id: "list-courses",
        title: "List Courses",
        content: `Query published courses with search and category filters.`,
        code: `GET /api/v1/courses?search=React&category=Development&page=1`,
      },
    ],
  },
  "api-reference/certificates": {
    title: "Certificates Verification API",
    description: "Verify certificate authenticity by ID.",
    badge: "API v1",
    sections: [
      {
        id: "verify-cert",
        title: "Verify Certificate",
        content: `Public endpoint to verify certificate details and recipient name.`,
        code: `GET /api/v1/certificate/verify/CERT-982314`,
      },
    ],
  },
  "sdks/citykit": {
    title: "@novaedgedigitallabs/citykit",
    description: "Official NPM package for IP-based geo-location, city lookup, and maps integration.",
    badge: "NPM Package",
    sections: [
      {
        id: "installation",
        title: "Installation & Usage",
        content: `CityKit provides instant city, country, and coordinate resolution for web applications.`,
        code: `pnpm add @novaedgedigitallabs/citykit

import { getCityFromIP } from "@novaedgedigitallabs/citykit";

const location = await getCityFromIP("103.21.124.5");
console.log(location); // { city: "Lalitpur", state: "Uttar Pradesh", country: "India" }`,
      },
    ],
  },
  "sdks/envkit": {
    title: "@novaedgedigitallabs/envkit",
    description: "Type-safe environment variable parser and validator for Node.js and Next.js.",
    badge: "NPM Package",
    sections: [
      {
        id: "installation",
        title: "Installation & Setup",
        content: `EnvKit validates required environment variables at runtime with descriptive error logs.`,
        code: `pnpm add @novaedgedigitallabs/envkit

import { validateEnv } from "@novaedgedigitallabs/envkit";

validateEnv({
  MONGO_URI: { required: true },
  JWT_SECRET: { required: true, minLength: 32 }
});`,
      },
    ],
  },
};
