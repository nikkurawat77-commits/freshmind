# FreshMind

FreshMind is a polished SaaS-style React product for AI-powered kitchen tracking, food waste reduction, and smarter home food decisions.

Live product areas include:
- startup-grade landing page with Framer Motion product storytelling
- login and signup with localStorage session handling
- food tracker with expiry states and swipe-to-delete interactions
- AI Studio workspace with kitchen health scoring, smart actions, demand forecasting, and marketplace pricing guidance
- server-backed AI recipe generation via `/api/recipes`
- server-backed forecast intelligence via `/api/forecast`
- Stripe-ready billing flow via `/api/billing-checkout`
- savings analytics and custom SVG product charts
- leftover marketplace and nearby restaurant deals
- mobile-ready install metadata via web manifest and app icons

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

## Project Structure

- `src/main.jsx` contains the main product app
- `api/recipes.js` powers server-side AI recipe generation
- `api/forecast.js` powers server-side forecasting and operational insights
- `api/billing-checkout.js` powers Stripe-ready billing sessions
- `api/config.js` exposes backend capability flags to the frontend
- `lib/server/` contains shared server helpers
- `index.html` provides the Vite entry shell, fonts, and Tailwind config
- `vite.config.js` adds React support and bundle chunking
- `public/manifest.webmanifest` makes the app install-ready

## Notes

- Authentication is localStorage-based for product prototyping.
- Recipe generation, forecasting, and billing now have server-side API surfaces so the app is closer to a real SaaS architecture.
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` are documented for the next auth upgrade step, even though the current frontend session flow is still localStorage-based.
- The app is fully responsive and designed to be portfolio-ready.
