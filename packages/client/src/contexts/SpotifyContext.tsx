import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
  type MutableRefObject,
} from 'react';
import { getPlaybackState, getRelatedAlbums } from '../api/spotify';
import type { NowPlaying, RelatedAlbums, SpotifyAlbum } from '../types';

interface SpotifyState {
  nowPlaying: NowPlaying | null;
  relatedAlbums: RelatedAlbums;
  initialized: boolean;
  loading: boolean;
  albumsLoading: boolean;
  error: unknown;
}

type SpotifyAction =
  | { type: 'FETCH_NOW_PLAYING_REQUEST' }
  | { type: 'FETCH_NOW_PLAYING_SUCCESS'; payload: NowPlaying }
  | { type: 'FETCH_NOW_PLAYING_DUPE' }
  | { type: 'UPDATE_PROGRESS'; payload: { progressMs: number; isPlaying: boolean } }
  | { type: 'FETCH_NOW_PLAYING_FAILURE'; payload: unknown }
  | { type: 'CLEAR_RELATED_ALBUMS' }
  | { type: 'FETCH_RELATED_ALBUMS_REQUEST' }
  | { type: 'FETCH_RELATED_ALBUMS_SUCCESS'; payload: SpotifyAlbum[] }
  | { type: 'FETCH_RELATED_ALBUMS_FAILURE' };

interface FetchNowPlayingResult {
  songId: string;
  albumId: string;
}

interface SpotifyContextValue extends SpotifyState {
  fetchNowPlaying: (
    loadingRef: MutableRefObject<boolean>,
    currentSongId: string | null,
  ) => Promise<FetchNowPlayingResult | NowPlaying | null>;
  fetchRelatedAlbums: (songId: string) => Promise<void>;
  clearRelatedAlbums: () => void;
}

const SpotifyContext = createContext<SpotifyContextValue | null>(null);

const initialState: SpotifyState = {
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

function reducer(state: SpotifyState, action: SpotifyAction): SpotifyState {
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

    case 'UPDATE_PROGRESS':
      if (!state.nowPlaying) return state;
      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          progressMs: action.payload.progressMs,
          isPlaying: action.payload.isPlaying,
        },
      };

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
      const byAlbumId: Record<string, SpotifyAlbum> = {};
      const allAlbumIds: string[] = [];
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

interface SpotifyProviderProps {
  children: ReactNode;
}

export function SpotifyProvider({ children }: SpotifyProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchNowPlaying = useCallback(
    async (
      loadingRef: MutableRefObject<boolean>,
      currentSongId: string | null,
    ): Promise<FetchNowPlayingResult | NowPlaying | null> => {
      if (loadingRef.current) return null;
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
          dispatch({
            type: 'UPDATE_PROGRESS',
            payload: {
              progressMs: data.progress_ms ?? 0,
              isPlaying: data.is_playing ?? false,
            },
          });
          return { songId: item.id, albumId: item.album?.id };
        }

        const info: NowPlaying = {
          songId: item.id,
          songTitle: item.name,
          songArtists: item.artists,
          artistName: item.artists.map((a) => a.name).join(', '),
          albumId: item.album.id,
          albumName: item.album.name,
          albumImageUrl: item.album.images[0]?.url,
          albumArtists: item.album.artists,
          albumImages: item.album.images,
          progressMs: data.progress_ms ?? 0,
          durationMs: item.duration_ms ?? 0,
          isPlaying: data.is_playing ?? false,
        };

        dispatch({ type: 'FETCH_NOW_PLAYING_SUCCESS', payload: info });
        return info;
      } catch (err) {
        dispatch({ type: 'FETCH_NOW_PLAYING_FAILURE', payload: err });
        return null;
      } finally {
        loadingRef.current = false;
      }
    },
    [],
  );

  const fetchRelatedAlbums = useCallback(async (songId: string): Promise<void> => {
    dispatch({ type: 'FETCH_RELATED_ALBUMS_REQUEST' });
    try {
      const data = await getRelatedAlbums(songId);
      dispatch({ type: 'FETCH_RELATED_ALBUMS_SUCCESS', payload: data });
    } catch {
      dispatch({ type: 'FETCH_RELATED_ALBUMS_FAILURE' });
    }
  }, []);

  const clearRelatedAlbums = useCallback((): void => {
    dispatch({ type: 'CLEAR_RELATED_ALBUMS' });
  }, []);

  const value = useMemo<SpotifyContextValue>(
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

export function useSpotify(): SpotifyContextValue {
  const context = useContext(SpotifyContext);
  if (context === null) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
}
