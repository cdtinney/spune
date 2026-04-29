import { useEffect, useState } from 'react';
import {
  getAdminUsers,
  getAdminSessions,
  getAdminKeepalive,
  getAdminLogs,
  type AdminUser,
  type AdminSession,
  type AdminLogs,
  type AdminLogEntry,
} from '../features/admin/api';
import './AdminPage.css';

interface SectionState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(fetcher: () => Promise<T>): SectionState<T> {
  const [state, setState] = useState<SectionState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: { message?: string }) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err.message ?? 'Failed to load' });
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return state;
}

function formatTimestamp(value: number | null): string {
  if (value === null) return '—';
  return new Date(value).toISOString();
}

function formatDuration(ms: number | null): string {
  if (ms === null) return '—';
  const seconds = Math.round(ms / 1000);
  if (Math.abs(seconds) < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="admin-section">
      <h2 className="admin-section__heading">{title}</h2>
      {children}
    </section>
  );
}

function StatusLine<T>({
  state,
  emptyCheck,
}: {
  state: SectionState<T>;
  emptyCheck?: (data: T) => boolean;
}) {
  if (state.loading) return <p className="admin-section__status">Loading…</p>;
  if (state.error) return <p className="admin-section__error">Error: {state.error}</p>;
  if (state.data && emptyCheck && emptyCheck(state.data))
    return <p className="admin-section__empty">No data</p>;
  return null;
}

interface TokenHealth {
  expired: boolean;
  expiresAt: number | null;
  expiresInMs: number | null;
}

function computeTokenHealth(user: AdminUser, now: number): TokenHealth {
  if (user.tokenUpdated === null || user.expiresIn === null) {
    return { expired: true, expiresAt: null, expiresInMs: null };
  }
  const expiresAt = user.tokenUpdated + user.expiresIn * 1000;
  return { expired: expiresAt <= now, expiresAt, expiresInMs: expiresAt - now };
}

function UsersSection() {
  const state = useFetch(getAdminUsers);
  const now = Date.now();
  return (
    <Section title="Users">
      <p className="admin-section__status">
        Stale tokens auto-refresh on the next Spotify API call; the indicator is informational.
      </p>
      <StatusLine state={state} emptyCheck={(d: AdminUser[]) => d.length === 0} />
      {state.data && state.data.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Spotify ID</th>
              <th>Display name</th>
              <th>Token updated</th>
              <th>Token status</th>
              <th>Expires in</th>
            </tr>
          </thead>
          <tbody>
            {state.data.map((user) => {
              const health = computeTokenHealth(user, now);
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.spotifyId}</td>
                  <td>{user.displayName ?? '—'}</td>
                  <td>{formatTimestamp(user.tokenUpdated)}</td>
                  <td>
                    <span
                      className={`admin-pill ${health.expired ? 'admin-pill--warn' : 'admin-pill--ok'}`}
                    >
                      {health.expired ? 'stale' : 'fresh'}
                    </span>
                  </td>
                  <td>{formatDuration(health.expiresInMs)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Section>
  );
}

function SessionsSection() {
  const state = useFetch(getAdminSessions);
  return (
    <Section title="Active sessions">
      <StatusLine state={state} emptyCheck={(d: AdminSession[]) => d.length === 0} />
      {state.data && state.data.length > 0 && (
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
            {state.data.map((session) => (
              <tr key={session.sidPrefix + session.expire}>
                <td>{session.sidPrefix}</td>
                <td>{session.spotifyId ?? '—'}</td>
                <td>{session.displayName ?? '—'}</td>
                <td>{session.expire}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Section>
  );
}

function KeepaliveSection() {
  const state = useFetch(getAdminKeepalive);
  return (
    <Section title="pg_cron keepalive">
      <StatusLine state={state} />
      {state.data && (
        <>
          <p className="admin-section__status">
            Last ping: {state.data.lastPing ?? 'never'} · pg_cron available:{' '}
            {state.data.cronAvailable ? 'yes' : 'no'}
          </p>
          {state.data.cronAvailable && state.data.jobs.length > 0 && (
            <>
              <h3 className="admin-section__subheading">Scheduled jobs</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Schedule</th>
                    <th>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {state.data.jobs.map((job) => (
                    <tr key={job.jobname}>
                      <td>{job.jobname}</td>
                      <td>{job.schedule}</td>
                      <td>{job.active ? 'yes' : 'no'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {state.data.recentRuns.length > 0 && (
            <>
              <h3 className="admin-section__subheading">Recent runs</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Status</th>
                    <th>Started</th>
                    <th>Ended</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {state.data.recentRuns.map((run, idx) => (
                    <tr key={`${run.jobname}-${run.startTime ?? idx}`}>
                      <td>{run.jobname}</td>
                      <td>{run.status}</td>
                      <td>{run.startTime ?? '—'}</td>
                      <td>{run.endTime ?? '—'}</td>
                      <td>{run.returnMessage ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </Section>
  );
}

function renderLogEntry(entry: AdminLogEntry, idx: number) {
  const parsed = entry.parsed;
  if (parsed) {
    const level = typeof parsed.level === 'string' ? parsed.level : 'log';
    const timestamp = typeof parsed.timestamp === 'string' ? parsed.timestamp : '';
    const message = typeof parsed.message === 'string' ? parsed.message : entry.raw;
    const stack = typeof parsed.stack === 'string' ? `\n${parsed.stack}` : '';
    return (
      <pre key={idx} className="admin-log-line">
        <span className="admin-log-line__timestamp">{timestamp}</span>
        <span className={`admin-log-line__level admin-log-line__level--${level}`}>[{level}]</span>
        {message}
        {stack}
      </pre>
    );
  }
  return (
    <pre key={idx} className="admin-log-line">
      {entry.raw}
    </pre>
  );
}

function LogsSection() {
  const state = useFetch<AdminLogs>(() => getAdminLogs(100));
  return (
    <Section title="Error log (tail)">
      <StatusLine state={state} />
      {state.data && (
        <>
          <p className="admin-section__status">
            File: {state.data.file} · last {state.data.entries.length} entries
            {state.data.note ? ` · ${state.data.note}` : ''}
          </p>
          {state.data.entries.length === 0 ? (
            <p className="admin-section__empty">No log entries</p>
          ) : (
            <div className="admin-logs">{state.data.entries.map(renderLogEntry)}</div>
          )}
        </>
      )}
    </Section>
  );
}

export default function AdminPage() {
  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Admin</h1>
      <UsersSection />
      <SessionsSection />
      <KeepaliveSection />
      <LogsSection />
    </div>
  );
}
