# Binge — Frontend

Next.js 14 app with a swipe-based food discovery UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Swipe UI | `react-tinder-card` |
| Auth | Supabase Auth (client-side) |

---

## Project Structure

```
my-app/
├── app/
│   ├── layout.tsx          # Root layout (fonts, global styles)
│   ├── page.tsx            # Home / landing page
│   └── globals.css
├── components/
│   ├── SwipeCard.tsx       # Individual food card
│   └── SwipeDeck.tsx       # Deck of swipeable cards
├── data/
│   └── dummyData.ts        # Placeholder food data (replace with API calls)
├── public/                 # Static assets
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting Started

### 1. Install dependencies

```bash
cd my-app
npm install
```

### 2. Environment variables

Create a `.env.local` file in `my-app/`:

```env
# Supabase public keys (safe for the browser)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Connecting to the Backend

API calls to the Express backend should go through a shared API client.
Create `lib/apiClient.ts` that reads `NEXT_PUBLIC_API_URL` and attaches the
Supabase JWT to every request header:

```ts
import { supabase } from './supabaseClient';

export async function apiFetch(path: string, init?: RequestInit) {
  const { data: { session } } = await supabase.auth.getSession();
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token ?? ''}`,
      ...init?.headers,
    },
  });
}
```

---

## Npm Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |
