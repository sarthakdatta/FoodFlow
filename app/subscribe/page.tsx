"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button"; // Import shadcn/ui Button
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"; // Import shadcn/ui Card components
import { Badge } from "@/components/ui/badge"; // Import shadcn/ui Badge

// Define the available plans
const availablePlans = [
  {
    name: "Monthly",
    interval: "month",
    amount: "7.99",
    description: "Perfect for individuals who want flexibility.",
    features: [
      "Exclusive 7-day Free Trial",
      "Access to all meal plans",
      "Weekly recipe updates",
      "Cancel anytime",
    ],
    isPopular: true,
  },
  {
    name: "Yearly",
    interval: "year",
    amount: "99.99",
    description: "Best value for long-term commitment.",
    features: [
      "Exclusive 7-day Free Trial",
      "Access to all meal plans",
      "Weekly recipe updates",
      "Save 4% compared to monthly",
    ],
    isPopular: false,
  },
];
// Define the shape of the successful response
type SubscribeResponse = {
  url: string;
};

// Define the shape of the error response
type SubscribeError = {
  error: string;
};

// API call function to subscribe to a plan
const subscribeToPlan = async ({
  planType,
  userId,
  email,
}: {
  planType: string;
  userId: string;
  email: string;
}): Promise<SubscribeResponse> => {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      planType,
      userId,
      email,
    }),
  });

  if (!res.ok) {
    const errorData: SubscribeError = await res.json();
    throw new Error(errorData.error || "Something went wrong.");
  }

  const data: SubscribeResponse = await res.json();
  return data;
};

export default function SubscribePage() {
  const { user } = useUser(); // Access the current user
  const router = useRouter(); // Next.js router for navigation

  const userId = user?.id;
  const email = user?.emailAddresses?.[0]?.emailAddress || "";

  // React Query's useMutation hook for handling the subscription process
  const mutation = useMutation<SubscribeResponse, Error, { planType: string }>({
    mutationFn: async ({ planType }) => {
      if (!userId) {
        throw new Error("User not signed in.");
      }

      return subscribeToPlan({ planType, userId, email });
    },
    onMutate: () => {
      // Optional: Show a loading toast or similar feedback
      toast.loading("Processing your subscription...", { id: "subscribe" });
    },
    onSuccess: (data) => {
      // Update the toast to success
      toast.success("Redirecting to checkout!", { id: "subscribe" });
      // Redirect to the Stripe Checkout URL
      window.location.href = data.url;
    },
    onError: (error) => {
      // Update the toast to show an error
      toast.error(error.message || "Something went wrong.", {
        id: "subscribe",
      });
    },
  });

  // Handler for subscribing to a plan
  const handleSubscribe = (planType: string) => {
    if (!userId) {
      // Redirect to sign-up if the user is not signed in
      router.push("/sign-up");
      return;
    }

    // Trigger the mutation
    mutation.mutate({ planType });
  };

  return (
    <div className="px-4 py-8 sm:py-12 lg:py-16">
      <Toaster position="top-right" /> {/* Optional: For toast notifications */}
      {/* Section Header */}
      <div>
        <h2 className="text-3xl font-bold text-center mt-6 sm:text-5xl tracking-tight">
          Pricing
        </h2>
        <p className="max-w-3xl mx-auto mt-4 text-xl text-center">
          Choose the plan that works best for you.
        </p>
        <p className="max-w-3xl mx-auto mt-4 text-2xl text-center">
          <b>Sign up now and receive our exclusive 7-day free trial!</b>
        </p>
      </div>
      {/* Cards Container */}
      <div className="mt-12 container mx-auto space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Map over availablePlans to render plan cards */}
        {availablePlans.map((plan, key) => (
          <Card key={key} className="relative hover:scale-105 transition">
            <CardHeader>
              {plan.isPopular && (
                <Badge className="absolute top-0 right-0 m-4 bg-primary text-white">
                  Most Popular
                </Badge>
              )}
              <CardTitle className="text-2xl font-semibold">
                {plan.name}
              </CardTitle>
              <CardDescription className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight text-white">
                  ${plan.amount}
                </span>
                <span className="ml-1 text-xl font-semibold text-white">
                  /{plan.interval}
                </span>
              </CardDescription>
              <p className="mt-6 text-white">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0 w-6 h-6 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="ml-3">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSubscribe(plan.interval)}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Please wait..." : `Subscribe ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}