#!/usr/bin/env bash
set -euo pipefail

# Run all database migrations.
# Usage (on droplet): bash migrate.sh
# Usage (local):      bash scripts/migrate.sh

MIGRATIONS_DIR=""

# Detect if running inside the Docker setup or locally
if [ -d "/opt/spune" ] && docker compose -f /opt/spune/docker-compose.yml ps db >/dev/null 2>&1; then
  # Running on droplet — execute via docker compose
  echo "==> Waiting for database..."
  until docker compose -f /opt/spune/docker-compose.yml exec db pg_isready -U spune >/dev/null 2>&1; do
    sleep 1
  done

  echo "==> Running migrations..."
  for f in /opt/spune/migrations/*.sql 2>/dev/null; do
    echo "  Applying $(basename "$f")..."
    docker compose -f /opt/spune/docker-compose.yml exec -T db psql -U spune -d spune < "$f"
  done

  # Also try from the container's bundled migrations
  docker compose -f /opt/spune/docker-compose.yml exec -T app sh -c '
    for f in /app/packages/server/src/database/migrations/*.sql; do
      echo "  Applying $(basename "$f")..."
      cat "$f"
    done
  ' | docker compose -f /opt/spune/docker-compose.yml exec -T db psql -U spune -d spune

  echo "==> Migrations complete."
else
  # Running locally
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
