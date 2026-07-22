import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import ShellLayout from "@/components/layout/ShellLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NovaEdge Academy",
  description: "Learn Cloud Computing, DevOps, and more with NovaEdge Academy.",
  icons: {
    icon: [
      { url: "/logo.webp", type: "image/webp" },
    ],
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.webp" type="image/webp" sizes="any" />
        <link rel="shortcut icon" href="/logo.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/logo.webp" />
      </head>
      <body
        cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} antialiased app-glow-bg`}
      >
        <Providers>
          <ShellLayout>
            {children}
          </ShellLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
