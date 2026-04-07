# FreshMind

FreshMind is a polished SaaS-style React product for AI-powered kitchen tracking, food waste reduction, and smarter home food decisions.

Live product areas include:
- startup-grade landing page with Framer Motion product storytelling
- login and signup with localStorage session handling
- food tracker with expiry states and swipe-to-delete interactions
- AI Studio workspace with kitchen health scoring, smart actions, demand forecasting, and marketplace pricing guidance
- Claude-powered recipe suggestion flow with graceful fallback logic
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

FreshMind looks for an Anthropic key using:

`VITE_ANTHROPIC_API_KEY`

Create a local env file from `.env.example` and add your key if you want live recipe responses. If no key is present or the request fails, the app falls back to built-in smart recipe suggestions.

## Project Structure

- `src/main.jsx` contains the main product app
- `index.html` provides the Vite entry shell, fonts, and Tailwind config
- `vite.config.js` adds React support and bundle chunking
- `public/manifest.webmanifest` makes the app install-ready

## Notes

- Authentication is localStorage-based for product prototyping.
- Recipe generation is production-shaped, but still depends on a client-side environment key in this version.
- The AI Studio experience uses deterministic product logic for forecasting, scoring, and pricing guidance so the app still feels complete without server infrastructure.
- The app is fully responsive and designed to be portfolio-ready.
