"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Utensils, User, Store } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith('/login') || pathname.startsWith('/auth')) return null

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="z-50 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto px-4">
        
    
        <Link href="/recipes" className={`flex flex-col items-center flex-1 py-2 ${isActive("/recipes") ? "text-orange-500" : "text-gray-500"}`}>
          <Utensils className={`w-6 h-6 mb-1 ${isActive("/recipes") ? "fill-orange-500" : ""}`} />
          <span className="text-xs font-medium">Recipes</span>
        </Link>

        <Link href="/profile" className={`flex flex-col items-center flex-1 py-2 ${isActive("/profile") ? "text-orange-500" : "text-gray-500"}`}>
          <User className={`w-6 h-6 mb-1 ${isActive("/profile") ? "fill-orange-500" : ""}`} />
          <span className="text-xs font-medium">Profile</span>
        </Link>

        <Link href="/restaurants" className={`flex flex-col items-center flex-1 py-2 ${isActive("/restaurants") ? "text-orange-500" : "text-gray-500"}`}>
          <Store className={`w-6 h-6 mb-1 ${isActive("/restaurants") ? "fill-orange-500" : ""}`} />
          <span className="text-xs font-medium">Restaurants</span>
        </Link>

      </div>
    </nav>
  );
}