---
date: 2026-04-13T08:20:03Z
researcher: ctinney
git_commit: e71f75d4e5ba77ec11bdf8b7288e039ae8cc9a04
branch: master
repository: cdtinney/spune
topic: "Project Revival: Migration Guide"
tags: [research, migration, travis-ci, heroku, mongodb, spotify-api, github-actions, docker, sqlite]
status: complete
last_updated: 2026-04-13
last_updated_by: ctinney
---

# Project Revival Migration Guide

## Context

Spune is a Lerna monorepo: a React 16 SPA (`packages/client`) and an Express API (`packages/server`). It authenticates with Spotify, polls the currently playing track, fetches related artists/albums, and renders album artwork in a grid.

The project hasn't been touched since ~2019. Three core pieces of infrastructure are dead, and nearly every dependency is severely outdated.

---

## 1. CI/CD: Travis CI → GitHub Actions

**Why**: Travis CI shut down in 2021. The `.travis.yml` is non-functional.

**Why GitHub Actions**: The repo is already on GitHub. Actions is free and unlimited for public repos, has an official Travis migration guide, and the YAML maps nearly 1:1. No compelling reason to consider anything else.

**Scope of change**: Delete `.travis.yml`, create `.github/workflows/ci.yml`. The existing CI steps (install, bootstrap, build, lint, test, coverage) translate directly. MongoDB service containers replace Travis's `services: - mongodb`. Coveralls integration works via a repo secret.

**Reference**: [Travis CI → GitHub Actions migration guide](https://docs.github.com/en/actions/migrating-to-github-actions/manually-migrating-to-github-actions/migrating-from-travis-ci-to-github-actions)

---

## 2. Hosting: Heroku → Docker (portable to any host)

**Why**: Heroku killed its free tier in November 2022.

**Why Docker instead of a specific PaaS**: The project was previously locked to Heroku. Replacing one proprietary PaaS with another (Railway, Render, Fly.io) repeats the same mistake. A `Dockerfile` + `docker-compose.yml` makes the app portable to any provider — DigitalOcean, Hetzner, AWS, a Raspberry Pi, or any PaaS that supports Docker (which is all of them).

**Scope of change**:
- Add a `Dockerfile` that builds the client, installs server deps, and runs the Express server
- Add a `docker-compose.yml` for local dev (app + database)
- Remove the `heroku-postbuild` script from root `package.json`
- Remove the Travis deploy block (already gone with Travis removal)
- The server already reads `PORT` from env and serves the client build in production — this pattern works unchanged in Docker

**Deployment**: Pick any host that runs Docker containers. For a personal project, a $4-6/mo VPS (Hetzner, DigitalOcean) is more than sufficient and avoids vendor lock-in entirely.

---

## 3. Database: MongoDB → SQLite

**Why**: The MongoDB usage is trivially simple — one `User` collection with 7 flat fields, three query types (`findOrCreate`, `findOne`, `findOneAndUpdate`), plus session storage via `connect-mongo`. Running a MongoDB server for this is unnecessary overhead.

**Why SQLite**: It's a file. No server, no account, no cloud dependency, no cost. The data model is a single flat table. SQLite is the right tool for this level of complexity. If the app ever needs a hosted database (e.g., platform without persistent disk), PostgreSQL is the portable standard — but for a personal project on a VPS with Docker, SQLite is the simplest path.

**Scope of change**:
- Replace `mongoose` + `mongoose-findorcreate` with an ORM like Drizzle or Knex (or even raw `better-sqlite3`)
- Replace `connect-mongo` session store with a SQLite-backed session store
- Remove `MONGODB_URI` env var; the database is just a file on disk
- ~100 lines of database code to rewrite (it's very small)

---

## 4. Spotify API: Breaking Changes Since 2019

This is the biggest risk to the project's viability. The Spotify Web API has undergone major breaking changes.

### Related Artists Endpoint — Deprecated (CRITICAL)

The `GET /artists/{id}/related-artists` endpoint — **the core feature of this app** — was restricted in November 2024. New apps and apps in Development Mode cannot access it. Extended Quota Mode (which grants access) is now only available to organizations with 250K+ monthly active users. This endpoint may be permanently inaccessible for a personal project.

**Decision needed**: Check whether the existing Spotify developer app still has access. If not, the app's primary feature needs to be redesigned around available endpoints (e.g., showing the current artist's own albums instead of related artists' albums).

**Source**: [Spotify Nov 2024 API changes](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api)

### OAuth: localhost Banned

As of November 2025, `http://localhost` is no longer allowed as a redirect URI. Must use `http://127.0.0.1` instead, both in the Spotify Developer Dashboard and the app config.

### Developer Account Requirements

A Spotify Premium subscription is now required for developer access. Development Mode is limited to 5 test users and 1 client ID.

### February 2026 Field Removals

Spotify removed `popularity`, `available_markets`, `followers`, and several user profile fields from API responses. Audit any code that reads these.

### Abandoned Libraries

- **`spotify-web-api-node`** (v4.0.0 in this project): Last release January 2021, abandoned. Official replacement is `@spotify/web-api-ts-sdk`.
- **`passport-spotify`** (used for OAuth): Last release January 2021, unmaintained. Still functional for the Authorization Code Flow but won't receive updates.

---

## 5. Everything Else That's Broken

### Node.js

Pinned to 11.10.1 (EOL June 2019). Must upgrade to Node 22 LTS. This is a prerequisite for everything — modern packages require Node 18+.

### Monorepo Tooling

Lerna 3's `bootstrap` command was removed in v7. For a 2-package project, replace with npm workspaces (built into npm, no extra dependency).

### Client Stack (biggest effort)

The entire client stack is end-of-life:

- **Create React App**: Archived, won't run on modern Node. Replace with Vite.
- **React 16**: Three major versions behind (current is 19). Class components, `ReactDOM.render()`, and legacy lifecycle methods throughout.
- **Material UI v3** (`@material-ui/core`): Renamed to `@mui/material` in v5 with a completely different styling system. Every component uses the old `withStyles` HOC.
- **Enzyme**: Dead — no adapter exists for React 17+. Replace with React Testing Library.
- **Redux**: Uses deprecated `createStore` and `connect()` HOC. Modern approach is Redux Toolkit with hooks.
- **Several unmaintained packages**: `connected-react-router` (archived), `redux-responsive` (2018), `react-masonry-component`, `react-progressive-image` (archived).

Given the scope, it may be faster to scaffold a new Vite + React 19 project and port the business logic than to incrementally upgrade.

### Server Packages

- `dotenv`: `dotenv.load()` was removed — change to `dotenv.config()`
- `passport`: `req.logout()` now requires a callback (v0.6+)
- `puppeteer`: v1 from 2018, won't run on modern OS — update to v22+
- `axios`: v0.18 → v1 had breaking changes
- `http-proxy-middleware`: v0.19 → v3 has a different API

---

## Suggested Order

1. **Node.js 22** — prerequisite for everything
2. **npm workspaces** — replace Lerna
3. **Database** — MongoDB → SQLite (small, isolated)
4. **Server deps** — dotenv, passport, etc.
5. **Spotify API** — replace SDK, verify endpoint access, fix OAuth
6. **CI/CD** — GitHub Actions
7. **Client rebuild** — Vite + React 19 + modern deps
8. **Dockerize** — Dockerfile + docker-compose
9. **Deploy** — pick a host

Steps 1-6 get the server running. Step 7 is the biggest lift. Steps 8-9 are deployment.

---

## Open Questions

1. **Does the existing Spotify app still have Related Artists access?** This determines whether the core feature works or needs redesigning.
2. **Incremental client upgrade vs. rewrite?** The volume of dead deps (CRA, Enzyme, MUI v3, class components) may make a fresh scaffold faster.
3. **Keep the monorepo?** A single Vite app with an Express backend (or even a Next.js app) might be simpler than maintaining two packages.
