import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import NavBar from "../components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryClientProvider } from "../components/react-query-client-provider";
import CreateProfileOnSignIn from "@/components/create-profile";
import clsx from "clsx";
import { ThemeProvider } from "@/components/theme-provider";

// Define metadata for SEO
export const metadata: Metadata = {
  title: "AI Meal Plans",
  description: "Generate personalized meal plans with OpenAI using AI-powered tools.",
  keywords: [
    "AI meal plans",
    "personalized meal plans",
    "OpenAI meal planner",
    "healthy eating",
    "meal planning app",
    "easy meal planning",
    "best meal planning app",
    "AI-powered meal planner",
    "healthy recipes",
    "quick and easy recipes",
    "weekly meal planner",
    "meal prep ideas",
    "diet meal plans",
    "custom meal plans",
    "family meal planning",
    "budget meal planning",
    "vegetarian meal plans",
    "vegan meal plans",
    "gluten-free meal plans",
    "low-carb meal plans",
    "meal planning for beginners",
    "how to start meal planning",
    "meal planning tips",
    "meal planning tools",
    "meal planning software",
  ],
  openGraph: {
    title: "AI Meal Plans",
    description: "Generate personalized meal plans with OpenAI using AI-powered tools.",
    url: "https://yourdomain.com",
    siteName: "AI Meal Plans",
    images: [
      {
        url: "https://yourdomain.com/images/logo.png",
        width: 1200,
        height: 630,
        alt: "AI Meal Plans - Personalized Meal Planning",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Meal Plans",
    description: "Generate personalized meal plans with OpenAI using AI-powered tools.",
    images: ["https://yourdomain.com/images/logo.png"],
  },
  icons: {
    icon: "/favicon.ico", 
  },
};


const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(outfit.className, "bg-dark")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryClientProvider>
            <ClerkProvider>
              <CreateProfileOnSignIn />
              <NavBar />
              {/* Main container for page content */}
              <main className="max-w-7xl mx-auto pt-16 p-4 min-h-screen">
                {children}
              </main>
            </ClerkProvider>
          </ReactQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}