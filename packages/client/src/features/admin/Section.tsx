import type { ReactNode } from 'react';
import type { FetchState } from './useFetchOnce';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section__heading">{title}</h2>
      {children}
    </section>
  );
}

export function StatusLine<T>({
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
