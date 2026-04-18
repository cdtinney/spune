#!/usr/bin/env bash
set -euo pipefail

# Spune droplet setup script
# Run on a fresh Ubuntu 24.04 DigitalOcean droplet:
#   ssh root@your-droplet-ip
#   curl -fsSL https://raw.githubusercontent.com/cdtinney/spune/main/scripts/setup-droplet.sh | bash

echo "==> Installing Docker..."
curl -fsSL https://get.docker.com | sh

echo ""
echo "==> Creating /opt/spune..."
mkdir -p /opt/spune
cd /opt/spune

echo "==> Writing docker-compose.yml..."
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
    ports:
      - "80:5000"
    depends_on:
      - db
    env_file: .env
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://spune:${DB_PASSWORD}@db:5432/spune

  watchtower:
    image: containrrr/watchtower
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /root/.docker/config.json:/config.json:ro
    command: --interval 60 --cleanup

volumes:
  pgdata:
COMPOSE

DB_PASSWORD=$(openssl rand -hex 16)

cat > .env <<EOF
DB_PASSWORD=${DB_PASSWORD}
SESSION_SECRET=$(openssl rand -hex 32)
SPOT_CLIENT_ID=REPLACE_ME
SPOT_CLIENT_SECRET=REPLACE_ME
SPOT_REDIRECT_URI=http://YOUR_DROPLET_IP/api/auth/spotify/callback
CLIENT_HOST=http://YOUR_DROPLET_IP
LAST_FM_API_KEY=
EOF

echo ""
echo "============================================"
echo "  Setup complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo ""
echo "  1. Log in to GitHub Container Registry:"
echo "     echo YOUR_GITHUB_PAT | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin"
echo ""
echo "  2. Edit /opt/spune/.env and fill in your Spotify credentials:"
echo "     nano /opt/spune/.env"
echo ""
echo "  3. Start everything:"
echo "     cd /opt/spune && docker compose up -d"
echo ""
echo "  4. Run the database migration (wait ~10s for Postgres to start):"
echo "     docker compose exec db psql -U spune -d spune -c \\"
echo "       \"CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, spotify_id TEXT UNIQUE NOT NULL, spotify_access_token TEXT, spotify_refresh_token TEXT, token_updated BIGINT, expires_in BIGINT, display_name TEXT, photos JSON);\""
echo ""
echo "  The app will be available on port 80."
echo "  Watchtower will auto-update when you push to main."
echo ""
