"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, Bookmark, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import LikedFeed from "@/components/LikedFeed"
import SavedFeed from "@/components/SavedFeed"
import SegmentedControl from "@/components/SegmentedControl"

type Section = "liked" | "saved"
type SubTab = "food" | "restaurant"

export default function Profile() {
  const router = useRouter()
  const [username, setUsername] = useState("User")
  const [section, setSection] = useState<Section>("liked")
  const [subTab, setSubTab] = useState<SubTab>("food")

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data?.username) setUsername(data.username)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <main className="bg-orange-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">

        {/* Logout button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-gray-600 text-sm font-medium shadow-sm hover:bg-red-50 hover:text-red-500 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <div className="w-24 h-24 bg-orange-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">👨‍🍳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{username}</h1>
        </div>

        {/* Section toggle */}
        <div className="mb-6">
          <SegmentedControl
            options={[
              { value: "liked", label: "Liked", icon: <Heart className="w-4 h-4" /> },
              { value: "saved", label: "Saved", icon: <Bookmark className="w-4 h-4" /> },
            ]}
            value={section}
            onChange={setSection}
          />
        </div>

        {section === "liked" ? <LikedFeed tab={subTab} onTabChange={setSubTab} /> : <SavedFeed tab={subTab} onTabChange={setSubTab} />}

      </div>
    </main>
  )
}
