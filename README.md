# Aurelia Nigeria

Cinematic luxury-automotive landing page built with React 18, Vite 5, Tailwind CSS 3, Lucide React and Three.js (installed and ready to use).

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages
`vite.config.js` uses `base: "./"`, so it works under any repo name.

**Option A – GitHub Actions (recommended)**
1. Push the project to a GitHub repo (branch `main`).
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. Every push to `main` deploys automatically.

**Option B – gh-pages branch**
```bash
npm run deploy
```
Then Settings → Pages → Source: branch `gh-pages`, folder `/ (root)`.

## Debug panel
The video status badge shows only in dev mode (`import.meta.env.DEV`) and is hidden in production builds.
