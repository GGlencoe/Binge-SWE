/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react"
import { SwipeableItem } from "@/types/database"
import { Utensils, Store, Trash2, ExternalLink, MapPin } from "lucide-react"
import SegmentedControl from "./SegmentedControl"

type SavedRow = {
  id: string
  type: "food" | "restaurant"
  foods: SwipeableItem | null
  restaurants: SwipeableItem | null
}

function getItemLink(item: SwipeableItem, type: "food" | "restaurant"): string {
  if (type === "restaurant") {
    if (item.external_id) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}&query_place_id=${item.external_id}`
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`
  }
  // food → recipe search
  return `https://www.google.com/search?q=${encodeURIComponent(item.name + " recipe")}`
}

function SavedCard({ row, onRemove }: { row: SavedRow; onRemove: (id: string) => void }) {
  const item = row.type === "food" ? row.foods : row.restaurants
  if (!item) return null

  const tags = [...(item.cuisine_type ?? []), ...(item.dietary_tags ?? [])]
  const link = getItemLink(item, row.type)

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="relative h-32 shrink-0">
        <a href={link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
              <span className="text-3xl">🍽️</span>
            </div>
          )}
        </a>
        <button
          onClick={() => onRemove(row.id)}
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white transition"
          aria-label="Remove from saved"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <a href={link} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-800 text-sm leading-tight hover:text-orange-600 transition flex items-center gap-1">
          {item.name}
          {row.type === "restaurant"
            ? <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
            : <ExternalLink className="w-3 h-3 text-orange-400 shrink-0" />
          }
        </a>
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

interface SavedFeedProps {
  tab: "food" | "restaurant"
  onTabChange: (tab: "food" | "restaurant") => void
}

export default function SavedFeed({ tab, onTabChange }: SavedFeedProps) {
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
          onChange={onTabChange}
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

