import { pool } from '../db';
import { encryptToken, decryptToken } from '../../auth/tokenCrypto';
import errorMessage from '../../utils/errorMessage';
import logger from '../../logger';
import type { User, UserRow, SpotifyPhoto } from '../../types';

interface FindOrCreateUserData {
  spotifyAccessToken: string;
  spotifyRefreshToken: string;
  tokenUpdated: number;
  expiresIn: number;
  displayName: string;
  photos: SpotifyPhoto[];
}

interface UpdateAccessTokenData {
  spotifyAccessToken: string;
  tokenUpdated: number;
}

async function findOrCreateUser(spotifyId: string, data: FindOrCreateUserData): Promise<User> {
  const result = await pool.query<UserRow>(
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
      encryptToken(data.spotifyAccessToken),
      encryptToken(data.spotifyRefreshToken),
      data.tokenUpdated,
      data.expiresIn,
      data.displayName,
      JSON.stringify(data.photos),
    ],
  );
  return toUser(result.rows[0]);
}

async function findUserBySpotifyId(spotifyId: string): Promise<User | null> {
  const result = await pool.query<UserRow>('SELECT * FROM users WHERE spotify_id = $1 LIMIT 1', [
    spotifyId,
  ]);
  const row = result.rows[0];
  if (!row) return null;
  // Treat an undecryptable row as not-found so the caller re-auths instead
  // of every request bubbling a 500 out of passport.deserializeUser.
  try {
    return toUser(row);
  } catch (err) {
    logger.warn(
      `[userQueries] dropping unreadable user row spotify_id=${spotifyId}: ${errorMessage(err)}`,
    );
    return null;
  }
}

async function updateUserAccessTokenBySpotifyId(
  spotifyId: string,
  data: UpdateAccessTokenData,
): Promise<User | null> {
  const result = await pool.query<UserRow>(
    `UPDATE users SET spotify_access_token = $1, token_updated = $2
     WHERE spotify_id = $3
     RETURNING *`,
    [encryptToken(data.spotifyAccessToken), data.tokenUpdated, spotifyId],
  );
  return result.rows[0] ? toUser(result.rows[0]) : null;
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    spotifyId: row.spotify_id,
    spotifyAccessToken: decryptToken(row.spotify_access_token),
    spotifyRefreshToken: decryptToken(row.spotify_refresh_token),
    tokenUpdated: row.token_updated,
    expiresIn: row.expires_in,
    displayName: row.display_name,
    photos: row.photos,
  };
}

export { findOrCreateUser, findUserBySpotifyId, updateUserAccessTokenBySpotifyId };
