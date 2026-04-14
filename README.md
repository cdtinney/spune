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

### Production Deployment

Build the image:

```bash
docker build -t spune .
```

Run with an external PostgreSQL database:

```bash
docker run -d \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@host:5432/spune \
  -e SESSION_SECRET=your-production-secret \
  -e SPOT_CLIENT_ID=your-client-id \
  -e SPOT_CLIENT_SECRET=your-client-secret \
  -e SPOT_REDIRECT_URI=https://your-domain.com/api/auth/spotify/callback \
  -e CLIENT_HOST=https://your-domain.com \
  -e LAST_FM_API_KEY=your-lastfm-key \
  spune
```

Or use Docker Compose with production overrides:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

The production image is multi-stage: it builds the client, then creates a minimal image with only the server and built client assets (~120MB).

### Database Migration

The migration runs automatically when using `docker compose up` (via the init script). For manual deployment, run the SQL file against your database:

```bash
psql "$DATABASE_URL" -f packages/server/src/database/migrations/001_create_users.sql
```

## Inspiration

1. Desktop Zune software is awesome to look at on your TV
2. Desktop Spotify software sucks to look at on your TV
3. Therefore, a client that shows what you're listening to in the style of Zune must be awesome
