import { useEffect, useRef } from 'react';
import { useSpotify } from '../contexts/SpotifyContext';

const POLL_INTERVAL = 3000;

export default function useNowPlayingPoller(): void {
  const { fetchNowPlaying, fetchRelatedAlbums } = useSpotify();

  const loadingRef = useRef<boolean>(false);
  const currentAlbumIdRef = useRef<string | null>(null);
  const currentSongIdRef = useRef<string | null>(null);

  useEffect(() => {
    const poll = async (): Promise<void> => {
      const nowPlayingResult = await fetchNowPlaying(loadingRef, currentSongIdRef.current);
      if (!nowPlayingResult) return;

      currentSongIdRef.current = nowPlayingResult.songId;

      if (currentAlbumIdRef.current !== nowPlayingResult.albumId) {
        currentAlbumIdRef.current = nowPlayingResult.albumId;
        // Stale-while-revalidate: keep old albums visible while new ones load.
        // FETCH_RELATED_ALBUMS_SUCCESS replaces the state entirely.
        fetchRelatedAlbums(nowPlayingResult.songId);
      }
    };

    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchNowPlaying, fetchRelatedAlbums]);
}
