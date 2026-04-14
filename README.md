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

CI automatically builds and pushes a Docker image to GitHub Container Registry (`ghcr.io`) on every merge to `master`. Your droplet pulls the latest image automatically via Watchtower.

#### One-time droplet setup

1. **Create a droplet** (Ubuntu 24.04, any size with 1GB+ RAM).

2. **Install Docker**:

```bash
curl -fsSL https://get.docker.com | sh
```

3. **Log in to GitHub Container Registry** (use a [personal access token](https://github.com/settings/tokens) with `read:packages` scope):

```bash
echo "YOUR_GITHUB_PAT" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

4. **Create a project directory and env file**:

```bash
mkdir -p /opt/spune && cd /opt/spune
cat > .env <<'EOF'
DATABASE_URL=postgresql://user:pass@host:5432/spune
SESSION_SECRET=generate-a-long-random-string
SPOT_CLIENT_ID=your-client-id
SPOT_CLIENT_SECRET=your-client-secret
SPOT_REDIRECT_URI=https://your-domain.com/api/auth/spotify/callback
CLIENT_HOST=https://your-domain.com
LAST_FM_API_KEY=your-lastfm-key
EOF
```

5. **Create `docker-compose.yml`**:

```yaml
services:
  app:
    image: ghcr.io/cdtinney/spune:latest
    restart: always
    ports:
      - "5000:5000"
    env_file: .env
    environment:
      NODE_ENV: production

  watchtower:
    image: containrrr/watchtower
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /root/.docker/config.json:/config.json:ro
    command: --interval 60 --cleanup
```

6. **Run the database migration** against your PostgreSQL instance:

```bash
psql "$DATABASE_URL" -f packages/server/src/database/migrations/001_create_users.sql
```

Or if using a managed database, run the SQL from `packages/server/src/database/migrations/001_create_users.sql` in your DB console.

7. **Start everything**:

```bash
docker compose up -d
```

#### How auto-deploy works

- You merge a PR to `master`
- CI runs tests, then builds and pushes `ghcr.io/cdtinney/spune:latest`
- Watchtower (running on your droplet) polls every 60 seconds
- When it detects a new image, it pulls it and restarts the app container
- Zero manual intervention needed

#### Putting it behind a reverse proxy

For HTTPS, put nginx or Caddy in front of the app. Example with Caddy (add to `docker-compose.yml`):

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

With a `Caddyfile`:

```
your-domain.com {
    reverse_proxy app:5000
}
```

### Database Migration

The migration runs automatically when using `docker compose up` locally (via the init script). For production, run the SQL against your database before first deploy:

```bash
psql "$DATABASE_URL" -f packages/server/src/database/migrations/001_create_users.sql
```

## Inspiration

1. Desktop Zune software is awesome to look at on your TV
2. Desktop Spotify software sucks to look at on your TV
3. Therefore, a client that shows what you're listening to in the style of Zune must be awesome
