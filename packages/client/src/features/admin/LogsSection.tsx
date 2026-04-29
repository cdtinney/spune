import { getAdminLogs, type AdminLogs, type AdminLogEntry } from './api';
import { useFetchOnce } from './useFetchOnce';
import { Section, StatusLine } from './Section';

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

export default function LogsSection() {
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
