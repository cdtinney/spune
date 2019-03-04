import * as spotifyActions from '../../actions/spotify';
import spotifyReducer from '../spotify';
import spotify from '../spotify';

const initialState = {
  user: {
    request: {
      loading: false,
      lastUpdated: null,
      error: null,
      errored: false,
    },
    info: {
      id: null,
      displayName: null,
      avatarImageUrl: null,
    },
  },
  nowPlaying: {
    request: {
      loading: false,
      lastUpdated: null,
      error: null,
      errored: false,
      interval: 3000, // MS
    },
    info: {
      songId: null,
      songTitle: null,
      songArtists: null,
      artistName: null,
      albumId: null,
      albumName: null,
      albumImageUrL: null,
      albumArtists: null,
    },
    relatedAlbums: {
      request: {
        loading: false,
        error: undefined,
        errored: false,
      },
      byArtist: {},
    },
  },
};

describe('spotify reducer', () => {
  it('should have initial state', () => {
    expect(spotifyReducer()).toEqual(initialState);
  });

  describe('user', () => {
    it('should set user info requests as loading', () => {
      expect(spotifyReducer(initialState, {
        type: spotifyActions.FETCH_USER_INFO_REQUEST,
      })).toEqual({
        ...initialState,
        user: {
          ...initialState.user,
          request: {
            loading: true,
            lastUpdated: null,
            error: null,
            errored: false,
          },
        },
      });
    });

    it('should set user profiles once fetched', () => {
      Date.now = jest.fn(() => 123);
      expect(spotifyReducer(initialState, {
        type: spotifyActions.FETCH_USER_INFO_SUCCESS,
        payload: {
          info: 'foo',
        },
      })).toEqual({
        ...initialState,
        user: {
          request: {
            loading: false,
            lastUpdated: 123,
            error: null,
            errored: false,
          },
          info: 'foo',
        },
      });
    });

    it('should set user profile request errors', () => {
      expect(spotifyReducer(initialState, {
        type: spotifyActions.FETCH_USER_INFO_FAILURE,
        payload: 'foo',
      })).toEqual({
        ...initialState,
        user: {
          request: {
            loading: false,
            lastUpdated: null,
            error: 'foo',
            errored: true,
          },
          info: {
            id: null,
            displayName: null,
            avatarImageUrl: null,
          },
        },
      });
    });
  });

  describe('now playing', () => {
    it('should set now playing info requests as loading', () => {
      expect(spotifyReducer(initialState, {
        type: spotifyActions.FETCH_NOW_PLAYING_INFO_REQUEST,
      })).toEqual({
        ...initialState,
        nowPlaying: {
          ...initialState.nowPlaying,
          request: {
            ...initialState.nowPlaying.request,
            loading: true,
            lastUpdated: null,
            error: null,
            errored: false,
          },
        },
      });
    });

    it('should set now playing info', () => {
      expect(spotifyReducer(initialState, {
        type: spotifyActions.FETCH_NOW_PLAYING_INFO_SUCCESS,
        payload: {
          info: 'foo',
        },
      })).toEqual({
        ...initialState,
        nowPlaying: {
          ...initialState.nowPlaying,
          request: {
            ...initialState.nowPlaying.request,
            loading: false,
            lastUpdated: Date.now(),
            error: null,
            errored: false,
          },
          info: 'foo',
        },
      });
    });

    it('should set now playing errors', () => {
      Date.now = jest.fn(() => 123);
      expect(spotifyReducer(initialState, {
        type: spotifyActions.FETCH_NOW_PLAYING_INFO_FAILURE,
        payload: 'foo',
      })).toEqual({
        ...initialState,
        nowPlaying: {
          ...initialState.nowPlaying,
          request: {
            ...initialState.nowPlaying.request,
            lastUpdated: 123,
            error: 'foo',
            errored: true,
          },
        },
      });
    });
  });

  describe('related albums', () => {
    it('should clear related albums', () => {
      expect(spotifyReducer(initialState, {
        type: spotifyActions.CLEAR_NOW_PLAYING_RELATED_ALBUMS,
      })).toEqual({
        ...initialState,
        nowPlaying: {
          ...initialState.nowPlaying,
          relatedAlbums: {
            request: {
              loading: false,
              errored: false,
              error: undefined,
            },
            byArtist: {},
          },
        },
      });
    });

    it('should set related albums requests as loading', () => {
      expect(spotifyReducer(initialState, {
        type: spotifyActions.FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST,
      })).toEqual({
        ...initialState,
        nowPlaying: {
          ...initialState.nowPlaying,
          relatedAlbums: {
            ...initialState.nowPlaying.relatedAlbums,
            request: {
              loading: true,
              error: null,
              errored: false,
            },
          },
        },
      });
    });

    it('should set related albums', () => {
      Date.now = jest.fn(() => 123);
      expect(spotifyReducer(initialState, {
        type: spotifyActions.FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS,
        payload: {
          albumsByArtist: 'foo',
        },
      })).toEqual({
        ...initialState,
        nowPlaying: {
          ...initialState.nowPlaying,
          relatedAlbums: {
            ...initialState.nowPlaying.relatedAlbums,
            byArtist: 'foo',
            request: {
              loading: false,
              lastUpdated: 123,
              error: null,
              errored: false,
            },
          },
        },
      });
    });

    it('should set related album request errors', () => {
      expect(spotifyReducer(initialState, {
        type: spotifyActions.FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE,
        payload: 'foo',
      })).toEqual({
        ...initialState,
        nowPlaying: {
          ...initialState.nowPlaying,
          relatedAlbums: {
            byArtist: {},
            request: {
              loading: false,
              lastUpdated: null,
              errored: true,
              error: 'foo',
            },
          },
        },
      });
    });
  });
});
