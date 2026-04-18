# Spune

> Web-based Spotify "Now Playing" visualizer, inspired by the Zune desktop software.

![Zune Player 1](./assets/player.png)
![Zune Player 2](./assets/player2.png)

## Overview

Spune displays album artwork from related artists in a Zune-style mosaic while you listen to Spotify. It discovers related artists via Last.fm and ListenBrainz, renders their album covers as an animated background, and can cast the visualization to a TV via Chromecast.

### Stack

- **Client**: React 19, Vite, TypeScript — [details](packages/client/README.md)
- **Server**: Node.js, Express, TypeScript, PostgreSQL — [details](packages/server/README.md)
- **APIs**: Spotify Web API, Last.fm, ListenBrainz/MusicBrainz
- **CI/CD**: GitHub Actions, Docker, GHCR

## Development Setup

### Prerequisites

- [Node.js 22+](https://nodejs.org/) (see `.nvmrc`)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for local PostgreSQL)
- [Spotify Developer Application](https://developer.spotify.com/dashboard)

### Quick start

```bash
git clone git@github.com:cdtinney/spune.git
cd spune
pnpm install
cp packages/server/.env.example packages/server/.env
# Edit packages/server/.env — see the file for descriptions of each variable
pnpm dev
```

`pnpm dev` starts PostgreSQL (via Docker), the Express server, and the Vite dev server. Open `http://127.0.0.1:3000`.

**Important**: Add `http://127.0.0.1:3000/api/auth/spotify/callback` to your Spotify app's redirect URIs in the [developer dashboard](https://developer.spotify.com/dashboard). Spotify requires `127.0.0.1` (not `localhost`).

### Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Start everything (DB + server + client) |
| `pnpm dev:stop`     | Stop the dev database                   |
| `pnpm client:test`  | Run client tests                        |
| `pnpm server:test`  | Run server tests                        |
| `pnpm client:lint`  | Lint client                             |
| `pnpm server:lint`  | Lint server                             |
| `pnpm client:build` | Build client for production             |

### Chromecast

Spune can cast the visualization to a Chromecast-enabled TV. See [docs/chromecast.md](docs/chromecast.md).

## Production Deployment

CI auto-builds and pushes a Docker image to `ghcr.io` on every merge to `main`. After push, a deploy-check job polls `GET /api/status` until the droplet is running the new version. See [docs/deployment.md](docs/deployment.md).

**Quick version**:

```bash
# On a fresh Ubuntu droplet:
curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/setup-droplet.sh | bash
```

## Inspiration

1. Desktop Zune software is awesome to look at on your TV
2. Desktop Spotify software sucks to look at on your TV
3. Therefore, a client that shows what you're listening to in the style of Zune must be awesome
