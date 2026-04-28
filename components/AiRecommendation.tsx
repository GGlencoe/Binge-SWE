"use client"

import { useState } from "react"
import { Sparkles, Loader2, X, ExternalLink, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SwipeableItem } from "@/types/database"
import Image from "next/image"

interface Recommendation {
  id: string
  reason: string
  item: SwipeableItem
}

interface AiRecommendationProps {
  type: "food" | "restaurant"
  source: "liked" | "saved"
}

function getItemLink(item: SwipeableItem, type: "food" | "restaurant"): string {
  if (type === "restaurant") {
    if (item.external_id) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}&query_place_id=${item.external_id}`
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`
  }
  return `https://www.google.com/search?q=${encodeURIComponent(item.name + " recipe")}`
}

export default function AiRecommendation({ type, source }: AiRecommendationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [craving, setCraving] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Recommendation[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!craving.trim()) return

    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ craving, type, source }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to get recommendations")
      setResults(data.recommendations)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setIsOpen(false)
    setCraving("")
    setResults([])
    setError(null)
  }

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-orange-600 text-sm font-medium shadow-sm hover:bg-orange-50 transition border border-orange-100"
        >
          <Sparkles className="w-4 h-4" />
          Ask AI
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-xl border border-orange-100 overflow-hidden relative mb-8"
        >
          <button
            onClick={reset}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            AI Suggestion
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Based on your {source} {type === 'food' ? 'recipes' : 'restaurants'}.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={craving}
              onChange={(e) => setCraving(e.target.value)}
              placeholder="e.g. Something spicy and fast..."
              className="flex-1 px-4 py-3 rounded-xl bg-orange-50 border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 placeholder-gray-400 transition-all"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !craving.trim()}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm mb-4">
              {error}
            </div>
          )}

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <div className="h-px bg-gray-100 my-4" />
                <p className="text-sm font-medium text-gray-600 mb-3">Recommendations:</p>
                {results.map((rec, idx) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 p-4 rounded-2xl bg-orange-50/50 hover:bg-orange-50 transition-colors"
                  >
                    {rec.item.image_url ? (
                      <Image
                        src={rec.item.image_url}
                        alt={rec.item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-orange-200 flex items-center justify-center shrink-0">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-800 leading-tight">{rec.item.name}</h4>
                        <a
                          href={getItemLink(rec.item, type)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-600 transition"
                        >
                          {type === "restaurant" ? (
                            <MapPin className="w-4 h-4" />
                          ) : (
                            <ExternalLink className="w-4 h-4" />
                          )}
                        </a>
                      </div>
                      <p className="text-xs text-orange-600 mt-1 font-medium italic">
                        &quot;{rec.reason}&quot;
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
