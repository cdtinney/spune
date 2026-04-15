#!/usr/bin/env bash
set -euo pipefail

# Adds Caddy (HTTPS) to an existing Spune droplet setup.
# Usage: bash setup-caddy.sh spune.tinney.dev

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
  echo "Usage: bash setup-caddy.sh YOUR_DOMAIN"
  echo "  e.g. bash setup-caddy.sh spune.tinney.dev"
  exit 1
fi

cd /opt/spune

echo "==> Stopping containers..."
docker compose down

echo "==> Creating Caddyfile for ${DOMAIN}..."
cat > Caddyfile <<EOF
${DOMAIN} {
    reverse_proxy app:5000
}
EOF

echo "==> Updating docker-compose.yml..."
cat > docker-compose.yml <<'COMPOSE'
services:
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: spune
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: spune
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    image: ghcr.io/cdtinney/spune:latest
    restart: always
    expose:
      - "5000"
    depends_on:
      - db
    env_file: .env
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://spune:${DB_PASSWORD}@db:5432/spune

  caddy:
    image: caddy:2-alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data

  watchtower:
    image: containrrr/watchtower
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /root/.docker/config.json:/config.json:ro
    command: --interval 60 --cleanup

volumes:
  pgdata:
  caddy_data:
COMPOSE

echo "==> Updating .env redirect URIs..."
sed -i "s|SPOT_REDIRECT_URI=.*|SPOT_REDIRECT_URI=https://${DOMAIN}/api/auth/spotify/callback|" .env
sed -i "s|CLIENT_HOST=.*|CLIENT_HOST=https://${DOMAIN}|" .env

echo "==> Starting containers..."
docker compose up -d

echo ""
echo "============================================"
echo "  HTTPS setup complete!"
echo "============================================"
echo ""
echo "Your app is now at: https://${DOMAIN}"
echo ""
echo "Don't forget to add this redirect URI to your"
echo "Spotify app in the developer dashboard:"
echo ""
echo "  https://${DOMAIN}/api/auth/spotify/callback"
echo ""
