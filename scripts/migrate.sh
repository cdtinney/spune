#!/usr/bin/env bash
set -euo pipefail

# Run all database migrations via the app container.
# Usage (on droplet): curl ... | bash
# Usage (local):      DATABASE_URL=... bash scripts/migrate.sh

CD="/opt/spune"
DC="docker compose -f ${CD}/docker-compose.yml"

if [ -d "$CD" ] && $DC ps db >/dev/null 2>&1; then
  echo "==> Waiting for database..."
  until $DC exec -T db pg_isready -U spune >/dev/null 2>&1; do
    sleep 1
  done

  echo "==> Running migrations from app container..."
  $DC exec -T app sh -c 'cat /app/packages/server/src/database/migrations/*.sql' \
    | $DC exec -T db psql -U spune -d spune

  echo "==> Migrations complete."
else
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  MIGRATIONS_DIR="$SCRIPT_DIR/../packages/server/src/database/migrations"

  if [ -z "${DATABASE_URL:-}" ]; then
    echo "Error: DATABASE_URL is not set."
    echo "Usage: DATABASE_URL=postgresql://... bash scripts/migrate.sh"
    exit 1
  fi

  echo "==> Running migrations..."
  for f in "$MIGRATIONS_DIR"/*.sql; do
    echo "  Applying $(basename "$f")..."
    psql "$DATABASE_URL" -f "$f"
  done
  echo "==> Migrations complete."
fi
