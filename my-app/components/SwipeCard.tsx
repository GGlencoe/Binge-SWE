import { FoodItem } from "@/data/dummyData"

type Props = {
  item: FoodItem
}

export default function SwipeCard({ item }: Props) {
  return (
    <div className="w-80 h-[480px] rounded-2xl overflow-hidden shadow-2xl bg-white select-none cursor-grab active:cursor-grabbing">
      {/* Image */}
      <div className="relative w-full h-64">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
        <p className="text-gray-500 text-sm">{item.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Swipe hint */}
      <div className="px-5 flex justify-between text-xs text-gray-300 mt-auto pb-4">
        <span>👈 Skip</span>
        <span>Like 👉</span>
      </div>
    </div>
  )
}