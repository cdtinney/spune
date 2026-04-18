# AGENTS.md

> Guide for AI coding agents working in this repository.

## Project Overview

**Spune** is a Zune-inspired Spotify "Now Playing" visualizer. A React SPA polls a custom Express back-end for the currently playing track, then renders a Zune-style animated mosaic of related artist album covers as the background.

This is a **pnpm monorepo** with two packages:

| Package           | Name           | Description              |
| ----------------- | -------------- | ------------------------ |
| `packages/client` | `spune-client` | React 19 + Vite SPA      |
| `packages/server` | `spune-server` | Express + TypeScript API |

### Monorepo Structure

```
packages/
  client/                # React 19 + Vite SPA
    src/
      api/               # Axios API calls to the server
      components/        # UI components (AlbumGrid, SongCard, etc.)
      contexts/          # React contexts (UserContext, SpotifyContext)
      hooks/             # Custom hooks (useNowPlayingPoller, useAlbumGrid, etc.)
      pages/             # Page components (Home, Visualization, Error)
      types/             # TypeScript types (spotify.ts, ui.ts)
  server/                # Express + TypeScript API
    src/
      auth/              # Passport.js serialization/deserialization
      cache/             # LRU caches for related artists, artist IDs, artist albums
      config/            # App configuration and path helpers
      database/          # PostgreSQL pool, migrations, and user queries
      logger/            # Winston logger setup
      middleware/        # Express middleware (rate limiting)
      routes/            # API route handlers (auth, spotify)
      spotify/           # Spotify API integration and album discovery pipeline
      types/             # TypeScript types (user, spotify, external APIs)
```

## Architecture

### Client-Server Communication

The client is a Vite SPA served at `127.0.0.1:3000` in dev. All `/api/*` requests are proxied to the Express server at `127.0.0.1:5000` via Vite's dev proxy. In production, the Express server serves the built client as static files.

Three API endpoints:

- `GET /api/auth/user` — returns the authenticated user (or empty object)
- `GET /api/spotify/me/player` — returns the current playback state
- `GET /api/spotify/currently-playing/related-albums?songId=<id>` — returns related artist albums

The client polls `/api/spotify/me/player` every 3 seconds. When the album changes, it fetches related albums.

### Auth Flow

1. User clicks Login → `window.location.assign('/api/auth/spotify')`
2. Passport redirects to Spotify OAuth (scopes: `user-read-private`, `user-read-email`, `user-read-playback-state`)
3. Spotify redirects to `SPOT_REDIRECT_URI` → `/api/auth/spotify/callback`
4. Passport verify callback upserts the user in PostgreSQL with access/refresh tokens
5. Success redirects to `CLIENT_HOST/#/visualization`
6. On every subsequent request, `deserializeUser` loads the user from DB by `spotifyId` stored in the session
7. Token refresh: `apiRequestWithRefresh` checks if `tokenUpdated + expiresIn <= Date.now()` and refreshes via `passport-oauth2-refresh` if expired

### Album Discovery Pipeline

Entry: `getCurrentlyPlayingRelatedAlbums(spotifyApi, songId)` in `packages/server/src/spotify/api/helpers/getCurrentlyPlayingRelatedAlbums.ts`

1. Verify the `songId` matches the currently playing track
2. Collect track artist IDs from both song and album artists
3. Fetch track artists' own albums via Spotify API (cached 30 min)
4. Fetch related artist names from **Last.fm** and **ListenBrainz** in parallel (cached 1 hour)
5. Resolve related artist names to Spotify IDs (in batches of 5, cached 1 hour including "not found")
6. Fetch related artist albums until ≥200 total (cached 30 min)
7. Combine and deduplicate (strip edition suffixes like "Deluxe Edition"), track artist albums first

## Key Conventions

- **TypeScript**: `strict: true` in both packages. Client uses `noEmit` (Vite transpiles). Server compiles to CommonJS in `dist/`.
- **Testing**: Vitest for both packages. Client uses `jsdom` environment + `@testing-library/react`. Server uses `node` environment. Tests live in `src/__tests__/` or `src/**/__tests__/`.
- **Formatting**: Prettier (single quotes, trailing commas, 100 char width, 2-space indent). Run `pnpm format:check` to verify.
- **Linting**: ESLint v9 flat config with `typescript-eslint` recommended. `eslint-config-prettier` disables style rules. Unused vars prefixed `_` are allowed.
- **Package manager**: pnpm 10 with workspaces. Always use `pnpm`, never `npm` or `yarn`.
- **Routing**: Hash-based routing (`HashRouter`) so the server only needs to serve `index.html`.

## Common Tasks

### Add a new API endpoint

1. Add the route handler in `packages/server/src/routes/` (either `auth.ts` or `spotify.ts`, or create a new file).
2. If creating a new route file, mount it in `packages/server/src/routes/index.ts`.
3. Add an API function in `packages/client/src/api/` to call the endpoint.
4. Add tests for the route handler.

### Add a new React component

1. Create the component file in `packages/client/src/components/`.
2. Add types to `packages/client/src/types/` if needed.
3. Import and use in the appropriate page or parent component.
4. Add tests in `packages/client/src/__tests__/` or a co-located `__tests__` directory.

### Add a database migration

1. Create a new SQL file in `packages/server/src/database/migrations/` (e.g., `002_description.sql`).
2. Update `docker-compose.dev.yml` and `docker-compose.yml` to mount the new migration file.
3. Update the CI workflow to run the new migration in the `server` job.

## Gotchas

- **Spotify redirect URI must use `127.0.0.1`**, not `localhost`, for local development. Spotify's OAuth doesn't support `localhost`.
- **Session cookie port mismatch**: In dev, `SPOT_REDIRECT_URI` must point to port 3000 (Vite), not 5000 (Express). The Vite proxy forwards the callback to Express, and the session cookie must be set on the origin the browser visits.
- **dotenv load order**: `packages/server/app.ts` uses dynamic `import()` to ensure `dotenv.config()` runs before any module-level code reads `process.env`. Do not add top-level imports of modules that read env vars.
- **Rate limiting disabled in dev**: All rate limiters in `packages/server/src/middleware/rateLimiter.ts` are passthrough when `NODE_ENV !== 'production'`.
- **`trust proxy: 1`** is set in `createApp.ts` for Caddy reverse proxy in production. Don't remove this.
- **`LAST_FM_API_KEY`** is optional. If unset, only ListenBrainz is used for related artist discovery.
- **Client build output**: Goes to `packages/client/build/`, not the default `dist/`.
- **Server tests need Spotify env vars**: Route tests that call `createApp()` require `SPOT_CLIENT_ID`, `SPOT_CLIENT_SECRET`, and `SPOT_REDIRECT_URI` to be set (any non-empty value works). The `scripts/pre-pr.sh` script sets test defaults automatically. CI also sets these in the `server` job.

## Pre-PR Checklist

Run the full validation suite locally before opening a PR:

```bash
./scripts/pre-pr.sh
```

This runs:

1. `pnpm format:check` — Prettier formatting
2. `pnpm lint` — ESLint for both packages
3. `pnpm client:test` — Client Vitest tests
4. `pnpm server:test` — Server Vitest tests
5. `pnpm client:build` — Client production build
6. `pnpm --filter spune-client exec tsc --noEmit` — Client type check
7. `pnpm --filter spune-server exec tsc --noEmit` — Server type check

All checks must pass. CI runs these same checks on every push and PR to `main`.
