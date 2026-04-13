# Task 7: Dockerize and Deploy Configuration

## Prerequisites

Task 6 (client rebuild) is merged. The full app is functional.

## Goal

Make the app deployable to any Docker host with a single command. Target deployment is a DigitalOcean droplet.

## Context

- The Express server serves the built client from `packages/client/build` in production.
- The server reads `PORT` from env (defaults to 5000).
- The database is PostgreSQL, connection via `DATABASE_URL` env var.
- Required env vars: `DATABASE_URL`, `SESSION_SECRET`, `SPOT_CLIENT_ID`, `SPOT_CLIENT_SECRET`, `SPOT_REDIRECT_URI`, `CLIENT_HOST`.

## What to do

- Create a `Dockerfile` (multi-stage):
  - Stage 1: Install all deps, build the client.
  - Stage 2: Copy built client + server code, install production server deps only, run `node packages/server/app.js`.
- Create a `docker-compose.yml` for local development:
  - App service (builds from Dockerfile or runs with volume mounts for dev).
  - PostgreSQL service.
  - Environment variables with sensible defaults for local dev.
- Create a `docker-compose.prod.yml` (or a section in the docs) showing production overrides.
- Add a `.dockerignore` (node_modules, .git, etc.).
- Add a brief deployment section to the README:
  - How to run locally with Docker.
  - How to deploy to a VPS (pull image, set env vars, run).
  - Required environment variables and what they do.
- Update the GitHub Actions workflow to build and verify the Docker image as part of CI.

## Done when

- `docker compose up` starts the app + PostgreSQL locally and the app works end-to-end.
- The production Docker image builds, is reasonably small, and runs correctly.
- README has deployment instructions.
- CI builds the Docker image.
- All changes are on a feature branch off master, submitted as a PR. Do not merge directly to master.
