"use client"

import { useState } from "react"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import SwipeCard from "./SwipeCard"
import { dummyItems, FoodItem } from "@/data/dummyData"

function DraggableCard({
  item,
  onSwipe,
}: {
  item: FoodItem
  onSwipe: (dir: "left" | "right", item: FoodItem) => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe("right", item)
    else if (info.offset.x < -100) onSwipe("left", item)
  }

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute cursor-grab active:cursor-grabbing"
      whileDrag={{ scale: 1.05 }}
    >
      <SwipeCard item={item} />
    </motion.div>
  )
}

export default function SwipeDeck() {
  const [items, setItems] = useState<FoodItem[]>(dummyItems)
  const [liked, setLiked] = useState<FoodItem[]>([])
  const [lastAction, setLastAction] = useState<string | null>(null)

  const onSwipe = (dir: "left" | "right", item: FoodItem) => {
    if (dir === "right") {
      setLiked((prev) => [...prev, item])
      setLastAction(`❤️ Liked ${item.name}`)
    } else {
      setLastAction(`👋 Skipped ${item.name}`)
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id))
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-2xl">🎉 You've seen everything!</p>
        <p className="text-gray-500">Liked {liked.length} items</p>
        <button
          onClick={() => { setItems(dummyItems); setLiked([]); setLastAction(null) }}
          className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition"
        >
          Start Over
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card Stack */}
      <div className="relative w-80 h-[480px]">
        <AnimatePresence>
          {items.map((item, index) => (
            <DraggableCard
              key={item.id}
              item={item}
              onSwipe={onSwipe}
            />
          ))}
        </AnimatePresence>
      </div>

      {lastAction && (
        <p className="text-sm text-gray-500 h-5">{lastAction}</p>
      )}

      <p className="text-sm text-gray-400">
        ❤️ {liked.length} liked · {items.length} remaining
      </p>
    </div>
  )
}