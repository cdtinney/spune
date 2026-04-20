import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
  type RefObject,
} from 'react';
import { getPlaybackState, getRelatedAlbums } from './api';
import mapToNowPlaying from './mapToNowPlaying';
import type { NowPlaying } from '../../types';
import spotifyReducer, {
  initialState,
  ActionType,
  CONNECTION_LOST_THRESHOLD,
  type SpotifyState,
  type SpotifyAction,
} from './spotifyReducer';

interface SpotifyContextValue extends SpotifyState {
  connectionLost: boolean;
  dispatch: React.Dispatch<SpotifyAction>;
  fetchNowPlaying: (
    loadingRef: RefObject<boolean>,
    currentSongId: string | null,
  ) => Promise<NowPlaying | null>;
  fetchRelatedAlbums: (songId: string) => Promise<void>;
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
    ): Promise<NowPlaying | null> => {
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

        const progressMs = data.progress_ms ?? 0;
        const isPlaying = data.is_playing ?? false;

        if (item.id === currentSongId) {
          dispatch({ type: ActionType.FETCH_NOW_PLAYING_DUPE });
          dispatch({
            type: ActionType.UPDATE_PROGRESS,
            payload: { progressMs, isPlaying },
          });
          return mapToNowPlaying(item, progressMs, isPlaying);
        }

        const nowPlayingResult = mapToNowPlaying(item, progressMs, isPlaying);

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

  const connectionLost = state.consecutiveErrors >= CONNECTION_LOST_THRESHOLD;

  const value = useMemo<SpotifyContextValue>(
    () => ({
      ...state,
      connectionLost,
      dispatch,
      fetchNowPlaying,
      fetchRelatedAlbums,
    }),
    [state, connectionLost, dispatch, fetchNowPlaying, fetchRelatedAlbums],
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
