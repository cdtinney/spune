const relativeTimeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'always' });

const DURATION_UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; max: number }> = [
  { unit: 'second', max: 60 },
  { unit: 'minute', max: 60 },
  { unit: 'hour', max: 24 },
  { unit: 'day', max: Infinity },
];

export function formatDuration(ms: number | null): string {
  if (ms === null) return '—';
  let value = Math.round(ms / 1000);
  for (const { unit, max } of DURATION_UNITS) {
    if (Math.abs(value) < max) return relativeTimeFormat.format(value, unit);
    value = Math.round(value / max);
  }
  return '';
}

export function formatTimestamp(value: number | null): string {
  if (value === null) return '—';
  return new Date(value).toISOString();
}
