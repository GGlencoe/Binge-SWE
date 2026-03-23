import SwipeDeck from "@/components/SwipeDeck"

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-8">

      {/* Logo */}
      <div>
        <img src="/bingeLogo.png" alt="Binge" className="mt-2 h-32 w-auto"/>
      </div>


      <p className="mb-4 text-sm text-center bg-gradient-to-b from-blue-500 to-gray-700 bg-clip-text text-transparent">
  Your Liked Recipes and Your Profile will be here! (This page is under construction)
</p>

    </main>
  )
}
