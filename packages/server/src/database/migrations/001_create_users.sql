CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  spotify_id TEXT UNIQUE NOT NULL,
  spotify_access_token TEXT,
  spotify_refresh_token TEXT,
  token_updated BIGINT,
  expires_in BIGINT,
  display_name TEXT,
  photos JSON
);
