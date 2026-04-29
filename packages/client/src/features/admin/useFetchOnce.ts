import { useEffect, useState } from 'react';

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetchOnce<T>(fetcher: () => Promise<T>): FetchState<T> {
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
