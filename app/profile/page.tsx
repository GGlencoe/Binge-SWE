import { Heart, Utensils, Store } from "lucide-react";

export default function Profile() {

  /*  
  Conceptually we would fetch the user's liked recipes and restaurants from a backend or local storage, and then calculate the counts to display in the stats section. For example:

  const likedRecipes = fetchLikedRecipesForUser(userId);
  const likedRestaurants = fetchLikedRestaurantsForUser(userId);
  
  const recipeCount = likedRecipes.length;
  const restaurantCount = likedRestaurants.length;
  
  const stats = [
    { label: "Recipes Liked", value: recipeCount, color: "text-red-500" },
    { label: "Restaurants Liked", value: restaurantCount, color: "text-green-500" },
  ];
  */

  const stats = [
    { label: "Recipes Liked", value: 13, color: "text-red-500" },
    { label: "Restaurants Liked", value: 12, color: "text-green-500" },
  ];

  const recipeLiked = () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Utensils />
      <Heart />
    </div>
  );

  const restaurantLiked = () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Store />
      <Heart />
    </div>
  );

  return (
    <main className="bg-orange-50 min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 pt-8">
          <div className="w-24 h-24 bg-orange-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">👨‍🍳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Profile Name</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-center"
            >
              <div className={`flex flex-col items-center justify-center text-2xl gap-1 ${stat.color}`}>
                {/* Stat icon or value */}
                {stat.label === "Recipes Liked" ? recipeLiked() : restaurantLiked()}

                {/* Value */}
                <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                
                {/* Label */}
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Liked Recipes */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Liked Recipes</h2>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-br from-orange-200 to-orange-300"></div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm mb-1">Recipe</h3>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Liked Restaurants */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Liked Restaurants</h2>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-br from-orange-200 to-orange-300"></div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm mb-1">Restaurant</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}