# Spune Server

Express + TypeScript API server with Spotify OAuth, PostgreSQL, and related artist discovery.

## Architecture

```
src/
  auth/         # Passport.js authentication (serialize, deserialize, strategy)
  cache/        # In-memory LRU caches for API responses
  config/       # App configuration (paths, env)
  database/     # PostgreSQL connection, queries, migrations
  logger/       # Winston logger setup (auto-injects requestId from AsyncLocalStorage)
  middleware/   # Rate limiting, request context (request IDs), HTTP access log
  routes/       # API routes (auth, spotify, SSE, status, health)
  spotify/      # Spotify API integration (SDK wrapper, helpers)
  sse/          # Server-Sent Events broadcaster
  types/        # TypeScript type definitions
```

## Key features

- **Spotify OAuth**: Login via Passport.js, session stored in PostgreSQL
- **Related artist discovery**: Last.fm + ListenBrainz for similar artists, with in-memory caching
- **SSE push**: Server polls Spotify and pushes playback state to connected clients
- **Token refresh**: Automatic Spotify token refresh via passport-oauth2-refresh
- **Token encryption at rest**: Spotify access/refresh tokens are AES-256-GCM encrypted before being written to the `users` table; key comes from `TOKEN_ENCRYPTION_KEY`
- **Request IDs + access logs**: every request gets an `X-Request-Id` (preserved from inbound when valid, otherwise generated) that is echoed back and attached to every log line via `AsyncLocalStorage`. One `http_request` log line is emitted per response.

## Operational endpoints

| Endpoint          | Purpose                                                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/status` | Returns `{ version, uptime, startedAt }`. Used by the deploy-check job to confirm the droplet is running the new image.                                     |
| `GET /api/health` | Returns `200 { status: 'ok' }` when `SELECT 1` succeeds within ~2s, or `503 { status: 'error' }` otherwise. Not rate-limited; suitable for uptime monitors. |

## Configuration

Copy `.env.example` to `.env` and fill in your credentials. The file documents each variable.

## Scripts

```bash
pnpm dev        # Start with tsx (hot reload via nodemon)
pnpm build      # Compile TypeScript to dist/
pnpm start      # Run compiled output
pnpm test       # Run tests (Vitest)
pnpm lint       # Lint (ESLint)
```

## Tests

Tests use Vitest. Run with `pnpm test`.

## Database

Migrations are in `src/database/migrations/`. Run them with `scripts/migrate.sh` or manually:

```bash
psql "$DATABASE_URL" -f src/database/migrations/001_create_users.sql
```
