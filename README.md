# Tickt

**Small tasks. Small wins.**

A friendly, responsive to-do app built with React, TypeScript, and Vite. Tasks persist in the browser via `localStorage` — no account or backend required.

## Features

- Add, edit, complete, unmark, and delete tasks
- Separate counts for total, active, and completed tasks
- All / Active / Completed filters
- Optional due date & time per task, with friendly labels ("Today · 6:00 PM", "Tomorrow · 9:30 AM", "Overdue") and a gentle amber overdue highlight
- Optional per-task notes and Low / Medium / High priority (older tasks default to Medium)
- Context-aware empty states and a completion celebration
- Automatic persistence in `localStorage` (survives page refresh)
- Responsive layout for desktop and mobile
- Accessible controls: labeled inputs, `aria-pressed` filters, `aria-label`ed action buttons, visible focus states

## Tech Stack

- [React](https://react.dev/) 19 — UI
- [TypeScript](https://www.typescriptlang.org/) 5 — type safety
- [Vite](https://vite.dev/) 6 — dev server and production bundler
- Plain CSS (no CSS framework) — styling with custom properties and media queries
- [Nunito](https://fonts.google.com/specimen/Nunito) via Google Fonts, with a system-font fallback

## Design

Warm, encouraging, and slightly playful — a helpful little companion rather than a serious productivity tool. The palette: cream background `#F6F3EA`, deep green primary `#315C4A`, amber accent `#E9A23B`, off-white surfaces `#FFFDF8`, ink text `#24312B`, muted green-grey `#718078`, and completed green `#5E8C61`.

## Getting Started

Prerequisites: [Node.js](https://nodejs.org/) 18+ (LTS 20 or 22 recommended) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Scripts

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Start the dev server with hot reload       |
| `npm run build`   | Type-check and build for production        |
| `npm run preview` | Serve the production build from `dist/` locally |

## Project Structure

```
todo-app/
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # App shell: state, handlers, layout
    ├── types.ts                # Todo / Filter / TodoCounts types
    ├── utils.ts                # id generation + stored-data validation
    ├── index.css               # All styling (responsive, hover/active states)
    ├── hooks/
    │   └── useLocalStorage.ts  # useState mirrored into localStorage
    └── components/
        ├── TodoForm.tsx        # Add-task form
        ├── FilterBar.tsx       # All/Active/Completed filters + counts
        ├── TodoList.tsx        # Task list
        ├── TodoItem.tsx        # Single row: toggle, edit, delete
        └── EmptyState.tsx      # Context-aware empty state
```

## Production Build

```bash
npm run build
```

Outputs static files to `dist/` (type-checks first). Preview the build locally:

```bash
npm run preview
```

## Deploy to Vercel

**Option 1 — CLI (quickest):**

```bash
npm i -g vercel
vercel          # first run: accept defaults, framework auto-detected as Vite
vercel --prod   # deploy to production
```

**Option 2 — Git integration:**

1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. In [vercel.com](https://vercel.com) → **Add New Project**, import the repo.
3. Vercel auto-detects Vite (build command `npm run build`, output directory `dist`). Click **Deploy**.

The app is fully static, so it also deploys as-is to Netlify, Cloudflare Pages, GitHub Pages, or any static file host.
