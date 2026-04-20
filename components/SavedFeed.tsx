/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react"
import { SwipeableItem } from "@/types/database"
import { Utensils, Store, Trash2 } from "lucide-react"
import SegmentedControl from "./SegmentedControl"

type SavedRow = {
  id: string
  type: "food" | "restaurant"
  foods: SwipeableItem | null
  restaurants: SwipeableItem | null
}

function SavedCard({ row, onRemove }: { row: SavedRow; onRemove: (id: string) => void }) {
  const item = row.type === "food" ? row.foods : row.restaurants
  if (!item) return null

  const tags = [...(item.cuisine_type ?? []), ...(item.dietary_tags ?? [])]

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="relative h-32 shrink-0">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
            <span className="text-3xl">🍽️</span>
          </div>
        )}
        <button
          onClick={() => onRemove(row.id)}
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition"
          aria-label="Remove from saved"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="font-medium text-gray-800 text-sm leading-tight">{item.name}</p>
        {item.description && (
          <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
        )}
        {tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SavedFeed() {
  const [tab, setTab] = useState<"food" | "restaurant">("food")
  const [rows, setRows] = useState<SavedRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await fetch(`/api/saved?type=${tab}`).then((r) => r.json())
        setRows(data ?? [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tab])

  const handleRemove = async (id: string) => {
    await fetch(`/api/saved/${id}`, { method: "DELETE" })
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div>
      <div className="mb-4">
        <SegmentedControl
          options={[
            { value: "food", label: "Recipes", icon: <Utensils className="w-4 h-4" /> },
            { value: "restaurant", label: "Restaurants", icon: <Store className="w-4 h-4" /> },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl h-48 animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          Nothing saved yet — start swiping!
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {rows.map((row) => (
            <SavedCard key={row.id} row={row} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  )
}
