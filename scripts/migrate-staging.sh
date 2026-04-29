#!/usr/bin/env bash
#
# Apply SQL migrations to the staging database at /opt/spune-staging.
# Run on the droplet once after `setup-staging.sh` (first-start migration), and
# again after pulling a staging build that adds new migration files.
# Same idempotency caveat as scripts/migrate.sh.
set -euo pipefail

cd /opt/spune-staging

echo "==> Waiting for staging database..."
until docker compose exec -T staging-db pg_isready -U spune 2>/dev/null; do
  sleep 1
done

echo "==> Running migrations..."
docker compose exec -T staging-app \
  sh -c 'cat /app/packages/server/src/database/migrations/*.sql' \
  | docker compose exec -T staging-db psql -U spune -d spune

echo "==> Migrations complete."
