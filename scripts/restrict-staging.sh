#!/usr/bin/env bash
set -euo pipefail

# Sets ALLOWED_SPOTIFY_IDS in /opt/spune-staging/.env on the staging droplet
# and restarts the staging-app container. Idempotent — replaces the existing
# line if present, otherwise appends.
#
# Usage:
#   ./scripts/restrict-staging.sh                       # default IDs: cdtinney
#   ./scripts/restrict-staging.sh alice,bob,cdtinney    # custom IDs
#   SPUNE_HOST=root@1.2.3.4 ./scripts/restrict-staging.sh

IDS="${1:-cdtinney}"
HOST="${SPUNE_HOST:-root@spune.tinney.dev}"

if [[ ! "$IDS" =~ ^[a-zA-Z0-9_,-]+$ ]]; then
  echo "Error: ALLOWED_SPOTIFY_IDS may only contain letters, digits, _, -, and commas."
  exit 1
fi

ssh "$HOST" bash -s <<REMOTE
set -euo pipefail
ENV_FILE=/opt/spune-staging/.env

if [ ! -f "\$ENV_FILE" ]; then
  echo "Error: \$ENV_FILE not found. Run setup-staging.sh first." >&2
  exit 1
fi

if grep -q '^ALLOWED_SPOTIFY_IDS=' "\$ENV_FILE"; then
  sed -i "s|^ALLOWED_SPOTIFY_IDS=.*|ALLOWED_SPOTIFY_IDS=${IDS}|" "\$ENV_FILE"
else
  echo "ALLOWED_SPOTIFY_IDS=${IDS}" >> "\$ENV_FILE"
fi

cd /opt/spune-staging
docker compose restart staging-app
REMOTE

echo "Set ALLOWED_SPOTIFY_IDS=${IDS} on staging and restarted the app."
