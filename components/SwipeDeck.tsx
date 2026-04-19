"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import SwipeCard from "./SwipeCard"
import { Food, FoodType } from "@/types/database"
import { Heart, X, Undo } from "lucide-react"

// ─── Draggable wrapper ────────────────────────────────────────────────────────

function DraggableCard({
  item,
  onSwipe,
  shadow,
}: {
  item: Food
  onSwipe: (dir: "left" | "right", item: Food) => void
  shadow: string
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
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute rounded-2xl cursor-grab active:cursor-grabbing ${shadow}`}
      whileDrag={{ scale: 1.05 }}
    >
      <SwipeCard item={item} />
    </motion.div>
  )
}

// ─── SwipeDeck ────────────────────────────────────────────────────────────────

interface SwipeDeckProps {
  /**
   * Filter cards to a specific food type ('recipe' | 'restaurant' | 'dish').
   * Omit to show all types. This is the only prop you need to change to
   * support a new category — no other component changes required.
   */
  foodType?: FoodType
  /**
   * Optional custom API endpoint to pull items from (e.g. /api/places).
   * Defaults to /api/recommendations if not provided.
   */
  apiEndpoint?: string
}

export default function SwipeDeck({ foodType, apiEndpoint }: SwipeDeckProps) {
  const [items, setItems] = useState<Food[]>([])
  const [history, setHistory] = useState<Food[]>([])
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // The full fetched pool — used to cycle when the deck runs out
  const pool = useRef<Food[]>([])

  // ── Initial fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const url = apiEndpoint || "/api/recommendations"
        const res = await fetch(url)
        if (!res.ok) return
        const { data } = await res.json()

        let foods: Food[] = data ?? []

        // Filter client-side by foodType if provided.
        // When the API gains a native type filter, move it server-side here.
        if (foodType) {
          foods = foods.filter((f) => f.type === foodType)
        }

        pool.current = foods
        setItems([...foods])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [foodType, apiEndpoint])

  // ── Auto-cycle when deck is empty ────────────────────────────────────────
  // Wait 1.5 s before cycling so the user can still hit Undo on the last card.
  // If Undo is pressed within that window, items.length becomes > 0 and the
  // cleanup function cancels the timer before it fires.
  useEffect(() => {
    if (!loading && items.length === 0 && pool.current.length > 0) {
      const t = setTimeout(() => {
        setItems([...pool.current])
        setHistory([])
        setLastAction("Starting over! 🔄")
      }, 1500)
      return () => clearTimeout(t)
    }
  }, [items.length, loading])

  // ── Swipe handlers ───────────────────────────────────────────────────────
  const onSwipe = (dir: "left" | "right", item: Food) => {
    setHistory((prev) => [...prev, item])
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    setLastAction(dir === "right" ? `Liked ${item.name}` : `Skipped ${item.name}`)
  }

  const handleSwipeButton = (dir: "left" | "right") => {
    const topItem = items[items.length - 1]
    if (!topItem) return
    onSwipe(dir, topItem)
  }

  // Unlimited undo — walks back through the full history
  const handleUndo = () => {
    if (history.length === 0) return
    const lastItem = history[history.length - 1]
    setHistory((prev) => prev.slice(0, -1))
    setItems((prev) => [...prev, lastItem])
    setLastAction(`Undo — ${lastItem.name}`)
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

  // ── Empty DB state (no items of this type exist yet) ─────────────────────
  if (pool.current.length === 0) {
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
          {items.map((item, index) => {
            const isTop = index === items.length - 1
            return (
              <DraggableCard
                key={item.id}
                item={item}
                onSwipe={onSwipe}
                shadow={isTop ? "shadow-2xl" : "shadow-none"}
              />
            )
          })}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-4 z-10">
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