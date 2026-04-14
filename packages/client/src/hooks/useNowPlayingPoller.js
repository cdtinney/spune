import { useEffect, useRef } from 'react';
import { useSpotify } from '../contexts/SpotifyContext';

const POLL_INTERVAL = 3000;

export default function useNowPlayingPoller() {
  const {
    fetchNowPlaying,
    fetchRelatedAlbums,
    clearRelatedAlbums,
  } = useSpotify();

  const loadingRef = useRef(false);
  const currentAlbumIdRef = useRef(null);

  useEffect(() => {
    const poll = async () => {
      const info = await fetchNowPlaying(loadingRef);
      if (!info) return;

      if (currentAlbumIdRef.current !== info.albumId) {
        currentAlbumIdRef.current = info.albumId;
        clearRelatedAlbums();
        fetchRelatedAlbums(info.songId);
      }
    };

    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchNowPlaying, fetchRelatedAlbums, clearRelatedAlbums]);
}
