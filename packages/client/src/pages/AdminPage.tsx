import { useEffect, useState, type ReactNode } from 'react';
import {
  getAdminUsers,
  getAdminSessions,
  getAdminKeepalive,
  getAdminLogs,
  type AdminUser,
  type AdminSession,
  type AdminCronJob,
  type AdminCronRun,
  type AdminLogs,
  type AdminLogEntry,
} from '../features/admin/api';
import './AdminPage.css';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetchOnce<T>(fetcher: () => Promise<T>): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
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
    // Intentionally fires once on mount; fetcher is treated as stable.
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

function tokenExpiresAt(user: AdminUser): number | null {
  if (user.tokenUpdated === null || user.expiresIn === null) return null;
  return user.tokenUpdated + user.expiresIn * 1000;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section__heading">{title}</h2>
      {children}
    </section>
  );
}

function StatusLine<T>({
  state,
  isEmpty,
}: {
  state: FetchState<T>;
  isEmpty?: (data: T) => boolean;
}) {
  if (state.loading) return <p className="admin-section__status">Loading…</p>;
  if (state.error) return <p className="admin-section__error">Error: {state.error}</p>;
  if (state.data && isEmpty?.(state.data)) return <p className="admin-section__empty">No data</p>;
  return null;
}

interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
}

function DataTable<T>({
  rows,
  columns,
  getKey,
}: {
  rows: T[];
  columns: Column<T>[];
  getKey: (row: T, index: number) => string | number;
}) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.header}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={getKey(row, i)}>
            {columns.map((c) => (
              <td key={c.header}>{c.cell(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TokenStatusPill({ expired }: { expired: boolean }) {
  return (
    <span className={`admin-pill ${expired ? 'admin-pill--warn' : 'admin-pill--ok'}`}>
      {expired ? 'stale' : 'fresh'}
    </span>
  );
}

function UsersSection() {
  const state = useFetchOnce(getAdminUsers);
  const now = Date.now();
  const columns: Column<AdminUser>[] = [
    { header: 'ID', cell: (u) => u.id },
    { header: 'Spotify ID', cell: (u) => u.spotifyId },
    { header: 'Display name', cell: (u) => u.displayName ?? '—' },
    { header: 'Token updated', cell: (u) => formatTimestamp(u.tokenUpdated) },
    {
      header: 'Token status',
      cell: (u) => {
        const expiresAt = tokenExpiresAt(u);
        return <TokenStatusPill expired={expiresAt === null || expiresAt <= now} />;
      },
    },
    {
      header: 'Expires in',
      cell: (u) => {
        const expiresAt = tokenExpiresAt(u);
        return formatDuration(expiresAt === null ? null : expiresAt - now);
      },
    },
  ];
  return (
    <Section title="Users">
      <p className="admin-section__status">
        Stale tokens auto-refresh on the next Spotify API call; the indicator is informational.
      </p>
      <StatusLine state={state} isEmpty={(d: AdminUser[]) => d.length === 0} />
      {state.data && state.data.length > 0 && (
        <DataTable rows={state.data} columns={columns} getKey={(u) => u.id} />
      )}
    </Section>
  );
}

function SessionsSection() {
  const state = useFetchOnce(getAdminSessions);
  const columns: Column<AdminSession>[] = [
    { header: 'SID', cell: (s) => s.sidPrefix },
    { header: 'Spotify ID', cell: (s) => s.spotifyId ?? '—' },
    { header: 'Display name', cell: (s) => s.displayName ?? '—' },
    { header: 'Expires', cell: (s) => s.expire },
  ];
  return (
    <Section title="Active sessions">
      <StatusLine state={state} isEmpty={(d: AdminSession[]) => d.length === 0} />
      {state.data && state.data.length > 0 && (
        <DataTable rows={state.data} columns={columns} getKey={(s) => s.sidPrefix + s.expire} />
      )}
    </Section>
  );
}

const cronJobColumns: Column<AdminCronJob>[] = [
  { header: 'Job', cell: (j) => j.jobname },
  { header: 'Schedule', cell: (j) => j.schedule },
  { header: 'Active', cell: (j) => (j.active ? 'yes' : 'no') },
];

const cronRunColumns: Column<AdminCronRun>[] = [
  { header: 'Job', cell: (r) => r.jobname },
  { header: 'Status', cell: (r) => r.status },
  { header: 'Started', cell: (r) => r.startTime ?? '—' },
  { header: 'Ended', cell: (r) => r.endTime ?? '—' },
  { header: 'Message', cell: (r) => r.returnMessage ?? '—' },
];

function KeepaliveSection() {
  const state = useFetchOnce(getAdminKeepalive);
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
              <DataTable
                rows={state.data.jobs}
                columns={cronJobColumns}
                getKey={(j) => j.jobname}
              />
            </>
          )}
          {state.data.recentRuns.length > 0 && (
            <>
              <h3 className="admin-section__subheading">Recent runs</h3>
              <DataTable
                rows={state.data.recentRuns}
                columns={cronRunColumns}
                getKey={(r, i) => `${r.jobname}-${r.startTime ?? i}`}
              />
            </>
          )}
        </>
      )}
    </Section>
  );
}

function LogLine({ entry }: { entry: AdminLogEntry }) {
  const parsed = entry.parsed;
  if (!parsed) {
    return <pre className="admin-log-line">{entry.raw}</pre>;
  }
  const level = typeof parsed.level === 'string' ? parsed.level : 'log';
  const timestamp = typeof parsed.timestamp === 'string' ? parsed.timestamp : '';
  const message = typeof parsed.message === 'string' ? parsed.message : entry.raw;
  const stack = typeof parsed.stack === 'string' ? `\n${parsed.stack}` : '';
  return (
    <pre className="admin-log-line">
      <span className="admin-log-line__timestamp">{timestamp}</span>
      <span className={`admin-log-line__level admin-log-line__level--${level}`}>[{level}]</span>
      {message}
      {stack}
    </pre>
  );
}

function LogsSection() {
  const state = useFetchOnce<AdminLogs>(() => getAdminLogs(100));
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
            <div className="admin-logs">
              {state.data.entries.map((entry, i) => (
                <LogLine key={i} entry={entry} />
              ))}
            </div>
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
