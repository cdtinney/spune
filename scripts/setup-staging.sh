#!/usr/bin/env bash
set -euo pipefail

# Sets up the staging environment alongside prod at /opt/spune.
# Run on the droplet, AFTER:
#   1. DNS A record for staging.spune.tinney.dev points here
#   2. Spotify dashboard has https://staging.spune.tinney.dev/api/auth/spotify/callback
#      added as a redirect URI
#
# Idempotent — safe to re-run.
#
# Usage (on droplet):
#   curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/setup-staging.sh | bash

DOMAIN="staging.spune.tinney.dev"

if [ ! -d /opt/spune ]; then
  echo "Error: /opt/spune not found. Run setup-droplet.sh + setup-caddy.sh first."
  exit 1
fi

mkdir -p /opt/spune-staging
cd /opt/spune-staging

cat > docker-compose.yml <<'COMPOSE'
services:
  staging-db:
    image: postgres:16-alpine
    container_name: spune-staging-db
    restart: always
    environment:
      POSTGRES_USER: spune
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: spune
    volumes:
      - pgdata-staging:/var/lib/postgresql/data

  staging-app:
    image: ghcr.io/cdtinney/spune:staging
    container_name: spune-staging-app
    restart: always
    expose:
      - "5000"
    depends_on:
      - staging-db
    env_file: .env
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://spune:${DB_PASSWORD}@staging-db:5432/spune

volumes:
  pgdata-staging:

networks:
  default:
    external: true
    name: spune_default
COMPOSE

if [ ! -f .env ]; then
  # shellcheck disable=SC1091
  source /opt/spune/.env
  cat > .env <<EOF
DB_PASSWORD=$(openssl rand -hex 16)
SESSION_SECRET=$(openssl rand -hex 32)
TOKEN_ENCRYPTION_KEY=$(openssl rand -hex 32)
SPOT_CLIENT_ID=${SPOT_CLIENT_ID}
SPOT_CLIENT_SECRET=${SPOT_CLIENT_SECRET}
SPOT_REDIRECT_URI=https://${DOMAIN}/api/auth/spotify/callback
CLIENT_HOST=https://${DOMAIN}
LAST_FM_API_KEY=${LAST_FM_API_KEY:-}
EOF
fi

if ! grep -q "^${DOMAIN} {" /opt/spune/Caddyfile; then
  cat >> /opt/spune/Caddyfile <<EOF

${DOMAIN} {
    reverse_proxy spune-staging-app:5000
}
EOF
  docker exec spune-caddy-1 caddy reload --config /etc/caddy/Caddyfile
fi

echo "Staging stack scaffolded at /opt/spune-staging/."
echo "Next: push to staging (\`pnpm deploy:staging\`), then \`docker compose up -d\`"
echo "and run the user-table migration. See docs/deployment.md."
