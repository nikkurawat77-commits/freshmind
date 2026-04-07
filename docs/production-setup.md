# FreshMind Production Setup

This document is the shortest path to getting FreshMind ready for demos, portfolio reviews, and real hosted use.

## 1. Supabase

In Supabase:

1. Open your project.
2. Enable Email auth in `Authentication` -> `Providers`.
3. Open `SQL Editor`.
4. Run [supabase/workspace_profiles.sql](C:\Users\Ayush%20Rawat\Documents\New%20project\supabase\workspace_profiles.sql).
5. Open `Project Settings` -> `API`.
6. Copy:
   - Project URL
   - anon key
   - service_role key

Recommended:
- keep email confirmation enabled for real users
- keep the `workspace_profiles` table under RLS
- never expose `service_role` outside server environment variables

## 2. Vercel Environment Variables

Add these in Vercel Project Settings -> Environment Variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_WORKSPACE_TABLE=workspace_profiles`
- `ANTHROPIC_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_PRICE_SCALE`

Apply them to:
- Production
- Preview
- Development

After adding env vars, redeploy the project.

## 3. Feature Readiness

What becomes live when env vars are present:

- `/api/auth/signup`
- `/api/auth/login`
- `/api/auth/session`
- `/api/workspace`
- `/api/recipes`
- `/api/forecast`
- `/api/billing-checkout`

Health check:

- `/api/health`

Runtime capability check:

- `/api/config`

## 4. Stripe

Create three recurring price IDs in Stripe:

- Starter
- Growth
- Scale

Paste those values into:

- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_PRICE_SCALE`

The frontend already supports demo fallback when Stripe is missing.

## 5. Portfolio / Demo Readiness

For portfolio use:

- keep demo fallback enabled
- keep a seeded demo account
- use the live URL from Vercel
- show AI Studio, billing, and marketplace in screenshots

For real usage:

- configure Supabase and Stripe
- test email signup
- test billing checkout
- test workspace save/load
- test `/api/health`

## 6. Recommended Next Upgrades

If you want FreshMind to feel even more production-grade:

1. Add real food item persistence in Supabase instead of localStorage.
2. Add Stripe webhook handling for subscription status sync.
3. Add password reset and email verification UX.
4. Add organizations / team invites.
5. Add audit logs and usage metering.
