import { useEffect, useState } from 'react';
import {
  getAdminUsers,
  getAdminSessions,
  type AdminUser,
  type AdminSession,
} from '../features/admin/api';
import './AdminPage.css';

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' });

function formatRelative(ms: number): string {
  let value = Math.round(ms / 1000);
  let unit: Intl.RelativeTimeFormatUnit = 'second';
  for (const [next, divisor] of [
    ['minute', 60],
    ['hour', 60],
    ['day', 24],
  ] as const) {
    if (Math.abs(value) < divisor) break;
    value = Math.round(value / divisor);
    unit = next;
  }
  return rtf.format(value, unit);
}

interface AdminData {
  users: AdminUser[];
  sessions: AdminSession[];
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAdminUsers(), getAdminSessions()])
      .then(([users, sessions]) => {
        if (!cancelled) setData({ users, sessions });
      })
      .catch((err: { message?: string }) => {
        if (!cancelled) setError(err.message ?? 'Failed to load');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error)
    return (
      <div className="admin-page">
        <p className="admin-page__error">{error}</p>
      </div>
    );
  if (!data)
    return (
      <div className="admin-page">
        <p>Loading…</p>
      </div>
    );

  const now = Date.now();
  return (
    <div className="admin-page">
      <h1>Admin</h1>

      <h2>Users</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Spotify ID</th>
            <th>Display name</th>
            <th>Token updated</th>
            <th>Status</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((u) => {
            const expiresAt =
              u.tokenUpdated !== null && u.expiresIn !== null
                ? u.tokenUpdated + u.expiresIn * 1000
                : null;
            return (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.spotifyId}</td>
                <td>{u.displayName ?? '—'}</td>
                <td>{u.tokenUpdated ? new Date(u.tokenUpdated).toISOString() : '—'}</td>
                <td>{expiresAt === null ? '—' : expiresAt > now ? 'fresh' : 'stale'}</td>
                <td>{expiresAt === null ? '—' : formatRelative(expiresAt - now)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2>Active sessions</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>SID</th>
            <th>Spotify ID</th>
            <th>Display name</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          {data.sessions.map((s) => (
            <tr key={s.sidPrefix + s.expire}>
              <td>{s.sidPrefix}</td>
              <td>{s.spotifyId ?? '—'}</td>
              <td>{s.displayName ?? '—'}</td>
              <td>{s.expire}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
