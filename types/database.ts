export type SwipeDirection = 'like' | 'skip' | 'super_like'
export type FoodType = 'recipe' | 'dish'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  dietary_restrictions: string[] | null
  allergies: string[] | null
  cuisine_interests: string[] | null
  price_range: 1 | 2 | 3 | 4 | null
  max_distance_miles: number | null
  created_at: string
  updated_at: string
}

export interface FoodLocation {
  lat: number
  lng: number
  address: string
}

/** Shared fields used by SwipeCard / SwipeDeck */
export interface SwipeableItem {
  id: string
  external_id?: string | null
  name: string
  description: string | null
  image_url: string | null
  cuisine_type: string[] | null
  dietary_tags: string[] | null
  price_range: number | null
  rating: number | null
  location: FoodLocation | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface Food extends SwipeableItem {
  external_id: string | null
  type: FoodType
}

export interface Restaurant extends SwipeableItem {
  external_id: string | null
}

export interface FoodSwipe {
  id: string
  user_id: string
  food_id: string
  direction: SwipeDirection
  created_at: string
}

export interface RestaurantSwipe {
  id: string
  user_id: string
  restaurant_id: string
  direction: SwipeDirection
  created_at: string
}

export type SavedType = 'food' | 'restaurant'

export interface Saved {
  id: string
  user_id: string
  type: SavedType
  food_id: string | null
  restaurant_id: string | null
  created_at: string
}
