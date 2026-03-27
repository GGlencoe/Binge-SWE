"use client"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import SwipeCard from "./SwipeCard"
import { FoodItem } from "@/data/dummyData"
import { Heart, X, Undo } from "lucide-react"

function DraggableCard({
  item,
  onSwipe,
  shadow = "shadow-2xl"

}: {
  item: FoodItem
  onSwipe: (dir: "left" | "right", item: FoodItem) => void
  shadow: string
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
      className={`absolute rounded-2xl cursor-grab active:cursor-grabbing ${shadow}`}
      whileDrag={{ scale: 1.05 }}
    >
      <SwipeCard item={item} />
    </motion.div>
  )
}

export default function SwipeDeck({ items: initialItems }: { items: FoodItem[] }) {
  const [items, setItems] = useState<FoodItem[]>(initialItems)
  const [liked, setLiked] = useState<FoodItem[]>([])
  const [history, setHistory] = useState<FoodItem[]>([])
  const [lastAction, setLastAction] = useState<string | null>(null)

  const handleSwipe = (dir: "left" | "right") => {
    const topItem = items[items.length - 1]
    if (!topItem) return

    onSwipe(dir, topItem)
  }

  const onSwipe = (dir: "left" | "right", item: FoodItem) => {
    setHistory((prev) => [...prev, item])

    if (dir === "right") {
      setLiked((prev) => [...prev, item])
      setLastAction(`Liked ${item.name}`)
    } else {
      setLastAction(`Skipped ${item.name}`)
    }

    setItems((prev) => prev.filter((i) => i.id !== item.id))
  }

  const handleUndo = () => {
    if (history.length === 0) return

    const lastItem = history[history.length - 1]

    setHistory((prev) => prev.slice(0, -1))

    // put back on top
    setItems((prev) => [...prev, lastItem])

    setLastAction(`Undo ${lastItem.name}`)
  }
  useEffect(() => {
    if (items.length === 0) {
      setItems(initialItems)
    }
  }, [items, initialItems])

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-80 h-[480px]">
        <AnimatePresence>
          {items.map((item, index) => {
            const isTop = index === items.length - 1; // last item in array
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

      <div className="flex gap-4 mt-4 z-10">
        <button
          onClick={() => handleSwipe("left")}
          className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>

        <button
          onClick={handleUndo}
          className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
          disabled={history.length === 0}
        >
          <Undo className="w-8 h-8 text-blue-500" />
        </button>

        <button
          onClick={() => handleSwipe("right")}
          className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
        >
          <Heart className="w-8 h-8 text-green-500" />
        </button>
      </div>
    </div>
  )
}