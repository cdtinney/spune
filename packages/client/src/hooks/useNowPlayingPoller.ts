import { useEffect, useRef } from 'react';
import { useSpotify, ActionType } from '../contexts/SpotifyContext';
import usePlaybackSSE from './usePlaybackSSE';

const POLL_INTERVAL = 3000;

export default function useNowPlayingPoller(): void {
  const { fetchNowPlaying, fetchRelatedAlbums, dispatch } = useSpotify();

  const sse = usePlaybackSSE();

  const loadingRef = useRef<boolean>(false);
  const currentAlbumIdRef = useRef<string | null>(null);
  const currentSongIdRef = useRef<string | null>(null);

  // SSE mode: receive pushed playback state
  useEffect(() => {
    if (!sse.connected || !sse.nowPlaying) return;

    const info = sse.nowPlaying;

    // Dispatch the playback state to SpotifyContext
    if (info.songId !== currentSongIdRef.current) {
      currentSongIdRef.current = info.songId;
      dispatch({ type: ActionType.FETCH_NOW_PLAYING_SUCCESS, payload: info });
    } else {
      dispatch({
        type: ActionType.UPDATE_PROGRESS,
        payload: { progressMs: info.progressMs, isPlaying: info.isPlaying },
      });
    }

    // Fetch related albums on album change
    if (info.albumId !== currentAlbumIdRef.current) {
      currentAlbumIdRef.current = info.albumId;
      fetchRelatedAlbums(info.songId);
    }
  }, [sse.connected, sse.nowPlaying, dispatch, fetchRelatedAlbums]);

  // Polling fallback: only active when SSE is not connected
  useEffect(() => {
    if (sse.connected) return; // SSE is handling updates

    const poll = async (): Promise<void> => {
      const nowPlayingResult = await fetchNowPlaying(loadingRef, currentSongIdRef.current);
      if (!nowPlayingResult) return;

      currentSongIdRef.current = nowPlayingResult.songId;

      if (currentAlbumIdRef.current !== nowPlayingResult.albumId) {
        currentAlbumIdRef.current = nowPlayingResult.albumId;
        fetchRelatedAlbums(nowPlayingResult.songId);
      }
    };

    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [sse.connected, fetchNowPlaying, fetchRelatedAlbums]);
}
