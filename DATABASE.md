# Binge — Database & API Guide

This doc explains how our database is structured and how to interact with it. You don't need to write SQL — everything goes through our API routes.

---

## How It Works (Big Picture)

We use **Supabase** as our database and auth provider. Think of it like a cloud spreadsheet with built-in login.

- All data is stored in **tables** (like spreadsheets with rows and columns)
- You interact with data by calling our **API routes** (URL endpoints) using `fetch()`
- You must be **logged in** to use almost any route — the server checks your session automatically via cookies

---

## The Tables

Here's every table in the database and what it stores:

### `profiles`
Stores basic info about each user. **Created automatically when someone signs up** — you don't need to insert into this table manually.

| Column | Type | What it is |
|---|---|---|
| `id` | UUID | Matches the user's auth ID. Primary key. |
| `username` | text | Unique username |
| `display_name` | text | Name shown in the UI (optional) |
| `avatar_url` | text | URL to their profile picture (optional) |
| `location` | text | City/region text (optional) |
| `created_at` | timestamp | When the profile was created |
| `updated_at` | timestamp | Auto-updates whenever the row changes |

### `user_preferences`
Stores food preferences for each user (one row per user).

| Column | Type | What it is |
|---|---|---|
| `id` | UUID | Row ID |
| `user_id` | UUID | Links to `profiles.id` |
| `dietary_restrictions` | text[] | Array of restrictions, e.g. `["vegan", "gluten-free"]` |
| `allergies` | text[] | Array of allergies, e.g. `["peanuts"]` |
| `cuisine_interests` | text[] | Array of cuisines, e.g. `["Italian", "Mexican"]` |
| `price_range` | int (1–4) | 1 = $, 2 = $$, 3 = $$$, 4 = $$$$ |
| `max_distance_miles` | number | Max distance for restaurant suggestions |

### `foods`
Stores every food item (restaurants, recipes, or dishes) that users can swipe on. This is populated by us or an external data source — not by users directly.

| Column | Type | What it is |
|---|---|---|
| `id` | UUID | Row ID |
| `type` | `'restaurant' \| 'recipe' \| 'dish'` | Category |
| `name` | text | Name of the food/restaurant |
| `description` | text | Short description |
| `image_url` | text | URL to food photo |
| `cuisine_type` | text[] | e.g. `["Italian", "Pasta"]` |
| `dietary_tags` | text[] | e.g. `["vegan", "spicy"]` |
| `price_range` | int (1–4) | Cost level |
| `rating` | number (0–5) | Average rating |
| `location` | JSON | `{ lat, lng, address }` — only for restaurants |
| `metadata` | JSON | Extra data (flexible, catch-all) |

### `swipes`
Records every time a user swipes on a food item.

| Column | Type | What it is |
|---|---|---|
| `id` | UUID | Row ID |
| `user_id` | UUID | Who swiped |
| `food_id` | UUID | What they swiped on |
| `direction` | `'like' \| 'skip' \| 'super_like'` | Which way they swiped |
| `created_at` | timestamp | When they swiped |

> **Note:** A user can only swipe on each food item once. Swiping again overwrites the previous direction. Liking or super-liking automatically adds the item to favorites.

### `favorites`
Stores a user's saved/liked food items.

| Column | Type | What it is |
|---|---|---|
| `id` | UUID | Row ID |
| `user_id` | UUID | Who favorited it |
| `food_id` | UUID | What was favorited |
| `created_at` | timestamp | When it was favorited |

---

## Security: Row Level Security (RLS)

Every table has **Row Level Security** enabled. This means:

- Users can **only read or write their own data** — you can't accidentally read someone else's swipes or favorites
- This is enforced at the database level, not just in our code
- The `foods` table is readable by all logged-in users (since it's shared content)

---

## API Routes

All routes live under `/api/`. Call them from the browser using `fetch()`. You must be logged in (cookies are sent automatically by the browser).

---

### Profile

#### `GET /api/users/me`
Fetch your own profile.

```js
const res = await fetch('/api/users/me')
const { data } = await res.json()
// data = { id, username, display_name, avatar_url, location, ... }
```

#### `PUT /api/users/me`
Update your profile. Send only the fields you want to change.

```js
const res = await fetch('/api/users/me', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    display_name: 'Alex',
    location: 'St. Louis, MO',
    avatar_url: 'https://...url-to-image...',
  }),
})
const { data } = await res.json()
```

> **How avatar upload works:** We store a URL, not the file itself. Upload the image to Supabase Storage (or another host) first, get the URL back, then save that URL here. See the [Profile Upload Example](#profile-upload-example) below.

---

### Preferences

#### `GET /api/users/me/preferences`
Get the current user's food preferences.

```js
const res = await fetch('/api/users/me/preferences')
const { data } = await res.json()
// data = { dietary_restrictions: [...], cuisine_interests: [...], ... }
// data will be null if no preferences have been set yet
```

#### `PUT /api/users/me/preferences`
Save/update preferences. This creates the row if it doesn't exist yet, or updates it if it does.

```js
const res = await fetch('/api/users/me/preferences', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dietary_restrictions: ['vegetarian'],
    allergies: ['peanuts'],
    cuisine_interests: ['Italian', 'Mexican', 'Thai'],
    price_range: 2,           // 1–4
    max_distance_miles: 15,
  }),
})
const { data } = await res.json()
```

---

### Swipes

#### `POST /api/swipes`
Record a swipe. `direction` must be `'like'`, `'skip'`, or `'super_like'`.

```js
const res = await fetch('/api/swipes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    food_id: 'some-uuid-here',
    direction: 'like',        // 'like' | 'skip' | 'super_like'
  }),
})
const { data } = await res.json()
```

> Liking or super-liking automatically creates a favorites entry. You don't need to call the favorites endpoint separately.

#### `GET /api/swipes`
Get your swipe history. Supports pagination.

```js
// Page 1, 20 items
const res = await fetch('/api/swipes?page=1&limit=20')
const { data, count, page, limit } = await res.json()
```

---

### Favorites

#### `GET /api/favorites`
Get all your favorites (includes the full food details).

```js
const res = await fetch('/api/favorites')
const { data } = await res.json()
// data = [{ id, user_id, food_id, created_at, foods: { name, image_url, ... } }]
```

#### `POST /api/favorites`
Manually add a food to favorites (without swiping).

```js
const res = await fetch('/api/favorites', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ food_id: 'some-uuid-here' }),
})
const { data } = await res.json()
```

#### `DELETE /api/favorites/:foodId`
Remove a food from favorites.

```js
const foodId = 'some-uuid-here'
await fetch(`/api/favorites/${foodId}`, { method: 'DELETE' })
// Returns 204 No Content on success
```

---

### Recommendations

#### `GET /api/recommendations`
Get personalized food recommendations based on the user's preferences. Excludes items they've already swiped on.

```js
const res = await fetch('/api/recommendations?limit=10')
const { data } = await res.json()
// data = array of food objects, sorted by rating
```

---

### Health Check

#### `GET /api/health`
Check if the database connection is working. Useful for debugging.

```js
const res = await fetch('/api/health')
const { ok, error } = await res.json()
// ok: true/false
```

---

## Profile Upload Example

This is a walkthrough of how updating a profile avatar works end-to-end. The same pattern applies to any image upload.

### Step 1 — Upload the image to Supabase Storage

```js
import { createClient } from '@/lib/supabase/client'

async function uploadAvatar(file: File, userId: string) {
  const supabase = createClient()

  const fileExt = file.name.split('.').pop()
  const filePath = `avatars/${userId}.${fileExt}`   // e.g. "avatars/abc-123.jpg"

  const { error } = await supabase.storage
    .from('avatars')             // the storage bucket name
    .upload(filePath, file, { upsert: true })

  if (error) throw error

  // Get the public URL for the uploaded file
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return data.publicUrl   // e.g. "https://xxx.supabase.co/storage/v1/object/public/avatars/abc-123.jpg"
}
```

### Step 2 — Save the URL to the profile

```js
async function updateProfileAvatar(avatarUrl: string) {
  const res = await fetch('/api/users/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar_url: avatarUrl }),
  })
  const { data } = await res.json()
  return data
}
```

### Step 3 — Wire them together in a component

```js
async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0]
  if (!file) return

  // 1. Get current user ID
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Upload image, get URL back
  const avatarUrl = await uploadAvatar(file, user.id)

  // 3. Save URL to profile
  await updateProfileAvatar(avatarUrl)
}
```

### Why it works this way

The database only stores a **URL string**, not the image bytes. The actual file lives in Supabase Storage (a separate file store). This keeps the database fast and lets images be served via CDN.

---

## Quick Reference

| What you want to do | Method | Route |
|---|---|---|
| Get my profile | GET | `/api/users/me` |
| Update my profile | PUT | `/api/users/me` |
| Get my preferences | GET | `/api/users/me/preferences` |
| Save my preferences | PUT | `/api/users/me/preferences` |
| Swipe on a food item | POST | `/api/swipes` |
| Get my swipe history | GET | `/api/swipes` |
| Get my favorites | GET | `/api/favorites` |
| Add to favorites | POST | `/api/favorites` |
| Remove from favorites | DELETE | `/api/favorites/:foodId` |
| Get recommendations | GET | `/api/recommendations` |
| Check DB health | GET | `/api/health` |

---

## Common Mistakes

**"I'm getting 401 Unauthorized"**
You're not logged in. Make sure the user has authenticated before calling the route.

**"I tried to insert into `profiles` but got an error"**
Don't insert into `profiles` manually. It's created automatically via a database trigger when someone signs up.

**"I want to save image data directly"**
Don't. Upload the file to Supabase Storage and save the URL. See the [Profile Upload Example](#profile-upload-example).

**"My array field (like `cuisine_interests`) isn't saving"**
Make sure you're passing a JSON array, not a comma-separated string:
```js
// Wrong
cuisine_interests: "Italian, Mexican"

// Right
cuisine_interests: ["Italian", "Mexican"]
```
