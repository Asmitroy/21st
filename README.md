# 21st — Blooming Digital Love Journey

Short docs for the `21st` Vite + React + TypeScript project in this workspace.

Title from `index.html`: Blooming Digital Love Journey

## What this is

This folder is a Vite React + TypeScript site. It uses Tailwind/PostCSS and includes UI components under `src/components`. The app entry is `index.html` and `src/main.tsx`.

## Important files

- `index.html` — app shell and fonts (the title is "Blooming Digital Love Journey").
- `src/main.tsx` — app entry (mounts React to `#root`).
- `src/App.tsx` — main application component.
- `src/components/` — reusable UI components such as `AudioPlayer.tsx`, `Layer1Essence.tsx`, etc.
- `package.json` — scripts and dependencies.
- `vite.config.ts` — Vite configuration.
- `tsconfig.app.json` / `tsconfig.json` — TypeScript configuration.
- `tailwind.config.js` / `postcss.config.js` — Tailwind/PostCSS config.

## Scripts (from package.json)

Run these from the `21st` folder.

- Install dependencies:

  npm install

- Start dev server (hot-reload):

  npm run dev

- Build production bundle:

  npm run build

- Preview production build locally:

  npm run preview

- Lint the project (ESLint):

  npm run lint

- Type-check only (no emit):

  npm run typecheck

These scripts assume Node/npm is installed and available on your PATH. On Windows PowerShell you can run the commands as-is.

## How to develop locally

1. Open a PowerShell and change to the project directory:

   cd .\21st

2. Install dependencies (only needed once, or after package changes):

   npm install

3. Start dev server and open the local URL printed by Vite:

   npm run dev

4. Edit `src/components` or `src/App.tsx`. Vite will hot-reload changes.

5. If you rely on TypeScript types, run `npm run typecheck` or enable your editor's TypeScript server.

## Notes & developer tips

- Fonts are loaded from Google Fonts in `index.html`.
- The project uses `@supabase/supabase-js` and `framer-motion` — check `package.json` for versions.
- Tailwind is configured; run build to produce optimized CSS for production.
- If you add new environment variables for production, configure them in your hosting provider and (for local previews) use a `.env` file if needed — follow Vite's env conventions.

## Troubleshooting

- If `npm run dev` fails, run `npm install` again and verify your Node version. Use a modern Node (recommended v18+).
- If TypeScript complains about missing types for a library, either install `@types/*` for that library or add a `declare module 'modname'` shim.

## Next steps (optional)

- I can add a per-project `DEVELOPMENT.md` with screenshots and a component map.
- I can add a `netlify.toml` or `vercel.json` if you want a suggested deploy config.

---

If you'd like, I can create a short `docs/COMPONENTS.md` listing the main components and their responsibilities — tell me if you want that and I'll add it.
