# CordIQ — Website

Marketing site for [CordIQ](https://cordiq.xyz) — professional custom Discord bot development.

Built with **Astro** + **Tailwind CSS**, deployed on **Netlify**. The site funnels
visitors to the CordIQ Discord server, where projects are scoped and ordered.

## Development

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build to ./dist
npm run preview  # preview the production build
```

## Deployment

Pushing to `main` triggers an automatic Netlify build (`npm run build`, publish `dist/`).
Build and redirect settings live in [`netlify.toml`](./netlify.toml).

## Structure

- `src/pages/` — routes (`index`, `terms`, `privacy`)
- `src/components/` — page sections (Hero, Services, Process, FAQ, …)
- `src/layouts/` — shared layouts
- `src/styles/global.css` — brand tokens & design system
- `public/` — static assets (brand logos, generated visuals, OG image)
