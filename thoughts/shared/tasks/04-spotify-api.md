# Task 4: Spotify API Migration

## Prerequisites

Task 3 (server deps) is merged.

## Goal

Replace the abandoned Spotify SDK, fix OAuth configuration for current Spotify requirements, and adapt to API breaking changes.

## Context

- `spotify-web-api-node` (v4.0.0): Abandoned, last release Jan 2021. Official replacement is `@spotify/web-api-ts-sdk`.
- `passport-spotify`: Unmaintained (last release 2021) but still functional for Authorization Code Flow.
- The app uses these Spotify endpoints:
  - Get current playback state — still works
  - Get artist's related artists — **deprecated Nov 2024**, restricted to Extended Quota Mode apps
  - Get artist's albums — still works
- OAuth redirect URI: `localhost` was banned Nov 2025, must use `127.0.0.1` for local dev.
- Several response fields were removed in Feb 2026: `popularity`, `available_markets`, `followers`, user profile fields (`country`, `email`, `explicit_content`, `product`).

**Spotify app dashboard**: [spune app](https://developer.spotify.com/dashboard/c5538c30ef864e4fa9e22108528af89f)

## What to do

- Replace `spotify-web-api-node` with `@spotify/web-api-ts-sdk` across all server code that makes Spotify API calls. Key files:
  - `spotify/api/helpers/getCurrentlyPlayingRelatedAlbums.js`
  - `spotify/api/helpers/apiRequestWithRefresh.js`
  - `spotify/api/helpers/getRelatedArtists.js`
  - `spotify/auth/passportStrategy.js`
  - `spotify/auth/refreshToken.js`
- For auth, choose one of:
  - **Keep Passport**: Leave `passport-spotify` in place, just swap the Spotify API client for data calls. Least effort.
  - **Drop Passport**: Implement the Authorization Code Flow directly (redirect → exchange code → refresh). Eliminates `passport`, `passport-spotify`, `passport-oauth2-refresh`, and `express-session`. Use a signed cookie or JWT instead.
- Update the default redirect URI in config/env to use `127.0.0.1` instead of `localhost`.
- Audit code for any usage of removed response fields (`popularity`, `available_markets`, `followers`, etc.) and remove references.
- Handle the Related Artists deprecation:
  - If the endpoint still works with the existing app credentials, keep it but add a graceful fallback.
  - If it returns 403, redesign to show the current artist's own albums (or another available data source).
- Remove `spotify-web-api-node` from `package.json`.

## Done when

- `spotify-web-api-node` is removed, replaced with `@spotify/web-api-ts-sdk`.
- OAuth redirect uses `127.0.0.1` for local dev.
- No references to removed Spotify API response fields.
- Related Artists has a fallback path if the endpoint is inaccessible.
- Server starts and Spotify-related unit tests pass (update mocks as needed).
- All changes are on a feature branch off master, submitted as a PR. Do not merge directly to master.
