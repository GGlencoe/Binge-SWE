/* eslint-disable @next/next/no-img-element */
import { Food } from "@/types/database"

type Props = {
  item: Food
}

export default function SwipeCard({ item }: Props) {
  // Merge cuisine type and dietary tags into one tag list
  const tags = [
    ...(item.cuisine_type ?? []),
    ...(item.dietary_tags ?? []),
  ]

  return (
    <div className="w-80 h-[480px] rounded-2xl overflow-hidden bg-white select-none cursor-grab active:cursor-grabbing flex flex-col">

      {/* Image — fixed height, fallback emoji if no URL, clicking opens map */}
      <div className="relative w-full h-64 shrink-0">
        {item.image_url ? (
          <a
            href={item.external_id ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}&query_place_id=${item.external_id}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </a>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
      </div>

      {/* Content — scrollable description, fixed tags */}
      <div className="p-5 flex flex-col gap-3 flex-1 overflow-hidden pb-1">
        <h2 className="text-2xl font-bold text-gray-800 shrink-0">{item.name}</h2>
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