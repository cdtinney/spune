#!/usr/bin/env bash
# View Spune logs on the droplet.
# Usage:
#   bash logs.sh          # all containers, last 100 lines
#   bash logs.sh app      # app only
#   bash logs.sh db       # database only
#   bash logs.sh caddy    # caddy only
#   bash logs.sh -f       # follow (live tail) all containers
#   bash logs.sh app -f   # follow app only

cd /opt/spune
SERVICE="${1:-}"

if [ "$SERVICE" = "-f" ]; then
  docker compose logs --tail 100 -f
elif [ -n "$SERVICE" ]; then
  shift
  docker compose logs --tail 100 "$@" "$SERVICE"
else
  docker compose logs --tail 100
fi
