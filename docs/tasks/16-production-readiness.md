# Task 16: Production Readiness

## Goal

Prepare Spune for reliable, secure production usage — covering security hardening, infrastructure scaling, observability, and operational hygiene.

## Context

Spune currently runs as a side project with minimal production hardening. Before opening it to a wider audience or relying on it for daily use, the app needs a security audit, proper infrastructure, and operational tooling so issues can be detected and resolved quickly.

## What to do

### Security audit

- **Auth & session management**: Review Passport.js session configuration — ensure cookies are `Secure`, `HttpOnly`, `SameSite=Strict` in production. Verify session secrets are strong and rotated.
- **Spotify tokens**: Confirm access tokens and refresh tokens are never exposed to the client beyond what's necessary. Ensure refresh token rotation is handled correctly.
- **CORS policy**: Lock down CORS to the production domain only. Remove any permissive `*` origins.
- **Rate limiting**: Add rate limiting to all API endpoints (especially auth routes) to prevent abuse. Evaluate the existing dev rate-limit workarounds and ensure they don't leak into production.
- **Input validation**: Audit all user-facing inputs and query parameters for injection risks. Validate and sanitize Spotify IDs and other external data before use.
- **Dependency audit**: Run `pnpm audit` and resolve any high/critical vulnerabilities. Set up automated dependency scanning (e.g. Dependabot or Renovate).
- **Secrets management**: Ensure no secrets are hardcoded. Migrate any `.env`-based secrets to a proper secrets manager or environment variable injection from the hosting platform.

### Infrastructure & scaling

- **Database**: Review PostgreSQL connection pooling settings. Add connection limits and timeouts. Plan for read replicas if needed.
- **Hosting**: Document the production hosting setup (Supabase for DB, hosting platform for the server). Evaluate whether the current setup can handle increased traffic.
- **CDN & caching**: Serve the client SPA through a CDN. Add appropriate cache headers for static assets and API responses (e.g. album art, related artists data).
- **Environment configuration**: Create a clear separation between development, staging, and production environment configs. Document required environment variables per environment.

### Observability & monitoring

- **Health check endpoint**: Add a `/health` endpoint that verifies the server is running and can reach the database.
- **Structured logging**: Replace any `console.log` with a structured logger (e.g. pino) that outputs JSON in production. Include request IDs for tracing.
- **Error tracking**: Integrate an error tracking service (e.g. Sentry) for both client and server to capture unhandled exceptions.
- **Uptime monitoring**: Set up external uptime monitoring that alerts on downtime or degraded performance.

### Operational hygiene

- **Database migrations**: Ensure all schema changes go through versioned migrations. Verify migrations can be rolled back.
- **Backup & recovery**: Confirm database backups are running (Supabase provides this, but verify retention and test restoration).
- **Graceful shutdown**: Ensure the server handles `SIGTERM` gracefully — finishes in-flight requests, closes DB connections, then exits.
- **CI/CD hardening**: Add production deployment checks — require passing CI, prevent force-pushes to the deploy branch, and add deployment notifications.

### Spotify API compliance

- **Terms of Service review**: Read the current [Spotify Developer Terms](https://developer.spotify.com/terms) and verify the app complies — particularly around data storage, displaying content (e.g. album art attribution), and prohibited use cases.
- **Rate limit handling**: Spotify returns `429 Too Many Requests` with a `Retry-After` header. Ensure the server respects this header and backs off accordingly rather than retrying immediately. Add exponential backoff for transient failures.
- **Quota monitoring**: Track how many Spotify API calls the app makes per user session and in aggregate. Log when usage approaches known thresholds so problems are caught before Spotify revokes access.
- **Caching Spotify responses**: Cache album metadata, related artists, and other infrequently-changing data to reduce unnecessary API calls. Respect Spotify's caching guidelines (e.g. don't cache audio streams or user data longer than allowed).
- **Token lifecycle**: Ensure access tokens are refreshed proactively before expiry rather than waiting for `401` responses. Handle token revocation gracefully (e.g. user disconnects Spune from their Spotify account).
- **Extended quota mode**: If usage grows beyond the default rate limits, apply for Spotify's extended quota mode before hitting the ceiling.

### Client hardening

- **Error boundaries**: Ensure React error boundaries exist at key component tree levels so failures are contained and user-friendly.
- **CSP headers**: Add a Content Security Policy that restricts script sources, frame ancestors, and other vectors.
- **Source maps**: Disable or restrict source map access in production to avoid exposing application internals.

## Done when

- Security audit is complete and all high/critical findings are resolved.
- Rate limiting is in place on all API routes.
- A `/health` endpoint exists and is monitored.
- Structured logging is in place for the server.
- Error tracking is integrated for both client and server.
- CORS is locked to production origins only.
- Database connection pooling is configured for production load.
- Graceful shutdown is implemented.
- Spotify API usage complies with their Terms of Service, rate limits are respected with backoff, and responses are cached where appropriate.
- A production deployment checklist exists in the repo.
