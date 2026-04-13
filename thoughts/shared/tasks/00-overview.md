# Migration Task Sequence

These tasks should be executed in order. Each task is self-contained and designed to be completed by an AI agent in a single session. Each task should result in a commit (or series of commits) on a feature branch and a PR to master.

**Reference**: [Migration Guide](../research/2026-04-13-project-revival-migration-guide.md)

## Task Order

1. [Node.js + npm workspaces](./01-node-and-workspaces.md) — Upgrade runtime, replace Lerna
2. [PostgreSQL migration](./02-postgresql.md) — Replace MongoDB with PostgreSQL
3. [Server dependency updates](./03-server-deps.md) — Fix broken server packages
4. [Spotify API migration](./04-spotify-api.md) — Replace abandoned SDK, fix OAuth, adapt to API changes
5. [GitHub Actions](./05-github-actions.md) — Replace Travis CI
6. [Client rebuild](./06-client-rebuild.md) — Vite + React 19, port business logic
7. [Dockerize + deploy config](./07-docker.md) — Dockerfile, docker-compose, deploy docs
8. [Code + docs cleanup](./08-cleanup.md) — TypeScript migration, linting/Prettier, performance audit, simplify, docs
