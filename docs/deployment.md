# Production Deployment

CI auto-builds and pushes a Docker image to `ghcr.io` on every merge to `master`. The droplet auto-updates via Watchtower.

## Setup

### 1. Create the droplet

Create an Ubuntu 24.04 DigitalOcean droplet (1GB RAM is enough). Open the **Droplet Console** and run:

```bash
curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/master/scripts/setup-droplet.sh | bash
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
curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/master/scripts/migrate.sh -o /tmp/migrate.sh && bash /tmp/migrate.sh
```

### 5. Add HTTPS

```bash
curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/master/scripts/setup-caddy.sh -o /tmp/setup-caddy.sh && bash /tmp/setup-caddy.sh your-domain.com
```

Add `https://your-domain.com/api/auth/spotify/callback` to your Spotify app's redirect URIs.

## Auto-deploy

1. Merge a PR to `master`
2. CI builds and pushes `ghcr.io/cdtinney/spune:latest`
3. Watchtower detects the new image within 60 seconds
4. It pulls and restarts the app container

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
