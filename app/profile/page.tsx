"use client"

import { useState, useEffect } from "react"
import { Heart, Bookmark } from "lucide-react"
import LikedFeed from "@/components/LikedFeed"
import SavedFeed from "@/components/SavedFeed"
import SegmentedControl from "@/components/SegmentedControl"

type Section = "liked" | "saved"

export default function Profile() {
  const [username, setUsername] = useState("User")
  const [section, setSection] = useState<Section>("liked")

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data?.username) setUsername(data.username)
      })
      .catch(() => {})
  }, [])

  return (
    <main className="bg-orange-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6 pt-8">
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

        {section === "liked" ? <LikedFeed /> : <SavedFeed />}

      </div>
    </main>
  )
}
