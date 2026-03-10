# Binge — Backend

Node.js + Express REST API backed by [Supabase](https://supabase.com) (PostgreSQL).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express 4 |
| Language | TypeScript 5 |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (JWT) |
| ORM / Query | Supabase JS Client (`@supabase/supabase-js`) |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.ts           # Supabase service-role client
│   ├── db/
│   │   ├── schema/               # SQL migration files (run in order)
│   │   │   ├── 001_profiles.sql
│   │   │   ├── 002_preferences.sql
│   │   │   ├── 003_foods.sql
│   │   │   ├── 004_swipes.sql
│   │   │   └── 005_favorites.sql
│   │   └── seed/
│   │       └── seed.sql          # Sample data for local development
│   ├── routes/                   # Express routers (URL → controller)
│   ├── controllers/              # Business logic, talks to Supabase
│   ├── middleware/
│   │   ├── auth.ts               # JWT validation middleware
│   │   └── errorHandler.ts       # Global error handler + asyncHandler wrapper
│   ├── services/                 # External API integrations (Yelp, Spoonacular…)
│   ├── types/
│   │   └── index.ts              # Shared TypeScript types matching DB schema
│   └── index.ts                  # Server entry point
├── .env.example                  # Copy to .env and fill in values
├── package.json
└── tsconfig.json
```

---

## Getting Started

### 1. Prerequisites

- Node.js 20+
- A free [Supabase](https://supabase.com) account and project

### 2. Install dependencies

```bash
cd backend
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:
- `SUPABASE_URL` — found in your Supabase project under **Project Settings → API**
- `SUPABASE_ANON_KEY` — the public anon key (same page)
- `SUPABASE_SERVICE_ROLE_KEY` — the secret service role key (same page, keep this private)

### 4. Run the database migrations

Open the [Supabase SQL Editor](https://supabase.com/dashboard) for your project and run each file in `src/db/schema/` **in order** (001 → 005).

Optionally run `src/db/seed/seed.sql` to populate sample food data.

### 5. Start the development server

```bash
npm run dev
```

The server starts on `http://localhost:4000`.

---

## API Reference

All endpoints are prefixed with `/api/v1`.
Protected routes require an `Authorization: Bearer <supabase-jwt>` header.

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Server health check |

### Users

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/users/me` | Yes | Get current user profile |
| PUT | `/api/v1/users/me` | Yes | Update current user profile |
| GET | `/api/v1/users/me/preferences` | Yes | Get dietary preferences |
| PUT | `/api/v1/users/me/preferences` | Yes | Create / update preferences |

### Swipes

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/swipes` | Yes | Record a swipe (`like`, `skip`, `super_like`) |
| GET | `/api/v1/swipes` | Yes | Get swipe history (paginated) |

### Favorites

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/favorites` | Yes | List all favorites |
| POST | `/api/v1/favorites` | Yes | Add a food to favorites |
| DELETE | `/api/v1/favorites/:foodId` | Yes | Remove a food from favorites |

### Recommendations

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/recommendations` | Yes | Get personalized food recommendations |

---

## Database Schema

```
auth.users (Supabase managed)
    │
    └── profiles           ← extends auth.users (1:1)
            │
            ├── user_preferences   (1:1 per user)
            ├── swipes             (many per user → foods)
            └── favorites          (many per user → foods)

foods  ← central catalog (restaurants, recipes, dishes)
```

### Row Level Security (RLS)

All tables have RLS enabled. Each user can only read and modify their own rows. The `foods` table is readable by all authenticated users.

---

## Authentication Flow

1. The frontend authenticates the user via **Supabase Auth** (email/password, OAuth, etc.)
2. Supabase returns a JWT.
3. The frontend sends the JWT in the `Authorization: Bearer <token>` header on every API request.
4. The `requireAuth` middleware validates the token using the Supabase anon key.
5. The validated `user.id` is attached to `req.userId` for use in controllers.

---

## Npm Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with hot reload (nodemon + ts-node) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output (production) |

---

## Environment Variables

See [`.env.example`](.env.example) for the full list.
