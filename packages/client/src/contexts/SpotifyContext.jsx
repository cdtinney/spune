import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { getPlaybackState, getRelatedAlbums } from '../api/spotify';

const SpotifyContext = createContext(null);

const initialState = {
  nowPlaying: null,
  relatedAlbums: {
    byAlbumId: {},
    allAlbumIds: [],
  },
  initialized: false,
  loading: false,
  albumsLoading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_NOW_PLAYING_REQUEST':
      return { ...state, loading: true };

    case 'FETCH_NOW_PLAYING_SUCCESS':
      return {
        ...state,
        initialized: true,
        loading: false,
        error: null,
        nowPlaying: action.payload,
      };

    case 'FETCH_NOW_PLAYING_DUPE':
      return { ...state, initialized: true, loading: false };

    case 'FETCH_NOW_PLAYING_FAILURE':
      return { ...state, initialized: true, loading: false, error: action.payload };

    case 'CLEAR_RELATED_ALBUMS':
      return {
        ...state,
        relatedAlbums: { byAlbumId: {}, allAlbumIds: [] },
      };

    case 'FETCH_RELATED_ALBUMS_REQUEST':
      return { ...state, albumsLoading: true };

    case 'FETCH_RELATED_ALBUMS_SUCCESS': {
      const byAlbumId = {};
      const allAlbumIds = [];
      for (const album of action.payload) {
        byAlbumId[album.id] = album;
        allAlbumIds.push(album.id);
      }
      return {
        ...state,
        albumsLoading: false,
        relatedAlbums: { byAlbumId, allAlbumIds },
      };
    }

    case 'FETCH_RELATED_ALBUMS_FAILURE':
      return { ...state, albumsLoading: false };

    default:
      return state;
  }
}

export function SpotifyProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchNowPlaying = useCallback(async (loadingRef, currentSongId) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    dispatch({ type: 'FETCH_NOW_PLAYING_REQUEST' });

    try {
      const data = await getPlaybackState();
      const item = data?.item;

      if (!item) {
        dispatch({ type: 'FETCH_NOW_PLAYING_DUPE' });
        return null;
      }

      if (item.id === currentSongId) {
        dispatch({ type: 'FETCH_NOW_PLAYING_DUPE' });
        return { songId: item.id, albumId: item.album?.id };
      }

      const info = {
        songId: item.id,
        songTitle: item.name,
        songArtists: item.artists,
        artistName: item.artists.map((a) => a.name).join(', '),
        albumId: item.album.id,
        albumName: item.album.name,
        albumImageUrl: item.album.images[0]?.url,
        albumArtists: item.album.artists,
        albumImages: item.album.images,
      };

      dispatch({ type: 'FETCH_NOW_PLAYING_SUCCESS', payload: info });
      return info;
    } catch (err) {
      dispatch({ type: 'FETCH_NOW_PLAYING_FAILURE', payload: err });
      return null;
    } finally {
      loadingRef.current = false;
    }
  }, []);

  const fetchRelatedAlbums = useCallback(async (songId) => {
    dispatch({ type: 'FETCH_RELATED_ALBUMS_REQUEST' });
    try {
      const data = await getRelatedAlbums(songId);
      dispatch({ type: 'FETCH_RELATED_ALBUMS_SUCCESS', payload: data });
    } catch {
      dispatch({ type: 'FETCH_RELATED_ALBUMS_FAILURE' });
    }
  }, []);

  const clearRelatedAlbums = useCallback(() => {
    dispatch({ type: 'CLEAR_RELATED_ALBUMS' });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      fetchNowPlaying,
      fetchRelatedAlbums,
      clearRelatedAlbums,
    }),
    [state, fetchNowPlaying, fetchRelatedAlbums, clearRelatedAlbums],
  );

  return <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>;
}

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (context === null) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
}
