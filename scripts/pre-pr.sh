#!/usr/bin/env bash
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
