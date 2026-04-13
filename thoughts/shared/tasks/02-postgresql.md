# Task 2: Migrate MongoDB to PostgreSQL

## Prerequisites

Task 1 (Node 22 + npm workspaces) is merged.

## Goal

Replace all MongoDB/Mongoose usage with PostgreSQL. The database layer is small — one model, three queries, and a session store.

## Context

- `packages/server/src/database/mongoDB.js` — connection setup, reads `MONGODB_URI` env var.
- `packages/server/src/database/schema/User.js` — single Mongoose model with fields: `spotifyId`, `spotifyAccessToken`, `spotifyRefreshToken`, `tokenUpdated`, `expiresIn`, `displayName`, `photos` (array of strings). Uses `mongoose-findorcreate` plugin.
- Three query locations:
  - `passportStrategy.js` — `User.findOrCreate({ spotifyId })`
  - `deserializeUser.js` — `User.findOne({ spotifyId })`
  - `refreshToken.js` — `User.findOneAndUpdate({ spotifyRefreshToken }, { $set: ... })`
- `initApp.js` — uses `connect-mongo` as the Express session store.
- Dependencies to remove: `mongoose`, `mongoose-findorcreate`, `connect-mongo`.

## What to do

- Choose a lightweight ORM (Drizzle recommended) or query builder (Knex) — not a heavy framework.
- Define a `users` table schema matching the existing fields. The `photos` field can be stored as JSON.
- Replace the three Mongoose queries with equivalent SQL/ORM calls.
- Replace `connect-mongo` with `connect-pg-simple` for session storage.
- Replace `mongoDB.js` with a PostgreSQL connection module that reads `DATABASE_URL` env var (defaulting to `postgresql://localhost:5432/spune` for local dev).
- Update any test setup that depends on MongoDB.
- Remove `mongoose`, `mongoose-findorcreate`, and `connect-mongo` from `package.json`.

## Done when

- All MongoDB code and dependencies are removed.
- The server connects to PostgreSQL and the three query operations work.
- Session storage uses `connect-pg-simple`.
- A clean commit on a feature branch.
