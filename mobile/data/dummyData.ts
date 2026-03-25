export const dummyItems = [
  {
    id: "1",
    name: "Spaghetti Carbonara",
    description: "Creamy pasta with pancetta and egg",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
    tags: ["Italian", "Pasta", "30 min"],
  },
  {
    id: "2",
    name: "Chicken Tacos",
    description: "Crispy chicken with fresh salsa and avocado",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
    tags: ["Mexican", "Quick", "20 min"],
  },
  {
    id: "3",
    name: "Margherita Pizza",
    description: "Classic tomato, mozzarella, and fresh basil",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400",
    tags: ["Italian", "Pizza", "45 min"],
  },
  {
    id: "4",
    name: "Salmon Sushi",
    description: "Fresh salmon nigiri with soy and wasabi",
    image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400",
    tags: ["Japanese", "Seafood", "15 min"],
  },
  {
    id: "5",
    name: "Beef Burger",
    description: "Juicy beef patty with cheese and pickles",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    tags: ["American", "Fast Food", "25 min"],
  },
]

export type FoodItem = typeof dummyItems[0]
