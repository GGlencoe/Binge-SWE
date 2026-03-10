// ─── Database Type Map (matches Supabase schema) ─────────────────────────────

export type SwipeDirection = 'like' | 'skip' | 'super_like';
export type FoodType = 'restaurant' | 'recipe' | 'dish';

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  dietary_restrictions: string[] | null;
  allergies: string[] | null;
  cuisine_interests: string[] | null;
  price_range: 1 | 2 | 3 | 4 | null;
  max_distance_miles: number | null;
  created_at: string;
  updated_at: string;
}

export interface Food {
  id: string;
  external_id: string | null;
  type: FoodType;
  name: string;
  description: string | null;
  image_url: string | null;
  cuisine_type: string[] | null;
  dietary_tags: string[] | null;
  price_range: number | null;
  rating: number | null;
  location: FoodLocation | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface FoodLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Swipe {
  id: string;
  user_id: string;
  food_id: string;
  direction: SwipeDirection;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  food_id: string;
  created_at: string;
}

// ─── Supabase generated type stub (replace with actual generated types) ───────
// Run: npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at' | 'updated_at'>; Update: Partial<Profile> };
      user_preferences: { Row: UserPreferences; Insert: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>; Update: Partial<UserPreferences> };
      foods: { Row: Food; Insert: Omit<Food, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Food> };
      swipes: { Row: Swipe; Insert: Omit<Swipe, 'id' | 'created_at'>; Update: Partial<Swipe> };
      favorites: { Row: Favorite; Insert: Omit<Favorite, 'id' | 'created_at'>; Update: Partial<Favorite> };
    };
  };
};

// ─── API Request / Response shapes ───────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  count: number;
  page: number;
  limit: number;
}
