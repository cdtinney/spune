# Contributing

## Setup

See the [README](README.md) for full setup instructions. In short:

```bash
git clone git@github.com:cdtinney/spune.git
cd spune
pnpm install
cp packages/server/.env.example packages/server/.env
# Edit .env with your credentials
pnpm dev
```

## Branch Naming

Use the format: `task/NN-description`

Examples:

- `task/15-ai-agent-friendly`
- `task/08-typescript-migration`

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add related artist caching
fix: correct session cookie domain in dev
docs: update README setup instructions
refactor: extract album dedup logic
test: add tests for token refresh
chore: update dependencies
```

## PR Process

1. Branch off `master`.
2. Make your changes.
3. Run the full check suite locally:
   ```bash
   ./scripts/pre-pr.sh
   ```
4. Push your branch and open a PR against `master`.
5. CI must pass (format, lint, test, build).
6. PRs are squash-merged.

## Running Checks Locally

The `scripts/pre-pr.sh` script runs the full CI suite:

```bash
./scripts/pre-pr.sh
```

This runs formatting, linting, tests, build, and type-checking for both packages. Run this before pushing to catch issues early.

Individual checks:

```bash
pnpm format:check           # Prettier
pnpm lint                   # ESLint (both packages)
pnpm client:test            # Client tests
pnpm server:test            # Server tests
pnpm client:build           # Client build
pnpm --filter spune-client exec tsc --noEmit  # Client types
pnpm --filter spune-server exec tsc --noEmit  # Server types
```
