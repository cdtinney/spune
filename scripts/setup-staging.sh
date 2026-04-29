#!/usr/bin/env bash
set -euo pipefail

# Sets up the staging environment alongside an existing prod setup at /opt/spune.
# Run on the same droplet as prod, AFTER:
#   1. DNS A record for staging.spune.tinney.dev points at this droplet
#   2. Spotify dashboard has https://staging.spune.tinney.dev/api/auth/spotify/callback
#      added as a redirect URI
#
# Usage (on droplet):
#   curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/setup-staging.sh | bash

DOMAIN="staging.spune.tinney.dev"

if [ ! -d /opt/spune ]; then
  echo "Error: /opt/spune not found. Run setup-droplet.sh + setup-caddy.sh first."
  exit 1
fi

echo "==> Creating /opt/spune-staging..."
mkdir -p /opt/spune-staging
cd /opt/spune-staging

echo "==> Writing docker-compose.yml..."
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
  echo "==> Generating .env..."
  DB_PASSWORD=$(openssl rand -hex 16)

  cat > .env <<EOF
DB_PASSWORD=${DB_PASSWORD}
SESSION_SECRET=$(openssl rand -hex 32)
TOKEN_ENCRYPTION_KEY=$(openssl rand -hex 32)
SPOT_CLIENT_ID=REPLACE_ME
SPOT_CLIENT_SECRET=REPLACE_ME
SPOT_REDIRECT_URI=https://${DOMAIN}/api/auth/spotify/callback
CLIENT_HOST=https://${DOMAIN}
LAST_FM_API_KEY=
EOF
else
  echo "==> .env already exists, leaving it alone"
fi

echo ""
echo "============================================"
echo "  Staging stack scaffolded."
echo "============================================"
echo ""
echo "Next steps:"
echo ""
echo "  1. Edit /opt/spune-staging/.env — copy SPOT_CLIENT_ID, SPOT_CLIENT_SECRET,"
echo "     and LAST_FM_API_KEY values from /opt/spune/.env:"
echo "       nano /opt/spune-staging/.env"
echo ""
echo "  2. Append the staging block to /opt/spune/Caddyfile and reload Caddy:"
echo "       cat >> /opt/spune/Caddyfile <<'EOF'"
echo ""
echo "       ${DOMAIN} {"
echo "           reverse_proxy spune-staging-app:5000"
echo "       }"
echo "       EOF"
echo "       docker exec spune-caddy-1 caddy reload --config /etc/caddy/Caddyfile"
echo ""
echo "  3. Push your branch to trigger the first :staging image build:"
echo "       git push origin <your-branch>:staging --force"
echo ""
echo "  4. Once CI has pushed the :staging image (~3 min), start the stack:"
echo "       cd /opt/spune-staging && docker compose up -d"
echo ""
echo "  5. Run the user-table migration (one-time):"
echo "       docker compose exec staging-db psql -U spune -d spune -c \\"
echo "         \"CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, spotify_id TEXT UNIQUE NOT NULL, spotify_access_token TEXT, spotify_refresh_token TEXT, token_updated BIGINT, expires_in BIGINT, display_name TEXT, photos JSON);\""
echo ""
echo "  6. Verify:"
echo "       curl -s https://${DOMAIN}/api/health"
echo ""
