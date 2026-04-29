import { getAdminSessions, type AdminSession } from './api';
import { useFetchOnce } from './useFetchOnce';
import { Section, StatusLine } from './Section';
import { DataTable, type Column } from './DataTable';

const columns: Column<AdminSession>[] = [
  { header: 'SID', cell: (s) => s.sidPrefix },
  { header: 'Spotify ID', cell: (s) => s.spotifyId ?? '—' },
  { header: 'Display name', cell: (s) => s.displayName ?? '—' },
  { header: 'Expires', cell: (s) => s.expire },
];

export default function SessionsSection() {
  const state = useFetchOnce(getAdminSessions);
  return (
    <Section title="Active sessions">
      <StatusLine state={state} isEmpty={(d: AdminSession[]) => d.length === 0} />
      {state.data && state.data.length > 0 && (
        <DataTable rows={state.data} columns={columns} getKey={(s) => s.sidPrefix + s.expire} />
      )}
    </Section>
  );
}
