/* eslint-disable @next/next/no-img-element */
import { useRef } from "react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { SwipeableItem } from "@/types/database"

type Props = {
  item: SwipeableItem
  onSave?: () => void
  isSaved?: boolean
  mode?: "food" | "restaurant"
}

function getItemLink(item: SwipeableItem, mode: "food" | "restaurant"): string {
  if (mode === "restaurant") {
    if (item.external_id) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}&query_place_id=${item.external_id}`
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`
  }
  // food → recipe search
  return `https://www.google.com/search?q=${encodeURIComponent(item.name + " recipe")}`
}

export default function SwipeCard({ item, onSave, isSaved, mode = "food" }: Props) {
  const pointerStart = useRef<{ x: number, y: number, time: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY, time: e.timeStamp };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const timeElapsed = e.timeStamp - pointerStart.current.time;

    // If it's a short tap/click with minimal movement, open the link
    if (distance < 10 && timeElapsed < 500) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
    pointerStart.current = null;
  };

  const tags = [
    ...(item.cuisine_type ?? []),
    ...(item.dietary_tags ?? []),
  ]

  const link = getItemLink(item, mode)

  return (
    <div className="w-80 h-[480px] rounded-2xl overflow-hidden bg-white select-none cursor-grab active:cursor-grabbing flex flex-col">

      {/* Image — fixed height, fallback emoji if no URL, clicking opens link */}
      <div className="relative w-full h-56 shrink-0">
        {item.image_url ? (
          <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="block w-full h-full cursor-pointer"
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </div>
        ) : (
          <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="block w-full h-full cursor-pointer"
          >
            <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
              <span className="text-5xl pointer-events-none">🍽️</span>
            </div>
          </div>
        )}

        {/* Save button */}
        {onSave && (
          <button
            onClick={(e) => { e.stopPropagation(); onSave() }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 bg-white/85 backdrop-blur-sm rounded-full p-2 shadow transition hover:scale-110"
            aria-label={isSaved ? "Saved" : "Save"}
          >
            {isSaved
              ? <BookmarkCheck className="w-4 h-4 text-orange-500" />
              : <Bookmark className="w-4 h-4 text-gray-500" />
            }
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1 overflow-hidden pb-1">
        <h2 className="text-2xl font-bold text-gray-800 shrink-0 line-clamp-2" title={item.name}>{item.name}</h2>
        <div className="overflow-y-auto flex-1 pr-2">
          {item.description && (
            <p className="text-gray-500 text-sm break-words whitespace-pre-wrap mb-2">
              {item.description}
            </p>
          )}
          {item.location?.address && (
            <p className="text-gray-400 text-xs break-words whitespace-pre-wrap flex items-start gap-1">
              <span>📍</span> {item.location.address}
            </p>
          )}
          {!item.description && !item.location?.address && (
            <p className="text-gray-500 text-sm break-words whitespace-pre-wrap">No details available.</p>
          )}
        </div>
        <div className="flex gap-2 mt-1 shrink-0 overflow-x-auto">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-medium shrink-0 capitalize"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Swipe hint */}
      <div className="px-5 flex justify-between text-xs pb-3 mt-auto">
        <div className="flex flex-col items-center leading-none bg-gradient-to-b from-red-400 to-gray-500 bg-clip-text text-transparent">
          <p className="font-semibold m-0">Skip</p>
          <p className="text-gray-800 text-xl m-0">←</p>
        </div>
        <div className="flex flex-col items-center leading-none bg-gradient-to-b from-green-400 to-gray-500 bg-clip-text text-transparent">
          <p className="font-semibold m-0">Like</p>
          <p className="text-gray-800 text-xl m-0">→</p>
        </div>
      </div>

    </div>
  )
}

