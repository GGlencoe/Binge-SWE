/* eslint-disable @next/next/no-img-element */
"use client"

import SwipeDeck from "@/components/SwipeDeck"

export default function RecipesPage() {
  return (
    <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-8">

      {/* Logo */}
      <div>
        <img src="/bingeLogo.png" alt="Binge" className="mt-2 h-32 w-auto" />
      </div>

      <p className="mb-4 text-sm text-center bg-gradient-to-b from-blue-500 to-gray-700 bg-clip-text text-transparent">
        <strong>Swipe</strong> ← <strong>left</strong> to skip &nbsp;|&nbsp; Swipe <strong>right</strong> → to like
      </p>

      {/* foodType="recipe" filters the deck to recipe rows only.
          Change to "dish" or remove the prop entirely to show all types. */}
      <SwipeDeck foodType="recipe" />

    </main>
  )
}
