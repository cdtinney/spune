import { getAdminUsers, type AdminUser } from './api';
import { useFetchOnce } from './useFetchOnce';
import { Section, StatusLine } from './Section';
import { DataTable, type Column } from './DataTable';
import { formatDuration, formatTimestamp } from './formatters';

function tokenExpiresAt(user: AdminUser): number | null {
  if (user.tokenUpdated === null || user.expiresIn === null) return null;
  return user.tokenUpdated + user.expiresIn * 1000;
}

function TokenStatusPill({ expired }: { expired: boolean }) {
  return (
    <span className={`admin-pill ${expired ? 'admin-pill--warn' : 'admin-pill--ok'}`}>
      {expired ? 'stale' : 'fresh'}
    </span>
  );
}

export default function UsersSection() {
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
