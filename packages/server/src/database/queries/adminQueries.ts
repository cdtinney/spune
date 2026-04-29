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

export interface AdminCronJob {
  jobname: string;
  schedule: string;
  active: boolean;
}

export interface AdminCronRun {
  jobname: string;
  status: string;
  returnMessage: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface AdminKeepaliveStatus {
  lastPing: string | null;
  cronAvailable: boolean;
  jobs: AdminCronJob[];
  recentRuns: AdminCronRun[];
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

interface KeepaliveRow {
  pinged_at: Date;
}

interface CronJobRow {
  jobname: string;
  schedule: string;
  active: boolean;
}

interface CronRunRow {
  jobname: string;
  status: string;
  return_message: string | null;
  start_time: Date | null;
  end_time: Date | null;
}

function toBigIntNumber(value: string | number | null): number | null {
  if (value === null) return null;
  return typeof value === 'string' ? Number(value) : value;
}

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
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

async function queryLastPing(): Promise<string | null> {
  return safeQuery<string | null>(async () => {
    const result = await pool.query<KeepaliveRow>(
      `SELECT pinged_at FROM _keepalive ORDER BY pinged_at DESC LIMIT 1`,
    );
    return result.rows[0]?.pinged_at.toISOString() ?? null;
  }, null);
}

async function queryCronJobs(): Promise<AdminCronJob[] | null> {
  return safeQuery<AdminCronJob[] | null>(async () => {
    const result = await pool.query<CronJobRow>(
      `SELECT jobname, schedule, active FROM cron.job ORDER BY jobname`,
    );
    return result.rows.map((row) => ({
      jobname: row.jobname,
      schedule: row.schedule,
      active: row.active,
    }));
  }, null);
}

async function queryRecentCronRuns(limit: number): Promise<AdminCronRun[]> {
  return safeQuery<AdminCronRun[]>(async () => {
    const result = await pool.query<CronRunRow>(
      `SELECT j.jobname, r.status, r.return_message, r.start_time, r.end_time
       FROM cron.job_run_details r
       JOIN cron.job j ON j.jobid = r.jobid
       ORDER BY r.start_time DESC
       LIMIT $1`,
      [limit],
    );
    return result.rows.map((row) => ({
      jobname: row.jobname,
      status: row.status,
      returnMessage: row.return_message,
      startTime: row.start_time?.toISOString() ?? null,
      endTime: row.end_time?.toISOString() ?? null,
    }));
  }, []);
}

export async function getKeepaliveStatus(): Promise<AdminKeepaliveStatus> {
  const [lastPing, jobs, recentRuns] = await Promise.all([
    queryLastPing(),
    queryCronJobs(),
    queryRecentCronRuns(10),
  ]);
  return {
    lastPing,
    cronAvailable: jobs !== null,
    jobs: jobs ?? [],
    recentRuns,
  };
}
