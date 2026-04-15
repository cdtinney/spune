# Task 10: Rate Limiting and Security Hardening

## Goal

Add rate limiting and security headers to the Express server.

## What to do

### Rate limiting
- Add `express-rate-limit` middleware to protect API endpoints.
- Suggested limits:
  - `/api/auth/*`: 10 requests/minute per IP (auth is infrequent).
  - `/api/spotify/me/player`: 30 requests/minute per IP (polling at 3s = 20/min).
  - `/api/spotify/currently-playing/*`: 10 requests/minute per IP.
- Return 429 with a helpful message when rate limited.

### Security headers
- Add `helmet` middleware for standard security headers (CSP, HSTS, X-Frame-Options, etc.).
- Configure CSP to allow Spotify image CDN, Google Fonts, and the app's own assets.

### HTTPS enforcement
- In production, redirect HTTP to HTTPS (Caddy handles this, but add a middleware fallback).
- Set `cookie.secure = true` only when behind HTTPS (already done).

## Done when

- Rate limiting is active on all API endpoints.
- `helmet` is configured and all security headers are set.
- No functional regressions.
