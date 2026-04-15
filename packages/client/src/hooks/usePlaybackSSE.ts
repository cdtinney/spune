import { useEffect, useRef, useState, useCallback } from 'react';
import type { NowPlaying } from '../types';

interface SSEPlaybackEvent {
  item: {
    id: string;
    name: string;
    duration_ms: number;
    artists: Array<{ id: string; name: string }>;
    album: {
      id: string;
      name: string;
      images: Array<{ url: string }>;
      artists: Array<{ id: string; name: string }>;
    };
  } | null;
  progress_ms: number;
  is_playing: boolean;
  song_changed: boolean;
}

interface UsePlaybackSSEResult {
  connected: boolean;
  nowPlaying: NowPlaying | null;
  songChanged: boolean;
  progressMs: number;
  isPlaying: boolean;
}

export default function usePlaybackSSE(): UsePlaybackSSEResult {
  const [connected, setConnected] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [songChanged, setSongChanged] = useState(false);
  const [progressMs, setProgressMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource('/api/sse/playback');
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnected(true);
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

        const info: NowPlaying = {
          songId: data.item.id,
          songTitle: data.item.name,
          songArtists: data.item.artists,
          artistName: data.item.artists.map((a) => a.name).join(', '),
          albumId: data.item.album.id,
          albumName: data.item.album.name,
          albumImageUrl: data.item.album.images[0]?.url,
          albumArtists: data.item.album.artists,
          albumImages: data.item.album.images,
          progressMs: data.progress_ms ?? 0,
          durationMs: data.item.duration_ms ?? 0,
          isPlaying: data.is_playing ?? false,
        };

        setNowPlaying(info);
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

      // Reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(connect, 5000);
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

  return { connected, nowPlaying, songChanged, progressMs, isPlaying };
}
