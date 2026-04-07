# FreshMind

FreshMind is a polished SaaS-style React product for AI-powered kitchen tracking, food waste reduction, and smarter home food decisions.

Live product areas include:
- startup-grade landing page with Framer Motion product storytelling
- login and signup with Supabase-ready server auth plus local fallback
- food tracker with expiry states and swipe-to-delete interactions
- AI Studio workspace with kitchen health scoring, smart actions, demand forecasting, and marketplace pricing guidance
- server-backed AI recipe generation via `/api/recipes`
- server-backed forecast intelligence via `/api/forecast`
- Stripe-ready billing flow via `/api/billing-checkout`
- session validation via `/api/auth/*` and workspace persistence via `/api/workspace`
- live product data hydration and sync via `/api/app-data`
- health endpoint via `/api/health`
- savings analytics and custom SVG product charts
- leftover marketplace and nearby restaurant deals
- mobile-ready install metadata via web manifest and app icons
- installable PWA flow with service worker support and browser install prompt

## Tech Stack

- React
- Framer Motion
- Tailwind CSS via CDN utilities
- Lucide React
- Vite

## Local Development

1. Install dependencies:
   `npm install`
2. Start the app:
   `npm run dev`
3. Build for production:
   `npm run build`

## Anthropic Setup

FreshMind now supports both client and server AI keys:

- `ANTHROPIC_API_KEY`
- `VITE_ANTHROPIC_API_KEY` (optional fallback)

Create a local env file from `.env.example` and add your key if you want live recipe responses. If no key is present or the request fails, the app falls back to built-in smart recipe suggestions.

## Billing Setup

FreshMind includes a Stripe-ready checkout endpoint. To enable live billing, set:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_PRICE_SCALE`

Without those env vars, the billing UI still works in demo mode and explains what is missing.

## Supabase Auth Setup

FreshMind now supports a production-shaped auth flow through:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_WORKSPACE_TABLE` (optional, defaults to `workspace_profiles`)
- `SUPABASE_FOOD_ITEMS_TABLE` (optional, defaults to `food_items`)
- `SUPABASE_RECIPES_TABLE` (optional, defaults to `recipes`)
- `SUPABASE_MARKETPLACE_TABLE` (optional, defaults to `marketplace_listings`)
- `SUPABASE_RESTAURANT_DEALS_TABLE` (optional, defaults to `restaurant_deals`)
- `SUPABASE_SAVINGS_TABLE` (optional, defaults to `savings_snapshots`)

When Supabase env vars are present, the frontend uses:

- `/api/auth/signup`
- `/api/auth/login`
- `/api/auth/session`
- `/api/workspace`
- `/api/app-data`

Without those env vars, FreshMind automatically falls back to the local prototype auth path.

Production SQL and deployment handoff:

- [workspace_profiles.sql](C:\Users\Ayush%20Rawat\Documents\New%20project\supabase\workspace_profiles.sql)
- [app_data_schema.sql](C:\Users\Ayush%20Rawat\Documents\New%20project\supabase\app_data_schema.sql)
- [data-model.md](C:\Users\Ayush%20Rawat\Documents\New%20project\docs\data-model.md)
- [production-setup.md](C:\Users\Ayush%20Rawat\Documents\New%20project\docs\production-setup.md)

## Project Structure

- `src/main.jsx` contains the main product app
- `api/recipes.js` powers server-side AI recipe generation
- `api/forecast.js` powers server-side forecasting and operational insights
- `api/billing-checkout.js` powers Stripe-ready billing sessions
- `api/config.js` exposes backend capability flags to the frontend
- `api/health.js` exposes a simple readiness and capability health check
- `api/app-data.js` handles authenticated product data hydration and replacement sync for core entities
- `api/auth/` contains Supabase-backed signup, login, and session validation
- `api/workspace.js` handles workspace profile hydration and persistence
- `lib/server/` contains shared server helpers
- `supabase/workspace_profiles.sql` contains the production table, trigger, and RLS policies
- `supabase/app_data_schema.sql` contains the production-ready app tables for food, recipes, listings, deals, and savings
- `docs/data-model.md` maps the current frontend state to the production persistence model
- `index.html` provides the Vite entry shell, fonts, and Tailwind config
- `vite.config.js` adds React support and bundle chunking
- `public/manifest.webmanifest` makes the app install-ready
- `public/sw.js` provides the PWA shell cache and installable offline support

## Notes

- Authentication now supports Supabase-backed sessions when env vars are configured, with local fallback for prototype use.
- Recipe generation, forecasting, and billing now have server-side API surfaces so the app is closer to a real SaaS architecture.
- Workspace persistence uses Supabase when `SUPABASE_SERVICE_ROLE_KEY` is available, otherwise it stays in demo mode.
- Food items, saved recipes, marketplace listings, and savings history now support authenticated server sync through the same Supabase backend.
- The Supabase SQL files now cover both account data and the main product entities, so the app is ready for a real database-backed migration path.
- `/api/health` is available for uptime checks and quick deployment verification.
- The app is fully responsive and designed to be portfolio-ready.
