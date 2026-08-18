# Cheat Sheets PWA

Offline-capable PWA of programming cheat sheets. Vite + React.

## Develop
- `npm install`
- `npm run dev`
- `npm test`

## Add a cheat sheet
Create `src/content/<language>/<slug>.md` with frontmatter:
`language`, `slug`, `title`, `order` (required), `source` (optional). Rebuild.

## Deploy
Netlify: build `npm run build`, publish `dist`. `netlify.toml` and `public/_redirects` are included.
