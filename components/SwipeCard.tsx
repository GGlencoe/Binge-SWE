import { FoodItem } from "@/data/dummyData"

type Props = {
  item: FoodItem
}

export default function SwipeCard({ item }: Props) {
  return (
  <div className="w-80 h-[480px] rounded-2xl overflow-hidden bg-white select-none cursor-grab active:cursor-grabbing flex flex-col">
  {/* Image - fixed height */}
  <div className="relative w-full h-64">
    <img
      src={item.image}
      alt={item.name}
      className="w-full h-full object-cover"
      draggable={false}
    />
  </div>

  {/* Content - scroll if too long */}
  <div className="p-5 flex flex-col gap-3 overflow-y-auto">
    <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
    <p className="text-gray-500 text-sm">{item.description}</p>
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