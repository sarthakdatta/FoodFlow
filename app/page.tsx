"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, User, Settings, ArrowRight, Check, Phone, Mail } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                AI-Powered Meal Planning
                <span className="block text-primary mt-2">
                  Healthy. Delicious. Effortless.
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Get a personalized meal plan in just seconds. Enter your preferences 
                and goals, then let our AI create your perfect menu.
              </p>
              <div className="flex gap-4">
                <Link href="/sign-up">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg hover:scale-105 transition">
                    Start Planning Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
                <Image
                  src="/examplescreen.png"
                  width={800}
                  height={600}
                  alt="FoodFlow Example"
                  className="object-cover w-full"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Our Platform
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transform your meal planning experience with our AI-powered solution
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-primary/10 p-3">
                <Check className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Personalized Meal Plans</h3>
              <p className="text-gray-400">Tailored to your diet, allergies, and macros.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-primary/10 p-3">
                <Check className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Generated Recipes</h3>
              <p className="text-gray-400">Quick, healthy meals from healthy ingredients!</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-primary/10 p-3">
                <Check className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Saves Time & Money</h3>
              <p className="text-gray-400">Speeds up almost 16% of time spent cooking in the kitchen.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 bg-gray-900/50 mt-11">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join our growing community of healthy eaters
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 text-center">

          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">4.8/5</div>
            <p className="text-gray-400">Average Rating</p>
          </div>

          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">92%</div>
            <p className="text-gray-400">User Satisfaction</p>
          </div>
        </div>
      </div>


      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Three simple steps to transform your meal planning experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <Card className="bg-gray-900/50 border border-gray-800 hover:border-primary/50 transition duration-300 p-6">
            <div className="relative">
              <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                <User className="h-8 w-8 text-primary" />
              </div>
              <span className="absolute top-0 right-0 text-6xl font-bold text-gray-700/20">
                1
              </span>
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-4">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Quick sign-up process to access personalized meal planning features and save your preferences.
            </CardDescription>
          </Card>

          {/* Step 2 */}
          <Card className="bg-gray-900/50 border border-gray-800 hover:border-primary/50 transition duration-300 p-6">
            <div className="relative">
              <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <span className="absolute top-0 right-0 text-6xl font-bold text-gray-700/20">
                2
              </span>
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-4">
              Set Your Preferences
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Customize your dietary preferences, cooking time, skill level, and nutritional goals.
            </CardDescription>
          </Card>

          {/* Step 3 */}
          <Card className="bg-gray-900/50 border border-gray-800 hover:border-primary/50 transition duration-300 p-6">
            <div className="relative">
              <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <span className="absolute top-0 right-0 text-6xl font-bold text-gray-700/20">
                3
              </span>
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-4">
              Get Your Meal Plan
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Receive your customized weekly meal plan with recipes, shopping lists, and prep instructions.
            </CardDescription>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 mt-24">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href="mailto:sarthu.datta@gmail.com" className="hover:text-primary transition">
                    sarthu.datta@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a href="tel:+1-555-123-4567" className="hover:text-primary transition">
                    +1 (916) 365 2292
                  </a>
                </div>
              </div>
            </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-primary transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-gray-400 hover:text-primary transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-primary transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            

            

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 FoodFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
