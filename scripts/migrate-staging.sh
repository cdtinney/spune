#!/usr/bin/env bash
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
