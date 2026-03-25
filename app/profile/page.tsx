import { Heart, BookmarkCheck, Clock } from "lucide-react";

export default function Profile() {
  const stats = [
    { label: "Liked", value: 24, icon: Heart, color: "text-red-500" },
    { label: "Saved", value: 12, icon: BookmarkCheck, color: "text-blue-500" },
    { label: "Cooked", value: 8, icon: Clock, color: "text-green-500" },
  ];

  return (
    <main className="bg-orange-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="w-24 h-24 bg-orange-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">👨‍🍳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Food Lover</h1>
          <p className="text-gray-600">Exploring delicious recipes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Liked Recipes */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Liked Recipes</h2>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-br from-orange-200 to-orange-300"></div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm mb-1">Recipe Name</h3>
                  <p className="text-xs text-gray-600">Restaurant</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}