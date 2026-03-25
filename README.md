# Binge — Food Discovery App

An interactive food discovery platform where users swipe through restaurant and recipe suggestions that adapt to their personal tastes.

---

## Repository Structure

```
Binge-SWE/
├── web/         # Web frontend  — Next.js (App Router, TypeScript, Tailwind CSS)
├── mobile/      # Mobile app    — Expo / React Native (TypeScript)
├── backend/     # Backend API   — Express + Supabase (PostgreSQL, TypeScript)
└── README.md
```

Each subdirectory has its own README with setup instructions:

- [Web README](web/README.md)
- [Mobile README](mobile/README.md)
- [Backend README](backend/README.md)

---

## Core Idea

Most food discovery platforms rely on manual searching. Binge introduces a **discovery-first approach**: users swipe through curated food cards and the system learns from their reactions.

The platform adapts to:
- Likes / skips / super-likes
- Dietary restrictions and allergies
- Cuisine preferences
- Past activity

---

## Key Features

| Feature | Status |
|---|---|
| Swipe-based food discovery | In progress |
| Bottom navigation (Recipes / Profile / Restaurants) | In progress |
| Personalized onboarding | Planned |
| Restaurant recommendations | Planned |
| Favorites system | Planned |
| AI food assistant | Planned |

---

## Architecture Overview

```
┌─────────────────────┐        JWT        ┌──────────────────────────┐
│   Web Frontend      │ ───────────────── │   Express Backend        │
│   (web/)            │   REST /api/v1    │   (backend/)             │
│                     │                   │                          │
│  - Swipe UI         │                   │  - Auth middleware        │
│  - Supabase Auth    │                   │  - User / Swipe / Fav    │
│  - API client       │                   │  - Recommendations       │
└─────────────────────┘                   └──────────┬───────────────┘
                                                     │ Supabase JS
┌─────────────────────┐                   ┌──────────▼───────────────┐
│   Mobile App        │ ───────────────── │   Supabase (PostgreSQL)  │
│   (mobile/)         │   REST /api/v1    │                          │
│                     │        JWT        │  profiles                │
│  - Swipe UI         │                   │  user_preferences        │
│  - Supabase Auth    │                   │  foods                   │
│  - API client       │                   │  swipes                  │
└─────────────────────┘                   │  favorites               │
                                          └──────────────────────────┘
```

---

## Quick Start

### 1. Clone the repo

```bash
git clone <repo-url>
cd Binge-SWE
```

### 2. Set up the database

1. Create a free project at [supabase.com](https://supabase.com)
2. Open the SQL Editor in your Supabase dashboard
3. Run each file in `backend/src/db/schema/` in order (001 → 005)
4. Optionally run `backend/src/db/seed/seed.sql` for sample data

### 3. Start the backend

```bash
cd backend
cp .env.example .env   # fill in your Supabase keys
npm install
npm run dev            # http://localhost:4000
```

### 4. Start the web app

```bash
cd web
npm install
npm run dev            # http://localhost:3000
```

### 5. Start the mobile app

```bash
cd mobile
npm install
npx expo start         # scan QR code with Expo Go
```

---

## Technology Stack

| Area | Technology |
|---|---|
| Web frontend | Next.js 16, TypeScript, Tailwind CSS, Framer Motion, lucide-react |
| Mobile app | Expo SDK 52, React Native, Expo Router, Reanimated, Gesture Handler |
| Backend | Node.js, Express 4, TypeScript |
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth (JWT) |
| External APIs | Yelp / Google Places (restaurants), Spoonacular / Edamam (recipes) |

---

## Project Goals

- Build a modern, engaging food discovery experience
- Apply recommendation system concepts
- Practice full-stack development with Next.js and Supabase
- Learn collaborative software development

---

## Link to repo
https://github.com/GGlencoe/Binge-SWE

---

## Team

Developed as part of CSCI-3300 Software Engineering at Saint Louis University.

---

## License

TBD
