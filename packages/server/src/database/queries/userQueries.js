const { pool } = require('../db');

async function findOrCreateUser(spotifyId, data) {
  const result = await pool.query(
    `INSERT INTO users (spotify_id, spotify_access_token, spotify_refresh_token, token_updated, expires_in, display_name, photos)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (spotify_id) DO UPDATE SET
       spotify_access_token = EXCLUDED.spotify_access_token,
       spotify_refresh_token = EXCLUDED.spotify_refresh_token,
       token_updated = EXCLUDED.token_updated,
       expires_in = EXCLUDED.expires_in,
       display_name = EXCLUDED.display_name,
       photos = EXCLUDED.photos
     RETURNING *`,
    [
      spotifyId,
      data.spotifyAccessToken,
      data.spotifyRefreshToken,
      data.tokenUpdated,
      data.expiresIn,
      data.displayName,
      JSON.stringify(data.photos),
    ],
  );
  return toUser(result.rows[0]);
}

async function findUserBySpotifyId(spotifyId) {
  const result = await pool.query(
    'SELECT * FROM users WHERE spotify_id = $1 LIMIT 1',
    [spotifyId],
  );
  return result.rows[0] ? toUser(result.rows[0]) : null;
}

async function updateUserByRefreshToken(refreshToken, data) {
  const result = await pool.query(
    `UPDATE users SET spotify_access_token = $1, token_updated = $2
     WHERE spotify_refresh_token = $3
     RETURNING *`,
    [data.spotifyAccessToken, data.tokenUpdated, refreshToken],
  );
  return result.rows[0] ? toUser(result.rows[0]) : null;
}

function toUser(row) {
  return {
    id: row.id,
    spotifyId: row.spotify_id,
    spotifyAccessToken: row.spotify_access_token,
    spotifyRefreshToken: row.spotify_refresh_token,
    tokenUpdated: row.token_updated,
    expiresIn: row.expires_in,
    displayName: row.display_name,
    photos: row.photos,
  };
}

module.exports = { findOrCreateUser, findUserBySpotifyId, updateUserByRefreshToken };
