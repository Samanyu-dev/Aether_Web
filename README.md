# Aether Web

Frontend experience for the Aether platform: a local-first cognition debugger for AI agents.

## Live Links
- Production: [https://aether-dev.vercel.app](https://aether-dev.vercel.app)
- Core Platform Repo: [Aether](https://github.com/Samanyu-dev/Aether)
- This Frontend Repo: [Aether_Web](https://github.com/Samanyu-dev/Aether_Web)

## What This App Covers
- Authentication flow (Supabase)
- Trace and replay UX for agent workflows
- Visual debugging surfaces for cognitive graph traversal
- Product, pricing, docs, and legal web pages

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Zustand + modern UI primitives (Radix)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Set these before running locally or deploying:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The app can also read `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as a fallback key.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Deployment

This project is deployed on Vercel. Standard flow:
1. Push to `main`.
2. Vercel builds and deploys.
3. Confirm Supabase environment variables are set in Vercel Project Settings.

## Notes
- This repository was initially bootstrapped from v0 and then iterated with custom product-specific functionality.
- For SDK and full platform context, see the main [Aether](https://github.com/Samanyu-dev/Aether) repository.