---
date: 2026-04-13T08:20:03Z
researcher: ctinney
git_commit: e71f75d4e5ba77ec11bdf8b7288e039ae8cc9a04
branch: master
repository: cdtinney/spune
topic: "Project Revival: CI/CD, Hosting, Database Migration + Additional Fixes"
tags: [research, migration, travis-ci, heroku, mongodb, spotify-api, github-actions, railway, sqlite, drizzle]
status: complete
last_updated: 2026-04-13
last_updated_by: ctinney
---

# Research: Project Revival Migration Guide

**Date**: 2026-04-13T08:20:03Z
**Researcher**: ctinney
**Git Commit**: e71f75d4e5ba77ec11bdf8b7288e039ae8cc9a04
**Branch**: master
**Repository**: cdtinney/spune

## Research Question

The project is old and doesn't work anymore. Travis CI and Heroku are deprecated (for personal use). MongoDB should be migrated to something simpler. What should each be migrated to, and what else needs fixing?

## Project Overview

Spune is a Lerna monorepo with two packages:
- **`packages/client`** — React 16 SPA (Create React App, Redux, Material UI v3)
- **`packages/server`** — Express/Node.js API (Passport.js for Spotify OAuth, Mongoose for MongoDB)

The app authenticates with Spotify, polls the user's currently playing track, fetches related artists and their albums, and displays album artwork in a visual grid.

---

## Migration 1: Travis CI → GitHub Actions

### Why

Travis CI (travis-ci.org) shut down in June 2021. The `.travis.yml` in this repo is non-functional. GitHub Actions is the natural successor for a GitHub-hosted project.

### Why GitHub Actions

| Factor | GitHub Actions | Alternatives |
|---|---|---|
| **Cost** | Free and unlimited for public repos | CircleCI: 6K credits/mo; GitLab: 400 min/mo |
| **Migration effort** | Official Travis→GHA migration guide; near 1:1 YAML mapping | Others require learning new config formats |
| **Monorepo support** | Native `paths:` filters + reusable workflows | Comparable but no ecosystem advantage |
| **Ecosystem** | Thousands of marketplace actions (Coveralls, deploy, etc.) | Smaller ecosystems |

### What Changes

| Current (Travis) | New (GitHub Actions) |
|---|---|
| `.travis.yml` | `.github/workflows/ci.yml` |
| `services: - mongodb` | `services: mongodb:` (Docker container) |
| `node_js: 11.10.1` | `actions/setup-node@v4` with Node 22 |
| `cache: npm` | Built-in `cache: 'npm'` in setup-node |
| `deploy: provider: heroku` | Separate deploy workflow or Railway/Render integration |
| Coveralls via `npm run test:coveralls` | Same command + `COVERALLS_REPO_TOKEN` secret |

### How

1. Delete `.travis.yml`
2. Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [master]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm install
      - run: npm run bootstrap
      - run: npm run client:build
      - run: npm run server:lint
      - run: npm run test:coveralls
        env:
          COVERALLS_REPO_TOKEN: ${{ secrets.COVERALLS_REPO_TOKEN }}
```

3. Add `COVERALLS_REPO_TOKEN` to GitHub repo secrets
4. Note: integration tests (`server:test:integration`) use Puppeteer and will need updating separately (see "Additional Fixes" section)

### References

- [Migrating from Travis CI to GitHub Actions](https://docs.github.com/en/actions/migrating-to-github-actions/manually-migrating-to-github-actions/migrating-from-travis-ci-to-github-actions)
- [GitHub Actions billing](https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions)

---

## Migration 2: Heroku → Railway

### Why

Heroku eliminated its free tier in November 2022. The project's Heroku deployment (configured via `heroku-postbuild` script and Travis CI deploy block) no longer works for free personal projects.

### Why Railway

| Factor | Railway | Render | Fly.io | Coolify |
|---|---|---|---|---|
| **Cost** | $5/mo all-in (includes DB) | $0 free tier (25s cold starts) or $13/mo (service + DB) | ~$5-15/mo, no free tier | ~$4-6/mo VPS + self-ops |
| **Monorepo** | Auto-detects JS monorepos | Root dir config + filters | Manual fly.toml per service | Root dir config |
| **Migration effort** | Closest mental model to Heroku | Close second | Requires Dockerfiles | Requires VPS setup |
| **DX** | Best-in-class (visual service graph, auto env injection) | Good | Good but more complex | Good but you run the server |
| **Cold starts** | None on paid plan | 25s on free tier | None | None |

### What Changes

| Current (Heroku) | New (Railway) |
|---|---|
| `heroku-postbuild` script | Railway auto-detects build commands (or configure in dashboard) |
| `process.env.PORT` | Same — Railway injects `PORT` |
| `process.env.MONGODB_URI` | Railway provisions DB and injects connection string |
| Travis CI `deploy:` block | GitHub push-to-deploy via Railway dashboard |
| Heroku encrypted API key | Not needed — Railway uses GitHub OAuth |

### How

1. Create a Railway account and project at [railway.com](https://railway.com)
2. Connect the GitHub repo — Railway auto-detects the monorepo structure
3. Configure the server service:
   - Root directory: `/` (or `packages/server` if splitting)
   - Build command: `npm install && npm run bootstrap && npm run client:build`
   - Start command: `npm run server:start`
4. Provision a database service (PostgreSQL/SQLite via Turso if migrating from MongoDB, or MongoDB if staying)
5. Set environment variables in Railway dashboard:
   - `SESSION_SECRET`
   - `SPOT_CLIENT_ID`, `SPOT_CLIENT_SECRET`, `SPOT_REDIRECT_URI`
   - `CLIENT_HOST` (Railway-provided URL)
   - Database connection string (auto-injected if using Railway's DB)
6. Remove `heroku-postbuild` from root `package.json`
7. Update Spotify app dashboard redirect URI to the Railway URL

### References

- [Railway Docs](https://docs.railway.com)
- [Deploying a Monorepo - Railway](https://docs.railway.com/guides/monorepo)
- [Railway Pricing](https://railway.com/pricing)

---

## Migration 3: MongoDB → SQLite + Drizzle ORM

### Why

The current MongoDB usage is minimal: one `User` model with 7 flat fields, three query types (`findOrCreate`, `findOne`, `findOneAndUpdate`), and session storage via `connect-mongo`. Running a MongoDB server (or paying for Atlas) is overkill for this.

### Why SQLite + Drizzle

| Factor | SQLite + Drizzle | MongoDB Atlas (stay) | Supabase (Postgres) | Turso (cloud SQLite) |
|---|---|---|---|---|
| **Cost** | Free forever (file-based) | Free (512 MB, M0 tier) | Free (pauses after 7 days idle) | Free (500M reads/mo) |
| **Complexity** | Zero — no server, no account | Low — just change URI | Medium — new platform | Low — swap driver |
| **Migration effort** | Small — replace ~100 lines | None — just update `MONGODB_URI` | Medium — rewrite to SQL | Small — same as SQLite |
| **Local dev** | Just works (`.sqlite` file) | Need running mongod or Atlas | Need running postgres or cloud | Just works locally |
| **Operational burden** | None | Cloud dependency | Cloud dependency + pause issue | Cloud dependency |

**If deploying to a platform without persistent disk** (most cloud platforms), use **Turso** instead of bare SQLite. The Drizzle schema is identical — you only swap the driver from `better-sqlite3` to `@libsql/client`.

### What Changes

| Current | New |
|---|---|
| `mongoose` + `mongoose-findorcreate` | `drizzle-orm` + `better-sqlite3` (or `@libsql/client` for Turso) |
| `connect-mongo` (session store) | `better-sqlite3-session-store` or `connect-sqlite3` |
| `packages/server/src/database/mongoDB.js` | New `db.ts` with Drizzle connection |
| `packages/server/src/database/schema/User.js` | New Drizzle schema definition |
| `MONGODB_URI` env var | `DATABASE_URL` or file path (local) / Turso URL (cloud) |

### How

1. Install new dependencies:
   ```bash
   cd packages/server
   npm install drizzle-orm better-sqlite3
   npm install -D drizzle-kit @types/better-sqlite3
   npm install better-sqlite3-session-store  # or connect-sqlite3
   ```

2. Define Drizzle schema (replacing `User.js`):
   ```js
   import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

   export const users = sqliteTable('users', {
     id: integer('id').primaryKey({ autoIncrement: true }),
     spotifyId: text('spotify_id').unique().notNull(),
     spotifyAccessToken: text('spotify_access_token'),
     spotifyRefreshToken: text('spotify_refresh_token'),
     tokenUpdated: integer('token_updated'),
     expiresIn: integer('expires_in'),
     displayName: text('display_name'),
     photos: text('photos', { mode: 'json' }),  // JSON-serialized array
   });
   ```

3. Replace MongoDB queries:
   - `User.findOrCreate({ spotifyId })` → `db.select().from(users).where(eq(users.spotifyId, id))` + `db.insert(users).values(...)` if not found
   - `User.findOne({ spotifyId })` → `db.select().from(users).where(eq(users.spotifyId, id))`
   - `User.findOneAndUpdate(...)` → `db.update(users).set({ ... }).where(eq(users.spotifyRefreshToken, token))`

4. Replace session store in `initApp.js`:
   ```js
   // Old: const MongoStore = require('connect-mongo')(session);
   // New:
   const SqliteStore = require('better-sqlite3-session-store')(session);
   const Database = require('better-sqlite3');
   const sessionsDb = new Database('./sessions.db');

   app.use(session({
     store: new SqliteStore({ client: sessionsDb, expired: { clear: true } }),
     // ... rest of session config
   }));
   ```

5. Remove old dependencies:
   ```bash
   npm uninstall mongoose mongoose-findorcreate connect-mongo
   ```

6. Run migrations: `npx drizzle-kit generate && npx drizzle-kit migrate`

### For Turso (cloud deployment)

Swap the driver — the schema stays the same:
```bash
npm install @libsql/client
npm uninstall better-sqlite3
```
```js
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = drizzle(client);
```

### References

- [Drizzle ORM - SQLite](https://orm.drizzle.team/docs/get-started-sqlite)
- [Turso Pricing](https://turso.tech/pricing)
- [better-sqlite3-session-store](https://github.com/ironboy/better-sqlite3-express-session-store)

---

## Additional Fixes Required

### CRITICAL: Spotify API Breaking Changes

The Spotify Web API has undergone major breaking changes since 2019. Several directly affect this project.

#### 1. Related Artists Endpoint — Deprecated (CRITICAL)

The `GET /artists/{id}/related-artists` endpoint was **restricted for new apps in November 2024** and is deprecated. This is the **core feature** of the app (fetching related artists to display album artwork).

- If the registered Spotify app predates Nov 2024 and has Extended Quota Mode, it still works (for now)
- New apps cannot access it at all
- Extended Quota Mode is now only available to **organizations with 250K+ MAU** — not individuals
- **Impact**: The app's primary feature may be permanently broken. You'll need to either:
  - Verify your existing app still has access
  - Redesign the feature around available endpoints (e.g., use search, recommendations from playlists, or artist's own albums only)

**Source**: [Spotify Nov 2024 Changes](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api)

#### 2. OAuth Redirect URI — localhost Banned (CRITICAL)

As of November 27, 2025, `http://localhost` is no longer allowed as a redirect URI. You must use `http://127.0.0.1:PORT/callback` instead. Update both:
- The Spotify Developer Dashboard app settings
- `SPOT_REDIRECT_URI` environment variable / `passportStrategy.js` config

**Source**: [OAuth Migration Reminder](https://developer.spotify.com/blog/2025-10-14-reminder-oauth-migration-27-nov-2025)

#### 3. Developer Account Requirements (HIGH)

- The Spotify developer account must have an **active Premium subscription**
- Development Mode is limited to **5 test users** (down from 25) and **1 client ID**

**Source**: [Feb 2026 Developer Access Update](https://developer.spotify.com/blog/2026-02-06-update-on-developer-access-and-platform-security)

#### 4. February 2026 Response Field Removals (MEDIUM)

These fields were removed from API responses — audit any code that reads them:
- `popularity` — removed from tracks, albums, artists
- `available_markets` — removed from all objects
- `followers` — removed from artists
- `country`, `email`, `explicit_content`, `product` — removed from user objects

The app's User schema stores `displayName` and `photos` from the user profile — verify these fields still exist in the response.

#### 5. Replace `spotify-web-api-node` (HIGH)

**Last release**: v5.0.2, January 2021 — abandoned. The project uses v4.0.0.

**Official replacement**: [`@spotify/web-api-ts-sdk`](https://github.com/spotify/spotify-web-api-ts-sdk) — released July 2023 by Spotify, actively maintained, fully typed.

#### 6. `passport-spotify` Status (MEDIUM)

Last release v2.0.0, January 2021. Still functional for the Authorization Code Flow but unmaintained. Consider migrating OAuth to the official SDK's built-in auth helpers or writing a custom Passport strategy.

---

### Node.js Version

**Current**: 11.10.1 (EOL June 2019, ~7 years ago)
**Target**: Node 22 LTS

This is a prerequisite for everything else — most modern packages require Node 18+.

---

### Client-Side Dependency Overhaul

#### Create React App — Dead (CRITICAL)

`react-scripts@2.1.5` is archived and abandoned. Will not work with modern Node. Options:
1. **Vite** (recommended) — fastest migration path, excellent React support
2. **Next.js** — if you want SSR (probably overkill for this app)

#### React 16 → 19 (HIGH)

Three major versions behind. Key breaking changes along the way:
- React 17: no breaking API changes but new JSX transform
- React 18: `ReactDOM.render()` → `createRoot()`, automatic batching, concurrent features
- React 19: new hooks, server components (optional)

#### Enzyme → React Testing Library (HIGH)

Enzyme has no adapter for React 17+. It is a dead end. Migrate to `@testing-library/react`.

#### Material UI v3 → MUI v6 (HIGH)

The package was renamed from `@material-ui/core` to `@mui/material` in v5. Major changes:
- `withStyles` HOC → `sx` prop / `styled` utility
- `MuiThemeProvider` → `ThemeProvider`
- `createMuiTheme` → `createTheme`
- JSS styling engine → Emotion

Every component in the client uses `withStyles` and imports from `@material-ui/core`.

#### Redux Modernization (MEDIUM)

- `createStore` → Redux Toolkit's `configureStore`
- `connect()` HOC → `useSelector` / `useDispatch` hooks
- `connected-react-router` (archived) → `redux-first-history` or just React Router without Redux binding
- `redux-thunk` is now built into Redux Toolkit

#### Other Dead/Unmaintained Client Packages

| Package | Status | Replacement |
|---|---|---|
| `connected-react-router` | Archived | `redux-first-history` or none |
| `redux-responsive` | Unmaintained (2018) | CSS media queries or `useMediaQuery` hook |
| `react-masonry-component` | Unmaintained | CSS Grid or `react-masonry-css` |
| `react-progressive-image` | Archived | Native `loading="lazy"` or `react-lazy-load-image-component` |
| `why-did-you-update` | Renamed | `@welldone-software/why-did-you-render` |
| `enzyme` + adapter | Dead for React 17+ | `@testing-library/react` |
| `react-window-size` | Unmaintained | `useWindowSize` hook |
| `react-full-screen` | Outdated | `react-full-screen@2+` or Fullscreen API directly |

---

### Server-Side Dependency Updates

| Package | Current | Issue | Fix |
|---|---|---|---|
| `dotenv` | ^6.2.0 | `dotenv.load()` removed in v7+ | Change to `dotenv.config()` |
| `connect-mongo` | ^2.0.3 | Factory pattern removed in v4+ | Use `MongoStore.create({...})` (or remove if migrating DB) |
| `passport` | ^0.4.0 | `req.logout()` requires callback in v0.6+ | Add callback to logout |
| `body-parser` | ^1.18.3 | Still works but redundant | Use `express.json()` / `express.urlencoded()` |
| `puppeteer` | ^1.13.0 | v1 from 2018, won't run on modern OS | Update to v22+ |
| `jest` (client) | ^23.6.0 | 6 major versions behind | Update to v29 |
| `axios` (client) | ^0.18.0 | v1 had breaking changes | Update to v1 |
| `http-proxy-middleware` | ^0.19.1 | v3 has different API | Update and adjust proxy config |

---

### Lerna

**Current**: ^3.13.1 — `lerna bootstrap` was removed in v7.

Options:
1. Update Lerna to v8 and use `npm workspaces` instead of `lerna bootstrap`
2. Replace Lerna entirely with npm workspaces (simpler for a 2-package monorepo)
3. Use Turborepo if you want build caching

For a 2-package personal project, **npm workspaces** is probably sufficient without Lerna at all.

---

## Suggested Migration Order

Given the dependencies between these changes, here's the recommended sequence:

1. **Node.js** — Upgrade to Node 22 LTS (prerequisite for everything)
2. **Monorepo tooling** — Replace Lerna with npm workspaces
3. **Database** — Migrate MongoDB → SQLite/Drizzle (small, isolated change)
4. **Server dependencies** — Update Express patterns, dotenv, passport, etc.
5. **Spotify API** — Replace `spotify-web-api-node` with official SDK, verify endpoint access, fix OAuth redirect
6. **CI/CD** — Set up GitHub Actions (can test the above changes)
7. **Client build** — Replace CRA with Vite
8. **React + dependencies** — Upgrade React, replace Enzyme, update MUI, modernize Redux
9. **Hosting** — Deploy to Railway

Steps 1-6 get the server functional. Steps 7-8 are the biggest lift (client modernization). Step 9 is the final deployment.

---

## Open Questions

1. **Does the existing Spotify developer app still have Extended Quota Mode access?** If not, the Related Artists endpoint is inaccessible and the core feature needs redesigning.
2. **Is a full client rewrite worth it?** Given the volume of dead dependencies (CRA, Enzyme, MUI v3, class components), it may be faster to scaffold a new Vite + React 19 app and port the business logic than to incrementally upgrade.
3. **Should the monorepo structure be kept?** For a personal project with one client and one server, a flat structure or a single Next.js app might be simpler.

## Code References

- `.travis.yml` — CI config to be replaced
- `package.json:17` — `heroku-postbuild` script to remove
- `packages/server/src/database/mongoDB.js` — MongoDB connection to replace
- `packages/server/src/database/schema/User.js` — Mongoose schema to convert
- `packages/server/src/initApp.js:5` — `dotenv.load()` to fix
- `packages/server/src/initApp.js:12,48-53` — `connect-mongo` session store to replace
- `packages/server/src/routes/auth.js:28` — `req.logout()` needs callback
- `packages/server/src/spotify/auth/passportStrategy.js:34-38` — Spotify OAuth config
- `packages/server/src/spotify/api/helpers/getCurrentlyPlayingRelatedAlbums.js` — Uses deprecated Related Artists endpoint
- `packages/client/src/index.js:29,36` — `MuiThemeProvider` and `ReactDOM.render()` to update
- `packages/client/src/store/configureStore.js:25` — Deprecated `createStore`
- `packages/client/src/theme/createTheme.js:5,13` — Old MUI theme API
