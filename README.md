# Binge — Food Discovery App

An interactive food discovery platform where users swipe through restaurant and recipe suggestions that adapt to their personal tastes.

---

## Repository Structure

```
Binge-SWE/
└── my-app/      # Next.js 14 (App Router, TypeScript, Tailwind, Supabase)
```

---

## Core Idea

Most food discovery platforms rely on manual searching. Binge introduces a **discovery-first approach**: users swipe through curated food cards and the system learns from their reactions.

The platform adapts to:
- Likes / skips / super-likes
- Dietary restrictions and allergies
- Cuisine preferences
- Past activity

---

## Key Features (Planned)

| Feature | Status |
|---|---|
| Swipe-based food discovery | In progress |
| Personalized onboarding | Planned |
| Restaurant recommendations | Planned |
| Recipe discovery | Planned |
| Favorites system | Planned |
| AI food assistant | Planned |

---

## Architecture

```
┌──────────────────────────────────────────┐
│   Next.js (my-app/)                      │
│                                          │
│  Pages / Components (React)              │
│  ↕                                       │
│  /app/api/* (Next.js Route Handlers)     │
│  ↕                                       │
│  Supabase JS client (server-side)        │
└──────────────────┬───────────────────────┘
                   │
      ┌────────────▼────────────┐
      │  Supabase (PostgreSQL)  │
      │                         │
      │  profiles               │
      │  user_preferences       │
      │  foods                  │
      │  swipes                 │
      │  favorites              │
      │  RLS enabled            │
      └─────────────────────────┘
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update profile |
| GET | `/api/users/me/preferences` | Get dietary/cuisine preferences |
| PUT | `/api/users/me/preferences` | Save preferences |
| POST | `/api/swipes` | Record a swipe |
| GET | `/api/swipes` | Swipe history (paginated) |
| GET | `/api/favorites` | List favorites |
| POST | `/api/favorites` | Add a favorite |
| DELETE | `/api/favorites/:foodId` | Remove a favorite |
| GET | `/api/recommendations` | Get personalized food recommendations |

---

## Quick Start

### 1. Clone

```bash
git clone https://github.com/GGlencoe/Binge-SWE
cd Binge-SWE/my-app
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** in your Supabase dashboard
3. Run each file in `my-app/db/` **in order** (001 → 005)
4. Optionally run `db/seed.sql` for sample data

### 3. Configure environment

```bash
cp .env.local.example .env.local
# Fill in your Supabase credentials (see .env.local.example for field descriptions)
```

### 4. Run

```bash
npm install
npm run dev   # http://localhost:3000
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server at http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed-recipes` | Fetch recipes from Spoonacular and upsert into Supabase |
| `npm run seed-recipes -- --dry-run` | Preview what would be seeded without writing to the DB |

### Seeding recipes

Spoonacular's free tier allows **150 API points per day**. Each seed run costs ~99 points (9 cuisines × ~11 calls). Run at most once daily.

Use `--dry-run` to verify output without consuming your write quota or hitting the database. The flag still fetches from Spoonacular, so avoid running it repeatedly.

---

## Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth |
| Icons | Lucide React |

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
