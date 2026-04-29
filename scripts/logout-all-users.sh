#!/usr/bin/env bash
# Log out every Spune user by clearing the session table on the droplet.
#
# Useful when stale session cookies point at user rows the server can't
# deserialize — e.g. after a token-encryption rollout, when pre-existing
# rows hold plaintext tokens the new decrypt path rejects and every
# authenticated request 500s before the user can reach /auth/user/logout.
# Once the session table is empty, the next request runs the OAuth flow,
# which rewrites the user row with freshly-encrypted tokens via the
# findOrCreateUser ON CONFLICT update.
#
# Usage (run on the droplet):
#   bash logout-all-users.sh        # prompts for confirmation
#   bash logout-all-users.sh --yes  # skip the prompt
set -euo pipefail

COMPOSE=(docker compose -f /opt/spune/docker-compose.yml)

if [[ "${1:-}" != "--yes" ]]; then
  read -r -p "This logs out every Spune user. Continue? [y/N] " reply
  case "$reply" in
    y|Y|yes|YES) ;;
    *) echo "Aborted."; exit 1 ;;
  esac
fi

echo "==> Clearing session table..."
"${COMPOSE[@]}" exec -T db psql -U spune -d spune -v ON_ERROR_STOP=1 \
  -c "DELETE FROM session;"

echo "==> Done. Every user will be redirected to log in on their next request."
