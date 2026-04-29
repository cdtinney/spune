# Production Deployment

CI builds a Docker image on every merge to `main` and pushes it to `ghcr.io`. Watchtower on the droplet pulls the new image within ~60s and restarts the app. CI's `deploy-check` job then polls `GET /api/status` until the running version matches the new commit SHA.

To verify a deploy manually:

```bash
./scripts/check-deploy.sh https://spune.tinney.dev/api/status <commit-sha>
```

## First-time droplet setup

On a fresh Ubuntu 24.04 DigitalOcean droplet (1GB RAM is enough):

```bash
# 1. Install Docker, scaffold /opt/spune, generate secrets
curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/setup-droplet.sh | bash

# 2. Log in to GHCR (token: github.com/settings/tokens, classic, read:packages)
echo "$GHCR_TOKEN" | docker login ghcr.io -u <github-username> --password-stdin

# 3. Fill in Spotify + Last.fm credentials
nano /opt/spune/.env

# 4. Start the stack and run migrations
cd /opt/spune && docker compose up -d
sleep 10
curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/migrate.sh | bash

# 5. Add HTTPS (point your domain's A record at the droplet IP first; Cloudflare proxy must be DNS-only)
curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/setup-caddy.sh -o /tmp/setup-caddy.sh
bash /tmp/setup-caddy.sh your-domain.com
```

Add `https://your-domain.com/api/auth/spotify/callback` to the Spotify app's redirect URIs.

## Adding a required env var

The server validates required secrets at boot and refuses to start in production if any are missing. When a PR adds a new required env var, append it to `/opt/spune/.env` **and** `/opt/spune-staging/.env` before merging, otherwise Watchtower will pick up the new image and crash-loop.

Example (token encryption rollout):

```bash
echo "TOKEN_ENCRYPTION_KEY=$(openssl rand -hex 32)" >> /opt/spune/.env
docker compose restart app
```

## Staging

Shared staging at https://staging.spune.tinney.dev runs on the same droplet with its own DB volume, secrets, and image tag (`ghcr.io/cdtinney/spune:staging`).

Deploy a branch:

```bash
pnpm deploy:staging              # current branch
pnpm deploy:staging my-branch    # named branch
```

This force-pushes to `origin/staging` (with confirmation), CI builds `:staging`, Watchtower picks it up. Only one slot — coordinate via Slack/PR comments.

**One-time setup** (already done; for reference):

1. DNS A record `staging.spune` → droplet IP, Cloudflare DNS-only.
2. Spotify dashboard: add `https://staging.spune.tinney.dev/api/auth/spotify/callback`.
3. On the droplet:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/setup-staging.sh | bash
   pnpm deploy:staging                       # build the :staging image (run from your laptop)
   cd /opt/spune-staging && docker compose up -d
   curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/migrate-staging.sh | bash
   ```

### Restricting who can log in

Set `ALLOWED_SPOTIFY_IDS` in `.env` to a comma-separated list of Spotify user IDs. When set, the OAuth callback rejects users not on the list and no user row is created. Unset/empty keeps login open to anyone with a Spotify account. Each stack reads its own `.env`, so locking down staging doesn't affect prod.

```bash
echo "ALLOWED_SPOTIFY_IDS=cdtinney" >> /opt/spune-staging/.env
cd /opt/spune-staging && docker compose restart staging-app
```

## Debugging

```bash
cd /opt/spune
docker compose logs --tail 100 app
docker compose logs -f app
docker compose ps
docker compose restart app
```

For staging, swap `/opt/spune` for `/opt/spune-staging` and the service name `app` for `staging-app`.

## Common issues

- **"Internal Server Error" after login** — `SPOT_REDIRECT_URI` in `.env` doesn't match the Spotify dashboard.
- **"DB_PASSWORD variable is not set"** — missing in `/opt/spune/.env`.
- **DB connection errors after changing password** — reset the volume: `docker compose down -v && docker compose up -d`, then re-run migrations.
- **Login redirects to home** — `SPOT_REDIRECT_URI` and `CLIENT_HOST` must share an origin.
- **Browser security warning on bare IP** — finish step 5 (HTTPS).
