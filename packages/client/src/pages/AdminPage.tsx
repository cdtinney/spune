import { useEffect, useState } from 'react';
import {
  getAdminUsers,
  getAdminSessions,
  type AdminUser,
  type AdminSession,
} from '../features/admin/api';
import './AdminPage.css';

export default function AdminPage() {
  const [data, setData] = useState<{ users: AdminUser[]; sessions: AdminSession[] } | null>(null);
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

  const now = Date.now();
  return (
    <div className="admin-page">
      {error && <p className="admin-page__error">{error}</p>}
      {!error && !data && <p>Loading…</p>}
      {data && (
        <>
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
        </>
      )}
    </div>
  );
}
