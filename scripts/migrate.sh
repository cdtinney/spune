#!/usr/bin/env bash
#
# Apply all SQL migrations to the production database on the droplet.
# Run on the droplet during first-time setup, and again after pulling a
# release that adds new files under packages/server/src/database/migrations/.
# Migrations are written with CREATE ... IF NOT EXISTS-style guards so re-runs
# are non-destructive, but check the SQL before re-running.
set -euo pipefail

echo "==> Waiting for database..."
until docker compose -f /opt/spune/docker-compose.yml exec -T db pg_isready -U spune 2>/dev/null; do
  sleep 1
done

echo "==> Running migrations..."
docker compose -f /opt/spune/docker-compose.yml exec -T app \
  sh -c 'cat /app/packages/server/src/database/migrations/*.sql' \
  | docker compose -f /opt/spune/docker-compose.yml exec -T db psql -U spune -d spune

echo "==> Migrations complete."
