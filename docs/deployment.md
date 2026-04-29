# Production Deployment

CI auto-builds and pushes a Docker image to `ghcr.io` on every merge to `main`. The droplet auto-updates via Watchtower.

## Setup

### 1. Create the droplet

Create an Ubuntu 24.04 DigitalOcean droplet (1GB RAM is enough). Open the **Droplet Console** and run:

```bash
curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/setup-droplet.sh | bash
```

This installs Docker, creates `/opt/spune` with a `docker-compose.yml` and `.env`, and generates random secrets.

### 2. Configure credentials

Log in to GitHub Container Registry:

1. Create a [personal access token](https://github.com/settings/tokens) (classic, `read:packages` scope).
2. Run on the droplet:

```bash
echo "ghp_yourTokenHere" | docker login ghcr.io -u your-github-username --password-stdin
```

Edit `/opt/spune/.env` and fill in your Spotify + Last.fm credentials.

### 3. Point your domain

Add an **A record** in your DNS provider pointing to the droplet IP.

**Cloudflare**: set proxy status to **DNS only** (grey cloud). Caddy handles SSL.

### 4. Start and migrate

```bash
cd /opt/spune
docker compose up -d
# Wait ~10s for Postgres, then:
curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/migrate.sh -o /tmp/migrate.sh && bash /tmp/migrate.sh
```

### 5. Add HTTPS

```bash
curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/setup-caddy.sh -o /tmp/setup-caddy.sh && bash /tmp/setup-caddy.sh your-domain.com
```

Add `https://your-domain.com/api/auth/spotify/callback` to your Spotify app's redirect URIs.

## Auto-deploy

1. Merge a PR to `main`
2. CI builds and pushes `ghcr.io/cdtinney/spune:latest`
3. Watchtower detects the new image within 60 seconds
4. It pulls and restarts the app container

### Adding new required env vars

The server validates required secrets at boot in production and refuses to start if any are missing. When a PR adds a new required env var, add it to `/opt/spune/.env` on the droplet **before merging** so the next auto-deploy doesn't crash-loop.

For example, when token encryption was introduced, existing droplets needed:

```bash
echo "TOKEN_ENCRYPTION_KEY=$(openssl rand -hex 32)" >> /opt/spune/.env
docker compose restart app
```

Existing user rows with plaintext tokens won't decrypt and the affected users will be forced to re-auth once.

### Deploy verification

CI includes a `deploy-check` job that polls `GET /api/status` after the Docker image is pushed, waiting for the running version to match the new commit SHA.

You can also run the check manually:

```bash
./scripts/check-deploy.sh https://spune.tinney.dev/api/status <commit-sha>
```

### Status endpoint

`GET /api/status` returns:

```json
{
  "version": "abc1234...",
  "uptime": 12345.67,
  "startedAt": "2025-01-01T00:00:00.000Z"
}
```

- **version**: The commit SHA baked into the Docker image at build time
- **uptime**: Seconds since the Node.js process started
- **startedAt**: ISO timestamp of when the process started

Rate-limited to 30 requests per 15 minutes.

### Health endpoint

`GET /api/health` returns `200 { "status": "ok" }` when the server can reach PostgreSQL via `SELECT 1` within ~2s, or `503 { "status": "error" }` otherwise. Not rate-limited; safe for an external uptime monitor to poll. When the check fails, the underlying error is logged at `warn` level under `[health] DB check failed`.

### Request IDs and access logs

Every request gets an `X-Request-Id` header (preserved from inbound when valid, otherwise generated). The same value is echoed back to the client and included in every server log entry on that request, so a single ID can correlate a client report with the matching log lines.

The server emits one `http_request` log line per response with `{ method, url, status, durationMs, requestId }`. `/api/health` (noise) and SSE streams (would record stream lifetime, not request work) are skipped.

## Staging environment

A shared staging environment runs at https://staging.spune.tinney.dev on the same droplet as production. It has its own Postgres volume, its own session/encryption secrets, and its own image tag (`ghcr.io/cdtinney/spune:staging`).

### Deploying a branch to staging

```bash
pnpm deploy:staging              # deploys the current branch
pnpm deploy:staging my-branch    # deploys a named branch
```

This wraps `git push origin <branch>:staging --force` with a confirmation prompt. The push triggers CI to build and push `ghcr.io/cdtinney/spune:staging`. Watchtower (running in the prod stack) picks up the new image within ~60 seconds and restarts the staging app container.

There is exactly one staging slot — whoever force-pushes most recently owns it. Coordinate via Slack/PR comments if multiple branches are in flight.

### One-time setup (kept for reference)

1. **DNS**: Cloudflare A record `staging.spune` pointing at the droplet IP, **DNS only** (grey cloud).
2. **Spotify**: redirect URI `https://staging.spune.tinney.dev/api/auth/spotify/callback` added in the Spotify dashboard.
3. **Droplet**:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/setup-staging.sh | bash
   ```
4. **Caddy**: append the staging block to `/opt/spune/Caddyfile` and reload (the setup script prints the exact commands).
5. **First start**: `cd /opt/spune-staging && docker compose up -d`, then run the user-table migration printed by the setup script.

### Adding new env vars

If you add a required env var, you must update **both** `/opt/spune/.env` and `/opt/spune-staging/.env` before merging to `main` / pushing to `staging`, otherwise the container will crash-loop after Watchtower picks up the new image.

### Staging logs

```bash
cd /opt/spune-staging
docker compose logs -f staging-app
```

## Debugging

```bash
cd /opt/spune
docker compose logs --tail 100 app   # View app logs
docker compose logs -f app           # Follow logs
docker compose ps                     # Container status
docker compose restart app            # Restart app
```

## Common issues

- **"Internal Server Error" after login**: `SPOT_REDIRECT_URI` in `.env` doesn't match the Spotify dashboard.
- **"DB_PASSWORD variable is not set"**: Check `/opt/spune/.env` has `DB_PASSWORD`.
- **DB connection errors after changing password**: Reset the volume: `docker compose down -v && docker compose up -d`, then re-run migrations.
- **Browser security warning on bare IP**: Use a domain with HTTPS (step 5).
- **Login redirects to home**: `SPOT_REDIRECT_URI` and `CLIENT_HOST` must use the same origin.
