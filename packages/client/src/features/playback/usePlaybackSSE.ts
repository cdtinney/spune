import { useEffect, useRef, useState, useCallback } from 'react';
import mapToNowPlaying from './mapToNowPlaying';
import type { NowPlaying, SpotifyTrack } from '../../types';

interface SSEPlaybackEvent {
  item: SpotifyTrack | null;
  progress_ms: number;
  is_playing: boolean;
  song_changed: boolean;
}

const RECONNECT_DELAY = 5000;
const GIVE_UP_THRESHOLD = 30000;

interface UsePlaybackSSEResult {
  connected: boolean;
  gaveUp: boolean;
  nowPlaying: NowPlaying | null;
  songChanged: boolean;
  progressMs: number;
  isPlaying: boolean;
}

export default function usePlaybackSSE(): UsePlaybackSSEResult {
  const [connected, setConnected] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [songChanged, setSongChanged] = useState(false);
  const [progressMs, setProgressMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const firstErrorAtRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource('/api/sse/playback');
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnected(true);
      setGaveUp(false);
      firstErrorAtRef.current = null;
    };

    es.addEventListener('playback', (event: MessageEvent) => {
      try {
        const data: SSEPlaybackEvent = JSON.parse(event.data);

        setProgressMs(data.progress_ms ?? 0);
        setIsPlaying(data.is_playing ?? false);
        setSongChanged(data.song_changed ?? false);

        if (!data.item) {
          setNowPlaying(null);
          return;
        }

        setNowPlaying(mapToNowPlaying(data.item, data.progress_ms ?? 0, data.is_playing ?? false));
      } catch {
        // Ignore parse errors
      }
    });

    es.addEventListener('error', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.warn('[SSE] Server error:', data.message);
      } catch {
        // Non-JSON error event
      }
    });

    es.onerror = () => {
      setConnected(false);
      es.close();
      eventSourceRef.current = null;

      const now = Date.now();
      if (firstErrorAtRef.current === null) {
        firstErrorAtRef.current = now;
      }

      if (now - firstErrorAtRef.current >= GIVE_UP_THRESHOLD) {
        setGaveUp(true);
        return;
      }

      reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return { connected, gaveUp, nowPlaying, songChanged, progressMs, isPlaying };
}
