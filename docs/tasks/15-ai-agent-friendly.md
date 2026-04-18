# Task 15: Make the Repo AI-Agent Friendly

## Goal

Make the repository easy for AI coding agents (Claude Code, Copilot Workspace, Cursor, etc.) to understand, navigate, and contribute to safely.

## Context

AI agents work best when a repo has clear structure, explicit conventions, and guardrails that prevent common mistakes. This repo has been largely built with Claude Code — codifying what works well and preventing known pitfalls will make future AI-assisted development faster and more reliable.

## What to do

### AGENTS.md

Create an `AGENTS.md` file in the repo root with:

- **Project overview**: What Spune is, the monorepo structure, key packages.
- **Architecture**: How the client and server communicate, the auth flow, the album discovery pipeline.
- **Key conventions**: TypeScript strict mode, Vitest for tests, Prettier formatting, pnpm workspaces.
- **Common tasks**: How to add a new API endpoint, how to add a new React component, how to add a database migration.
- **Gotchas**: Things that have tripped up development (session cookie port mismatch in dev, dotenv load order, rate limiting in dev, Spotify redirect URI must use 127.0.0.1, etc.).
- **Pre-PR checklist**: What must pass before opening a PR (format, lint, tests, build, type check).

### CONTRIBUTING.md

Create a `CONTRIBUTING.md` with:

- Setup instructions (reference README).
- Branch naming convention (`task/NN-description`).
- Commit message format.
- PR process (branch off main, CI must pass, squash merge).
- How to run the full check suite locally before pushing.

### Pre-PR validation script

Create a `scripts/check.sh` that runs the full CI suite locally:

```bash
pnpm format:check
pnpm lint
pnpm --filter spune-client test
pnpm --filter spune-server test
pnpm --filter spune-client build
npx tsc --noEmit  # both packages
```

Reference this in AGENTS.md and CONTRIBUTING.md.

### Project structure documentation

Add a tree/diagram of the monorepo structure to AGENTS.md:

```
packages/
  client/          # React 19 + Vite SPA
    src/
      components/  # UI components
      contexts/    # React contexts (UserContext, SpotifyContext)
      hooks/       # Custom hooks
      pages/       # Page components
      types/       # TypeScript types
  server/          # Express + TypeScript API
    src/
      auth/        # Passport.js auth
      config/      # App configuration
      database/    # PostgreSQL queries
      middleware/   # Express middleware
      routes/      # API routes
      spotify/     # Spotify API integration
      types/       # TypeScript types
```

### CI guardrails

- Ensure the CI workflow is comprehensive enough that if all checks pass, the PR is safe to merge.
- Consider adding a type-check step to CI if not already present.
- Consider adding a PR template (`.github/pull_request_template.md`) with a checklist.

## Done when

- `AGENTS.md` exists and accurately describes the project for an AI agent.
- `CONTRIBUTING.md` exists with setup and contribution guidelines.
- `scripts/check.sh` runs the full validation suite.
- A PR template exists with a checklist.
- An AI agent with no prior context could clone the repo, read AGENTS.md, and successfully make a change.
