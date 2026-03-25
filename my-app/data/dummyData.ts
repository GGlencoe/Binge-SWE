export type FoodItem = {
  id: string
  name: string
  description: string
  image: string
  tags: string[]
}

export const foodItems: FoodItem[] = [
  {
    id: "f1",
    name: "Spaghetti Carbonara",
    description: "Creamy pasta with pancetta and egg",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
    tags: ["Italian", "Pasta", "30 min"],
  },
  {
    id: "f2",
    name: "Chicken Tacos",
    description: "Crispy chicken with fresh salsa and avocado",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
    tags: ["Mexican", "Quick", "20 min"],
  },
  {
    id: "f3",
    name: "Margherita Pizza",
    description: "Classic tomato, mozzarella, and fresh basil",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400",
    tags: ["Italian", "Pizza", "45 min"],
  },
  {
    id: "f4",
    name: "Salmon Sushi",
    description: "Fresh salmon nigiri with soy and wasabi",
    image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400",
    tags: ["Japanese", "Seafood", "15 min"],
  },
  {
    id: "f5",
    name: "Beef Burger",
    description: "Juicy beef patty with cheese and pickles",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    tags: ["American", "Fast Food", "25 min"],
  },
  {
    id: "f6",
    name: "Pad Thai",
    description: "Stir-fried rice noodles with shrimp and peanuts",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",
    tags: ["Thai", "Noodles", "25 min"],
  },
  {
    id: "f7",
    name: "Avocado Toast",
    description: "Sourdough with smashed avocado and poached egg",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400",
    tags: ["Breakfast", "Healthy", "10 min"],
  },
  {
    id: "f8",
    name: "Butter Chicken",
    description: "Tender chicken in a rich, spiced tomato cream sauce",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
    tags: ["Indian", "Curry", "40 min"],
  },
]

export const restaurantItems: FoodItem[] = [
  {
    id: "r1",
    name: "Olive Garden",
    description: "Family-style Italian with unlimited breadsticks",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
    tags: ["Italian", "Casual", "$$"],
  },
  {
    id: "r2",
    name: "Nobu",
    description: "World-famous Japanese fusion and sushi",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
    tags: ["Japanese", "Fine Dining", "$$$$"],
  },
  {
    id: "r3",
    name: "Shake Shack",
    description: "Premium burgers, crinkle fries, and frozen custard",
    image: "https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400",
    tags: ["American", "Burgers", "$"],
  },
  {
    id: "r4",
    name: "Chipotle",
    description: "Build-your-own burritos and bowls with fresh ingredients",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400",
    tags: ["Mexican", "Fast Casual", "$"],
  },
  {
    id: "r5",
    name: "The Cheesecake Factory",
    description: "Massive menu with over 250 dishes and epic cheesecakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    tags: ["American", "Casual", "$$"],
  },
  {
    id: "r6",
    name: "Nobu",
    description: "Authentic Neapolitan pizza baked in a wood-fired oven",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    tags: ["Italian", "Pizza", "$$"],
  },
  {
    id: "r7",
    name: "Benihana",
    description: "Theatrical teppanyaki dining with live hibachi chefs",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
    tags: ["Japanese", "Experience", "$$$"],
  },
  {
    id: "r8",
    name: "In-N-Out Burger",
    description: "West Coast cult classic with a secret menu",
    image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400",
    tags: ["American", "Burgers", "$"],
  },
]