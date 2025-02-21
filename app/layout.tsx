import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import NavBar from "../components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryClientProvider } from "../components/react-query-client-provider";
import CreateProfileOnSignIn from "@/components/create-profile";
import clsx from "clsx";
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "AI Meal Plans | Simple SaaS Demo",
  description: "Generate personalized meal plans with OpenAI",

};

const outfit = Outfit({ subsets: ['latin'] })
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
