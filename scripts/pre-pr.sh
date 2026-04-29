#!/usr/bin/env bash
#
# Run the full local validation suite — the same checks CI runs on every PR.
# Run before pushing a branch or opening a PR. Stops on the first failure.
# Steps: format check, lint, client tests, server tests, client build, type-check both packages.
set -euo pipefail

# Server route tests need Spotify env vars (any non-empty value works for tests).
export SPOT_CLIENT_ID="${SPOT_CLIENT_ID:-test}"
export SPOT_CLIENT_SECRET="${SPOT_CLIENT_SECRET:-test}"
export SPOT_REDIRECT_URI="${SPOT_REDIRECT_URI:-http://localhost:3000/callback}"

echo "=== Format check ==="
pnpm format:check

echo ""
echo "=== Lint ==="
pnpm lint

echo ""
echo "=== Client tests ==="
pnpm client:test

echo ""
echo "=== Server tests ==="
pnpm server:test

echo ""
echo "=== Client build ==="
pnpm client:build

echo ""
echo "=== Type check (client) ==="
pnpm --filter spune-client exec tsc --noEmit

echo ""
echo "=== Type check (server) ==="
pnpm --filter spune-server exec tsc --noEmit

echo ""
echo "All checks passed."
