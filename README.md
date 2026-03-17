# Binge — Food Discovery App

An interactive food discovery platform where users swipe through restaurant and recipe suggestions that adapt to their personal tastes.

---

## Repository Structure

```
Binge-SWE/
├── my-app/      # Frontend — Next.js 14 (App Router, TypeScript, Tailwind)
├── backend/     # Backend  — Express + Supabase (PostgreSQL, TypeScript)
└── README.md
```

Each subdirectory has its own README with setup instructions:

- [Frontend README](my-app/README.md)
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

## Architecture Overview

```
┌─────────────────────┐        JWT        ┌──────────────────────────┐
│   Next.js Frontend  │ ───────────────── │   Express Backend        │
│   (my-app/)         │   REST /api/v1    │   (backend/)             │
│                     │                   │                          │
│  - Swipe UI         │                   │  - Auth middleware        │
│  - Supabase Auth    │                   │  - User / Swipe / Fav    │
│  - API client       │                   │  - Recommendations       │
└─────────────────────┘                   └──────────┬───────────────┘
                                                     │ Supabase JS
                                          ┌──────────▼───────────────┐
                                          │   Supabase (PostgreSQL)  │
                                          │                          │
                                          │  profiles                │
                                          │  user_preferences        │
                                          │  foods                   │
                                          │  swipes                  │
                                          │  favorites               │
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

### 4. Start the frontend

```bash
cd my-app
# create .env.local with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_API_URL
npm install
npm run dev            # http://localhost:3000
```

---

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, react-tinder-card |
| Backend | Node.js, Express 4, TypeScript |
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth |
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
