#!/usr/bin/env bash
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
