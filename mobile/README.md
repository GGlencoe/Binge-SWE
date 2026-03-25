# Binge — Mobile

Expo / React Native port of the Binge web app. Mirrors the web app's screens and behavior as closely as possible.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 52 / React Native |
| Language | TypeScript |
| Routing | Expo Router (file-based, same structure as Next.js App Router) |
| Swipe animation | react-native-reanimated + react-native-gesture-handler |
| Icons | @expo/vector-icons (Ionicons) |
| Auth | Supabase Auth (client-side) |

---

## Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx             # Root layout (GestureHandlerRootView + bottom nav)
│   ├── index.tsx               # Redirects to /recipes
│   ├── recipes/
│   │   └── index.tsx           # Swipe deck screen
│   ├── profile/
│   │   └── index.tsx           # Profile screen (under construction)
│   └── restaurants/
│       └── index.tsx           # Restaurants screen (under construction)
├── components/
│   ├── SwipeCard.tsx           # Individual food card (React Native port)
│   ├── SwipeDeck.tsx           # Draggable deck of cards (React Native port)
│   └── navBar.tsx              # Bottom navigation bar (React Native port)
├── data/
│   └── dummyData.ts            # Shared food data (identical to web)
├── assets/
│   └── bingeLogo.png
├── app.json                    # Expo project config
├── babel.config.js
└── tsconfig.json
```

### How this maps to `web/`

| `web/` | `mobile/` | Note |
|---|---|---|
| `app/layout.tsx` | `app/_layout.tsx` | `_` prefix required by Expo Router |
| `app/page.tsx` | `app/index.tsx` | `index` = root route in Expo Router |
| `app/recipes/page.tsx` | `app/recipes/index.tsx` | `index` = folder route in Expo Router |
| `app/profile/page.tsx` | `app/profile/index.tsx` | same |
| `app/restaurants/page.tsx` | `app/restaurants/index.tsx` | same |
| `public/bingeLogo.png` | `assets/bingeLogo.png` | RN uses `require()` instead of `/public` |

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Expo Go](https://expo.dev/go) installed on your phone **or** an Android/iOS emulator

### 1. Install dependencies

```bash
cd mobile
npm install
```

### 2. Start the development server

```bash
npx expo start
```

This opens the Expo dev tools. From here:

| Action | How |
|---|---|
| Run on your phone | Scan the QR code with the Expo Go app |
| Run on Android emulator | Press `a` (requires Android Studio + SDK) |
| Run on iOS simulator | Press `i` (macOS + Xcode only) |
| Run in browser | Press `w` |

### 3. Environment variables

Create a `.env.local` file in `mobile/` when connecting to the backend:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_API_URL=http://<your-local-ip>:4000/api/v1
```

> Use your machine's local network IP (not `localhost`) so the phone can reach the backend.

---

## Web-only features and their mobile replacements

| Web | Mobile | Reason |
|---|---|---|
| `next/link` → `Link` | `expo-router` → `Link` | Same API, different runtime |
| `next/navigation` → `usePathname` | `expo-router` → `usePathname` | Same API, different runtime |
| `lucide-react` icons | `@expo/vector-icons` Ionicons | lucide-react is DOM-only |
| Tailwind CSS | `StyleSheet.create()` | No CSS engine in React Native |
| Framer Motion | react-native-reanimated | Framer Motion is DOM-only |
| `<img>` / `next/image` | `<Image source={require(...)}>` | RN image API |
| `"use client"` directive | removed | Not a concept in React Native |
| `globals.css` | removed | No CSS in React Native |

---

## Npm Scripts

| Script | Description |
|---|---|
| `npm start` / `npx expo start` | Start Expo dev server |
| `npm run android` | Start and open on Android |
| `npm run ios` | Start and open on iOS |
