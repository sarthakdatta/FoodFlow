import { SignUp } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // Import shadcn/ui Card components
import { Button } from "@/components/ui/button"; // Import shadcn/ui Button
import Link from "next/link"; // For navigation

export default function Page() {
  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto flex justify-center items-center min-h-screen ">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold text-white">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-white text-md">
            Join us to unlock exclusive features and start your journey today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Clerk SignUp Component */}
          <SignUp forceRedirectUrl="/subscribe" />

         
        </CardContent>
      </Card>
    </div>
  );
}