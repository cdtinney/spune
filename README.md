# Spune

> Web-based Spotify "Now Playing" visualizer, inspired by the Zune desktop software.

![Zune Player 1](./assets/player.png)
![Zune Player 2](./assets/player2.png)

## Overview

Spune displays album artwork from related artists in a Zune-style mosaic while you listen to Spotify. It polls your currently playing track, discovers related artists via Last.fm and ListenBrainz, and renders their album covers as an animated background.

### Stack

- **Client**: React 19, Vite, React Router v7, plain CSS
- **Server**: Node.js 22, Express, Passport.js (Spotify OAuth), PostgreSQL
- **APIs**: Spotify Web API, Last.fm, ListenBrainz/MusicBrainz
- **CI/CD**: GitHub Actions, Docker

## Getting Started

### Prerequisites

- [Node.js 22+](https://nodejs.org/)
- [PostgreSQL 16+](https://www.postgresql.org/)
- [Spotify Developer Application](https://developer.spotify.com/dashboard)
- (Optional) [Last.fm API key](https://www.last.fm/api/account/create) for better related artist discovery

### Setup

```bash
git clone git@github.com:cdtinney/spune.git
cd spune
npm install
```

Create `packages/server/.env` from the example:

```bash
cp packages/server/.env.example packages/server/.env
```

Edit `.env` and fill in your credentials:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Express session secret (any random string) |
| `SPOT_CLIENT_ID` | Yes | Spotify app client ID |
| `SPOT_CLIENT_SECRET` | Yes | Spotify app client secret |
| `SPOT_REDIRECT_URI` | Yes | OAuth callback URL. Dev: `http://127.0.0.1:3000/api/auth/spotify/callback` |
| `CLIENT_HOST` | Yes | Client origin for redirects. Dev: `http://127.0.0.1:3000` |
| `PORT` | No | Server port (default: 5000) |
| `LAST_FM_API_KEY` | No | Last.fm API key for similar artist discovery |

Add `http://127.0.0.1:3000/api/auth/spotify/callback` to your Spotify app's redirect URIs in the dashboard.

### Running (Development)

```bash
npm run dev
```

This starts both the Express server (port 5000) and Vite dev server (port 3000) concurrently. Open `http://127.0.0.1:3000`.

### Testing

```bash
npm run client:test        # Client tests (Vitest)
npm run client:lint         # Client lint (ESLint)
npm run server:test:coverage # Server tests (Jest)
npm run server:lint         # Server lint (ESLint)
```

### Building

```bash
npm run client:build   # Builds to packages/client/build/
```

## Docker

### Local Development with Docker

```bash
docker compose up
```

This starts the app + PostgreSQL. The database migration runs automatically. Open `http://localhost:5000`.

You must set the Spotify env vars. Either export them or create a `.env` file in the project root:

```bash
SPOT_CLIENT_ID=your-client-id
SPOT_CLIENT_SECRET=your-client-secret
SPOT_REDIRECT_URI=http://localhost:5000/api/auth/spotify/callback
SESSION_SECRET=your-secret
```

### Production Deployment (DigitalOcean Droplet)

CI auto-builds and pushes a Docker image to `ghcr.io` on every merge to `master`. Your droplet auto-updates via Watchtower.

#### 1. Set up the droplet

Create an Ubuntu 24.04 droplet (1GB RAM is enough). Open the **Droplet Console** in the DigitalOcean dashboard and run the setup script:

```bash
curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/master/scripts/setup-droplet.sh | bash
```

The script installs Docker, creates `/opt/spune` with a `docker-compose.yml` and `.env`, and generates random secrets.

#### 2. Configure credentials

Log in to GitHub Container Registry so the droplet can pull the Docker image:

1. Go to https://github.com/settings/tokens and create a **classic** personal access token with the `read:packages` scope.
2. Run this on the droplet, replacing the placeholders:

```bash
echo "ghp_yourTokenHere" | docker login ghcr.io -u your-github-username --password-stdin
```

Edit `/opt/spune/.env` and fill in your Spotify + Last.fm credentials:

```bash
nano /opt/spune/.env
```

#### 3. Point your domain to the droplet

In your DNS provider, add an **A record** pointing your domain to the droplet's IP address:

| Type | Name | Value |
|------|------|-------|
| A | `@` (or subdomain) | `YOUR_DROPLET_IP` |

Then update `/opt/spune/.env` to use your domain:

```
SPOT_REDIRECT_URI=https://your-domain.com/api/auth/spotify/callback
CLIENT_HOST=https://your-domain.com
```

Also add `https://your-domain.com/api/auth/spotify/callback` to your Spotify app's redirect URIs in the dashboard.

#### 4. Start

```bash
cd /opt/spune
docker compose up -d
```

Wait ~10 seconds for PostgreSQL to initialize, then run the migration:

```bash
docker compose exec db psql -U spune -d spune -c \
  "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, spotify_id TEXT UNIQUE NOT NULL, spotify_access_token TEXT, spotify_refresh_token TEXT, token_updated BIGINT, expires_in BIGINT, display_name TEXT, photos JSON);"
```

The app is now running. If you're using a domain with the setup script's default config, it serves on port 80 (HTTP). For HTTPS, see below.

#### HTTPS with Caddy (optional)

The setup script serves on port 80 (HTTP). To add automatic HTTPS, edit `/opt/spune/docker-compose.yml` and add a Caddy service:

```yaml
  caddy:
    image: caddy:2-alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
volumes:
  caddy_data:
```

Change the `app` service ports from `"80:5000"` to `"5000:5000"` (internal only).

Create `/opt/spune/Caddyfile`:

```
your-domain.com {
    reverse_proxy app:5000
}
```

Restart: `docker compose down && docker compose up -d`. Caddy auto-provisions a Let's Encrypt TLS certificate.

#### How auto-deploy works

1. You merge a PR to `master`
2. CI runs tests, builds, and pushes `ghcr.io/cdtinney/spune:latest`
3. Watchtower (on your droplet) detects the new image within 60 seconds
4. It pulls the image and restarts the app container automatically

## Inspiration

1. Desktop Zune software is awesome to look at on your TV
2. Desktop Spotify software sucks to look at on your TV
3. Therefore, a client that shows what you're listening to in the style of Zune must be awesome
