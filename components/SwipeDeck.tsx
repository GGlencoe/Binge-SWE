"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import SwipeCard from "./SwipeCard"
import { SwipeableItem } from "@/types/database"
import { Heart, X, Undo } from "lucide-react"

// ─── Draggable wrapper ────────────────────────────────────────────────────────

function DraggableCard({
  item,
  onSwipe,
  onSave,
  isSaved,
  shadow,
  mode,
  zIndex,
}: {
  item: SwipeableItem
  onSwipe: (dir: "left" | "right", item: SwipeableItem) => void
  onSave: (item: SwipeableItem) => void
  isSaved: boolean
  shadow: string
  mode: "food" | "restaurant"
  zIndex: number
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) onSwipe("right", item)
    else if (info.offset.x < -100) onSwipe("left", item)
  }

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute rounded-2xl cursor-grab active:cursor-grabbing ${shadow}`}
      whileDrag={{ scale: 1.05 }}
    >
      <SwipeCard item={item} onSave={() => onSave(item)} isSaved={isSaved} mode={mode} />
    </motion.div>
  )
}

// ─── SwipeDeck ────────────────────────────────────────────────────────────────

interface SwipeDeckProps {
  mode?: "food" | "restaurant"
  /** Optional custom API endpoint (e.g. /api/places). Overrides the default. */
  apiEndpoint?: string
}

export default function SwipeDeck({ mode = "food", apiEndpoint }: SwipeDeckProps) {
  const [items, setItems] = useState<SwipeableItem[]>([])
  const [history, setHistory] = useState<SwipeableItem[]>([])
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const hasItems = useRef(false)
  const seenIds = useRef<Set<string>>(new Set())
  const fetchingRef = useRef(false)

  // ── Fetch (called on load and for background pre-fetching) ───────────────
  const fetchBatch = async (initial = false) => {
    if (fetchingRef.current) return
    fetchingRef.current = true
    if (initial) setLoading(true)

    try {
      const endpoint = apiEndpoint ?? (mode === "restaurant" ? "/api/restaurants" : "/api/recommendations")
      const res = await fetch(endpoint)
      if (!res.ok) return
      const { data } = await res.json()
      const fetched: SwipeableItem[] = (data ?? []).filter(
        (item: SwipeableItem) => !seenIds.current.has(item.id)
      )
      hasItems.current = fetched.length > 0

      setItems((prev) => {
        const existingIds = new Set(prev.map(i => i.id))
        const newItems = fetched.filter(i => !existingIds.has(i.id))
        return [...newItems, ...prev]
      })
      if (initial) setHistory([])
    } finally {
      fetchingRef.current = false
      if (initial) setLoading(false)
    }
  }

  useEffect(() => {
    seenIds.current = new Set()
    setItems([])
    fetchBatch(true)
  }, [mode, apiEndpoint]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pre-fetch next batch seamlessly when running low ─────────────────────
  useEffect(() => {
    if (!loading && items.length <= 3 && hasItems.current && !fetchingRef.current) {
      fetchBatch(false)
    }
  }, [items.length, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Swipe handlers ───────────────────────────────────────────────────────
  const onSwipe = (dir: "left" | "right", item: SwipeableItem) => {
    seenIds.current.add(item.id)
    setHistory((prev) => [...prev, item])
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    setLastAction(dir === "right" ? `Liked ${item.name}` : `Skipped ${item.name}`)

    const direction = dir === "right" ? "like" : "skip"
    if (mode === "restaurant") {
      fetch("/api/restaurantswipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurant_id: item.id, direction }),
      })
    } else {
      fetch("/api/foodswipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food_id: item.id, direction }),
      })
    }
  }

  const handleSwipeButton = (dir: "left" | "right") => {
    const topItem = items[items.length - 1]
    if (!topItem) return
    onSwipe(dir, topItem)
  }

  const undoingRef = useRef(false)

  const handleUndo = async () => {
    if (undoingRef.current) return

    let lastItem: SwipeableItem | undefined

    setHistory((prev) => {
      if (prev.length === 0) return prev
      lastItem = prev[prev.length - 1]
      return prev.slice(0, -1)
    })
    await Promise.resolve()
    if (!lastItem) return
    undoingRef.current = true

    try {
      const endpoint =
        mode === "restaurant"
          ? `/api/restaurantswipes/${lastItem.id}`
          : `/api/foodswipes/${lastItem.id}`

      await fetch(endpoint, { method: "DELETE" })

      seenIds.current.delete(lastItem.id)

      setItems((prev) =>
        prev.some((item) => item.id === lastItem!.id) ? prev : [...prev, lastItem!]
      )

      setLastAction(`Undo — ${lastItem.name}`)
    } finally {
      undoingRef.current = false
    }
  }

  const handleSave = async (item: SwipeableItem) => {
    const isSaved = savedIds.has(item.id)
    const type = mode === "restaurant" ? "restaurant" : "food"

    if (isSaved) {
      // Unsave
      const res = await fetch(`/api/saved?item_id=${item.id}&type=${type}`, {
        method: "DELETE",
      })
      if (res.ok || res.status === 204) {
        setSavedIds((prev) => {
          const next = new Set(prev)
          next.delete(item.id)
          return next
        })
        setLastAction(`Removed ${item.name} from saved`)
      }
    } else {
      // Save
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: item.id, type }),
      })
      if (res.ok) {
        setSavedIds((prev) => new Set(prev).add(item.id))
        setLastAction(`Saved ${item.name}`)
      }
    }
  }

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-80 h-[480px] rounded-2xl bg-white shadow-sm flex items-center justify-center">
          <p className="text-gray-400 text-sm animate-pulse">Loading…</p>
        </div>
      </div>
    )
  }

  if (!hasItems.current) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-80 h-[480px] rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center gap-3 text-gray-400">
          <span className="text-5xl">🍽️</span>
          <p className="text-sm">No items available yet.</p>
        </div>
      </div>
    )
  }

  // ── Main deck ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-80 h-[480px]">
        <AnimatePresence>
          {[...items].reverse().map((item, reverseIndex) => {
            const isTop = reverseIndex === 0
            const zIndex = items.length - reverseIndex
            return (
              <DraggableCard
                key={item.id}
                item={item}
                onSwipe={onSwipe}
                onSave={handleSave}
                isSaved={savedIds.has(item.id)}
                shadow={isTop ? "shadow-2xl" : "shadow-none"}
                mode={mode}
                zIndex={zIndex}
              />
            )
          })}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-4 relative z-50">
        <button
          onClick={() => handleSwipeButton("left")}
          disabled={items.length === 0}
          className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform disabled:opacity-40"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>
        <button
          onClick={handleUndo}
          disabled={history.length === 0}
          className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform disabled:opacity-40"
        >
          <Undo className="w-8 h-8 text-blue-500" />
        </button>
        <button
          onClick={() => handleSwipeButton("right")}
          disabled={items.length === 0}
          className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform disabled:opacity-40"
        >
          <Heart className="w-8 h-8 text-green-500" />
        </button>
      </div>

      {lastAction && (
        <p className="mt-3 text-sm text-gray-400 italic">{lastAction}</p>
      )}
    </div>
  )
}
