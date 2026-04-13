---
date: 2026-04-13T08:20:03Z
researcher: ctinney
git_commit: e71f75d4e5ba77ec11bdf8b7288e039ae8cc9a04
branch: master
repository: cdtinney/spune
topic: "Project Revival: Migration Guide"
tags: [research, migration, github-actions, digitalocean, postgresql, spotify-api]
status: complete
last_updated: 2026-04-13
last_updated_by: ctinney
---

# Project Revival Migration Guide

## Context

Spune is a monorepo (React SPA + Express API) that authenticates with Spotify, polls the currently playing track, fetches related artists/albums, and renders album artwork in a grid. Last updated ~2019. Three infrastructure pillars are dead and most dependencies are end-of-life.

---

## Infrastructure Migrations

### 1. CI/CD: Travis CI → GitHub Actions

Travis CI shut down in 2021. GitHub Actions is free for public repos and has an official Travis migration guide — the YAML maps nearly 1:1. No other option worth considering since the repo is already on GitHub.

### 2. Hosting: Heroku → Docker on DigitalOcean

Heroku killed its free tier in 2022. Dockerize the app (`Dockerfile` + `docker-compose.yml`) and host on a DigitalOcean droplet (~$4-6/mo). Docker makes the app portable to any provider if DigitalOcean ever becomes unsuitable. The server already reads `PORT` from env and serves the client build in production, so minimal changes needed.

### 3. Database: MongoDB → PostgreSQL

The current MongoDB usage is trivially simple — one collection, 7 flat fields, 3 query types, plus session storage. PostgreSQL is the industry-standard relational database, runs anywhere, and pairs naturally with Docker and DigitalOcean's managed database offering. Use a lightweight ORM like Drizzle or Knex. Replace `connect-mongo` with `connect-pg-simple` for sessions. ~100 lines of database code to rewrite.

### 4. Auth: Simplify OAuth

The current auth stack is 5 packages (`passport`, `passport-spotify`, `passport-oauth2-refresh`, `express-session`, `connect-mongo`) — and `passport-spotify` is unmaintained (last release 2021). Two options:

- **Keep Passport**: It still works for the Authorization Code Flow. Just swap the session store to `connect-pg-simple`. Least effort.
- **Drop Passport entirely**: Spotify's OAuth flow is only 2-3 HTTP calls (redirect, exchange code, refresh token). Implement it directly, store tokens in PostgreSQL, and use a signed cookie or JWT for the session. Eliminates 4 dependencies and the need for a session store altogether. More work upfront but simpler long-term.

---

## Spotify API: Breaking Changes (Biggest Risk)

The Spotify Web API has had major breaking changes since 2019.

**Related Artists endpoint — deprecated but grandfathered**: The `GET /artists/{id}/related-artists` endpoint — the app's core feature — was restricted in November 2024 for new apps. The existing Spotify app predates this change and should retain access. Monitor for future removal — Spotify has not announced a sunset date, but the endpoint is officially deprecated.

**Other breaking changes**:
- `localhost` banned as OAuth redirect URI (Nov 2025) — must use `127.0.0.1`
- Spotify Premium required for developer access; dev mode limited to 5 test users
- Several response fields removed (Feb 2026): `popularity`, `available_markets`, `followers`, user profile fields
- `spotify-web-api-node` is abandoned — official replacement is `@spotify/web-api-ts-sdk`

**Spotify app dashboard**: [spune app](https://developer.spotify.com/dashboard/c5538c30ef864e4fa9e22108528af89f)

**Source**: [Spotify Nov 2024 API changes](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api) | [Feb 2026 changelog](https://developer.spotify.com/documentation/web-api/references/changes/february-2026)

---

## Other Broken Things

**Node.js**: Pinned to 11 (EOL 2019). Upgrade to 22 LTS first — prerequisite for everything else.

**Monorepo tooling**: Lerna 3's `bootstrap` was removed. Replace with npm workspaces.

**Client stack**: Everything is end-of-life — Create React App (archived), React 16, Material UI v3 (renamed/restructured), Enzyme (dead past React 16), legacy Redux patterns, and several unmaintained packages. Likely faster to scaffold a new Vite + React 19 app and port the business logic than to incrementally upgrade.

**Server packages**: Minor fixes — `dotenv.load()` → `dotenv.config()`, `req.logout()` needs a callback, Puppeteer v1 won't run on modern OS, axios and http-proxy-middleware have major version bumps.

---

## Suggested Order

1. **Node.js 22** — prerequisite
2. **npm workspaces** — replace Lerna
3. **PostgreSQL** — swap database (small, isolated)
4. **Server deps + auth** — fix broken packages, simplify OAuth
5. **Spotify API** — replace SDK, verify endpoint access, fix redirect URI
6. **GitHub Actions** — set up CI
7. **Client rebuild** — Vite + React 19 (biggest lift)
8. **Dockerize + deploy** — Dockerfile, docker-compose, push to DigitalOcean

---

## Open Questions

1. **Client rewrite vs. incremental upgrade?** Given the volume of dead dependencies, a fresh scaffold is probably faster.
2. **Keep the monorepo?** For a personal project, a flat structure may be simpler than two packages.
