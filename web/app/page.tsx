import SwipeDeck from "@/components/SwipeDeck"

export default function Home() {
  return (
    <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🍽️ FoodSwipe</h1>
      <p className="text-gray-400 mb-8 text-sm">Swipe right to save, left to skip</p>
      <SwipeDeck />
    </main>
  )
}
