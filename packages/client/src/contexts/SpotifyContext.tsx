import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
  type RefObject,
} from 'react';
import { getPlaybackState, getRelatedAlbums } from '../api/spotify';
import mapToNowPlaying from '../api/mapToNowPlaying';
import type { NowPlaying } from '../types';
import spotifyReducer, {
  initialState,
  ActionType,
  CONNECTION_LOST_THRESHOLD,
  type SpotifyState,
  type SpotifyAction,
} from './spotifyReducer';

interface FetchNowPlayingResult {
  songId: string;
  albumId: string;
}

interface SpotifyContextValue extends SpotifyState {
  connectionLost: boolean;
  dispatch: React.Dispatch<SpotifyAction>;
  fetchNowPlaying: (
    loadingRef: RefObject<boolean>,
    currentSongId: string | null,
  ) => Promise<FetchNowPlayingResult | NowPlaying | null>;
  fetchRelatedAlbums: (songId: string) => Promise<void>;
  clearRelatedAlbums: () => void;
}

const SpotifyContext = createContext<SpotifyContextValue | null>(null);

interface SpotifyProviderProps {
  children: ReactNode;
}

export function SpotifyProvider({ children }: SpotifyProviderProps) {
  const [state, dispatch] = useReducer(spotifyReducer, initialState);

  const fetchNowPlaying = useCallback(
    async (
      loadingRef: RefObject<boolean>,
      currentSongId: string | null,
    ): Promise<FetchNowPlayingResult | NowPlaying | null> => {
      if (loadingRef.current) return null;
      loadingRef.current = true;

      dispatch({ type: ActionType.FETCH_NOW_PLAYING_REQUEST });

      try {
        const data = await getPlaybackState();
        const item = data?.item;

        if (!item) {
          dispatch({ type: ActionType.FETCH_NOW_PLAYING_DUPE });
          return null;
        }

        if (item.id === currentSongId) {
          dispatch({ type: ActionType.FETCH_NOW_PLAYING_DUPE });
          dispatch({
            type: ActionType.UPDATE_PROGRESS,
            payload: {
              progressMs: data.progress_ms ?? 0,
              isPlaying: data.is_playing ?? false,
            },
          });
          return { songId: item.id, albumId: item.album?.id };
        }

        const nowPlayingResult = mapToNowPlaying(
          item,
          data.progress_ms ?? 0,
          data.is_playing ?? false,
        );

        dispatch({ type: ActionType.FETCH_NOW_PLAYING_SUCCESS, payload: nowPlayingResult });
        return nowPlayingResult;
      } catch (err) {
        dispatch({ type: ActionType.FETCH_NOW_PLAYING_FAILURE, payload: err });
        return null;
      } finally {
        loadingRef.current = false;
      }
    },
    [],
  );

  const fetchRelatedAlbums = useCallback(async (songId: string): Promise<void> => {
    dispatch({ type: ActionType.FETCH_RELATED_ALBUMS_REQUEST });
    try {
      const data = await getRelatedAlbums(songId);
      dispatch({ type: ActionType.FETCH_RELATED_ALBUMS_SUCCESS, payload: data });
    } catch {
      dispatch({ type: ActionType.FETCH_RELATED_ALBUMS_FAILURE });
    }
  }, []);

  const clearRelatedAlbums = useCallback((): void => {
    dispatch({ type: ActionType.CLEAR_RELATED_ALBUMS });
  }, []);

  const connectionLost = state.consecutiveErrors >= CONNECTION_LOST_THRESHOLD;

  const value = useMemo<SpotifyContextValue>(
    () => ({
      ...state,
      connectionLost,
      dispatch,
      fetchNowPlaying,
      fetchRelatedAlbums,
      clearRelatedAlbums,
    }),
    [state, connectionLost, dispatch, fetchNowPlaying, fetchRelatedAlbums, clearRelatedAlbums],
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
