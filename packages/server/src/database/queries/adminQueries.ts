import { pool } from '../db';

export interface AdminUser {
  id: number;
  spotifyId: string;
  displayName: string | null;
  tokenUpdated: number | null;
  expiresIn: number | null;
}

export interface AdminSession {
  sidPrefix: string;
  expire: string;
  spotifyId: string | null;
  displayName: string | null;
}

interface UserRow {
  id: number;
  spotify_id: string;
  display_name: string | null;
  token_updated: string | number | null;
  expires_in: string | number | null;
}

interface SessionRow {
  sid: string;
  expire: Date;
  spotify_id: string | null;
  display_name: string | null;
}

function toBigIntNumber(value: string | number | null): number | null {
  if (value === null) return null;
  return typeof value === 'string' ? Number(value) : value;
}

export async function listUsers(): Promise<AdminUser[]> {
  const result = await pool.query<UserRow>(
    `SELECT id, spotify_id, display_name, token_updated, expires_in
     FROM users
     ORDER BY id ASC`,
  );
  return result.rows.map((row) => ({
    id: row.id,
    spotifyId: row.spotify_id,
    displayName: row.display_name,
    tokenUpdated: toBigIntNumber(row.token_updated),
    expiresIn: toBigIntNumber(row.expires_in),
  }));
}

export async function listActiveSessions(limit = 50): Promise<AdminSession[]> {
  const result = await pool.query<SessionRow>(
    `SELECT
       s.sid,
       s.expire,
       s.sess->'passport'->>'user' AS spotify_id,
       u.display_name
     FROM session s
     LEFT JOIN users u ON u.spotify_id = s.sess->'passport'->>'user'
     WHERE s.expire > NOW()
     ORDER BY s.expire DESC
     LIMIT $1`,
    [limit],
  );
  return result.rows.map((row) => ({
    sidPrefix: `${row.sid.slice(0, 8)}…`,
    expire: row.expire.toISOString(),
    spotifyId: row.spotify_id,
    displayName: row.display_name,
  }));
}
