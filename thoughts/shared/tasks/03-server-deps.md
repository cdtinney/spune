# Task 3: Update Broken Server Dependencies

## Prerequisites

Task 2 (PostgreSQL migration) is merged.

## Goal

Fix all broken or deprecated server-side packages so the Express server runs cleanly on Node 22.

## Context

These packages have breaking changes between the pinned version and current:

- `dotenv` (^6.2.0): `dotenv.load()` was removed in v7. Used at `initApp.js:5`. Change to `dotenv.config()`.
- `passport` (^0.4.0): `req.logout()` requires a callback in v0.6+. Used at `routes/auth.js`.
- `body-parser` (^1.18.3): Still works but redundant — Express 4.16+ has `express.json()` and `express.urlencoded()` built in.
- `puppeteer` (^1.13.0): v1 from 2018, won't download Chromium on modern OS. Update to current. Also update `jest-puppeteer`.
- `nodemon` (^1.18.10): Several major versions behind, update to current.
- `winston` and other server deps: check for anything that breaks on Node 22.

## What to do

- Update each package to its current version.
- Fix the breaking API changes listed above.
- Remove `body-parser` and use Express built-in equivalents.
- Run `npm install` and verify the server starts without errors.
- Run existing server unit tests and fix any that break due to the dependency changes. Do NOT rewrite tests — just fix what breaks.

## Done when

- All server dependencies are on current versions.
- `dotenv.config()` replaces `dotenv.load()`.
- `req.logout()` has a callback.
- `body-parser` is removed.
- Server starts and existing unit tests pass.
- A clean commit on a feature branch.
