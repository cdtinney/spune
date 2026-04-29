import { getAdminKeepalive, type AdminCronJob, type AdminCronRun } from './api';
import { useFetchOnce } from './useFetchOnce';
import { Section, StatusLine } from './Section';
import { DataTable, type Column } from './DataTable';

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

export default function KeepaliveSection() {
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
