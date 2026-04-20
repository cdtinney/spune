import type { NowPlaying, RelatedAlbums, SpotifyAlbum } from '../../types';

export const CONNECTION_LOST_THRESHOLD = 3;

export const ActionType = {
  FETCH_NOW_PLAYING_REQUEST: 'FETCH_NOW_PLAYING_REQUEST',
  FETCH_NOW_PLAYING_SUCCESS: 'FETCH_NOW_PLAYING_SUCCESS',
  FETCH_NOW_PLAYING_DUPE: 'FETCH_NOW_PLAYING_DUPE',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  FETCH_NOW_PLAYING_FAILURE: 'FETCH_NOW_PLAYING_FAILURE',
  FETCH_RELATED_ALBUMS_REQUEST: 'FETCH_RELATED_ALBUMS_REQUEST',
  FETCH_RELATED_ALBUMS_SUCCESS: 'FETCH_RELATED_ALBUMS_SUCCESS',
  FETCH_RELATED_ALBUMS_FAILURE: 'FETCH_RELATED_ALBUMS_FAILURE',
} as const;

export interface SpotifyState {
  nowPlaying: NowPlaying | null;
  relatedAlbums: RelatedAlbums;
  initialized: boolean;
  error: unknown;
  consecutiveErrors: number;
}

export type SpotifyAction =
  | { type: typeof ActionType.FETCH_NOW_PLAYING_REQUEST }
  | { type: typeof ActionType.FETCH_NOW_PLAYING_SUCCESS; payload: NowPlaying }
  | { type: typeof ActionType.FETCH_NOW_PLAYING_DUPE }
  | { type: typeof ActionType.UPDATE_PROGRESS; payload: { progressMs: number; isPlaying: boolean } }
  | { type: typeof ActionType.FETCH_NOW_PLAYING_FAILURE; payload: unknown }
  | { type: typeof ActionType.FETCH_RELATED_ALBUMS_REQUEST }
  | { type: typeof ActionType.FETCH_RELATED_ALBUMS_SUCCESS; payload: SpotifyAlbum[] }
  | { type: typeof ActionType.FETCH_RELATED_ALBUMS_FAILURE };

export const initialState: SpotifyState = {
  nowPlaying: null,
  relatedAlbums: {
    byAlbumId: {},
    allAlbumIds: [],
  },
  initialized: false,
  error: null,
  consecutiveErrors: 0,
};

export default function spotifyReducer(state: SpotifyState, action: SpotifyAction): SpotifyState {
  switch (action.type) {
    case ActionType.FETCH_NOW_PLAYING_REQUEST:
      return state;

    case ActionType.FETCH_NOW_PLAYING_SUCCESS:
      return {
        ...state,
        initialized: true,
        error: null,
        consecutiveErrors: 0,
        nowPlaying: action.payload,
      };

    case ActionType.FETCH_NOW_PLAYING_DUPE:
      return { ...state, initialized: true };

    case ActionType.UPDATE_PROGRESS:
      if (!state.nowPlaying) return state;
      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          progressMs: action.payload.progressMs,
          isPlaying: action.payload.isPlaying,
        },
      };

    case ActionType.FETCH_NOW_PLAYING_FAILURE: {
      const consecutiveErrors = Math.min(state.consecutiveErrors + 1, CONNECTION_LOST_THRESHOLD);
      if (
        state.consecutiveErrors === consecutiveErrors &&
        state.initialized &&
        state.error != null
      ) {
        return state;
      }
      return {
        ...state,
        initialized: true,
        error: action.payload,
        consecutiveErrors,
      };
    }

    case ActionType.FETCH_RELATED_ALBUMS_REQUEST:
      return state;

    case ActionType.FETCH_RELATED_ALBUMS_SUCCESS: {
      const byAlbumId: Record<string, SpotifyAlbum> = {};
      const allAlbumIds: string[] = [];
      for (const album of action.payload) {
        byAlbumId[album.id] = album;
        allAlbumIds.push(album.id);
      }
      return {
        ...state,
        relatedAlbums: { byAlbumId, allAlbumIds },
      };
    }

    case ActionType.FETCH_RELATED_ALBUMS_FAILURE:
      return state;

    default:
      return state;
  }
}
