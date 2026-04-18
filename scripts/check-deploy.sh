#!/usr/bin/env bash
#
# Poll /api/status until the deployed version matches the expected commit SHA.
#
# Usage:
#   ./scripts/check-deploy.sh <status-url> <expected-sha>
#
# Example:
#   ./scripts/check-deploy.sh https://spune.example.com/api/status abc123def456
#
# Exits 0 on success, 1 on timeout (5 minutes).
set -euo pipefail

STATUS_URL="${1:-${STATUS_URL:-}}"
EXPECTED_SHA="${2:-${EXPECTED_SHA:-}}"

if [ -z "$STATUS_URL" ]; then
  echo "Usage: $0 <status-url> <expected-sha>"
  echo "  Or set STATUS_URL and EXPECTED_SHA environment variables."
  exit 1
fi

if [ -z "$EXPECTED_SHA" ]; then
  echo "Error: expected SHA not provided."
  exit 1
fi

MAX_ATTEMPTS=30
INTERVAL=10

echo "Waiting for $STATUS_URL to report version $EXPECTED_SHA"

for i in $(seq 1 "$MAX_ATTEMPTS"); do
  VERSION=$(curl -sf "$STATUS_URL" | jq -r '.version // empty' 2>/dev/null || true)
  if [ "$VERSION" = "$EXPECTED_SHA" ]; then
    echo "Deployed successfully (attempt $i)"
    exit 0
  fi
  echo "Attempt $i/$MAX_ATTEMPTS: got '${VERSION:-<no response>}', waiting ${INTERVAL}s..."
  sleep "$INTERVAL"
done

echo "Timed out waiting for deployment after $((MAX_ATTEMPTS * INTERVAL)) seconds"
exit 1
