// app/components/NavBar.js


"use client";


import Link from "next/link";
import Image from "next/image";
import { useUser, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";






export default function NavBar() {
 const { isLoaded, isSignedIn, user } = useUser();


 if (!isLoaded) {
   // Optionally, return a loading indicator or skeleton here
   return null;
 }


 return (
   <nav className=" top-0 left-0 w-full shadow-sm z-50 ">
     <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
       {/* Brand / Logo */}
     
       <Link href="/">
       
         <h1 className="text-white text-4xl font-bold mt-4">
          FoodFlow
          </h1>
       </Link>


       {/* Navigation Links */}
       <div className="space-x-6 flex items-center">
         {/* Authentication Buttons */}
         <SignedIn>
           <Link
             href="/mealplan"
             className="text-white hover:text-primary transition-colors"
           >
             Mealplan
           </Link>
           {/* Profile Picture */}
           {user?.imageUrl ? (
             <Link href="/profile">
               <Image
                 src={user.imageUrl}
                 alt="Profile Picture"
                 width={40}
                 height={40}
                 className="rounded-full"
               />
             </Link>
           ) : (
             // Placeholder for users without a profile picture
             <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
           )}


           {/* Sign Out Button */}
           <SignOutButton>
             <button className="ml-4 px-4 py-2 bg-primary text-white rounded hover:scale-105 transition">
               Sign Out
             </button>
           </SignOutButton>
         </SignedIn>


         <SignedOut>
           <Link
             href="/"
             className="text-white hover:text-white/80 transition-colors"
           >
             Home
           </Link>
           <Link
             href={isSignedIn ? "/subscribe" : "/subscribe"}
             className="text-white hover:text-white/90 transition-colors"
           >
             Pricing
           </Link>


           <Link
             href="/sign-up"
             className="px-4 py-2 bg-primary text-white rounded-lg hover:scale-105 transition"
           >
             Sign Up
           </Link>
         </SignedOut>
       </div>
     </div>
   </nav>
 );
}



