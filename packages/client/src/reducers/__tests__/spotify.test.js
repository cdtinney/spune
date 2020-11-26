import { types } from '../../actions/spotify';
import reducer from '../spotify';

const initialState = {
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
      byAlbumId: {},
      allAlbumIds: [],
    },
  },
};

describe('spotify reducer', () => {
  it('should have initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  describe('now playing', () => {
    it('should set now playing info requests as loading', () => {
      expect(reducer(initialState, {
        type: types.FETCH_NOW_PLAYING_INFO_REQUEST,
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
      expect(reducer(initialState, {
        type: types.FETCH_NOW_PLAYING_INFO_SUCCESS,
        payload: {
          info: 'foo',
          dateUpdated: 123,
        },
      })).toEqual({
        ...initialState,
        nowPlaying: {
          ...initialState.nowPlaying,
          request: {
            ...initialState.nowPlaying.request,
            loading: false,
            lastUpdated: 123,
            error: null,
            errored: false,
          },
          info: 'foo',
        },
      });
    });

    it('should set now playing errors', () => {
      expect(reducer(initialState, {
        type: types.FETCH_NOW_PLAYING_INFO_FAILURE,
        payload: 'foo',
      })).toEqual({
        ...initialState,
        nowPlaying: {
          ...initialState.nowPlaying,
          request: {
            ...initialState.nowPlaying.request,
            lastUpdated: null,
            error: 'foo',
            errored: true,
          },
        },
      });
    });
  });

  describe('related albums', () => {
    it('should clear related albums', () => {
      expect(reducer(initialState, {
        type: types.CLEAR_NOW_PLAYING_RELATED_ALBUMS,
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
            byAlbumId: {},
            allAlbumIds: [],
          },
        },
      });
    });

    it('should set related albums requests as loading', () => {
      expect(reducer(initialState, {
        type: types.FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST,
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
      expect(reducer(initialState, {
        type: types.FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS,
        payload: {
          albums: [{
            id: 'foo',
          }],
          dateUpdated: 123,
        },
      })).toEqual({
        ...initialState,
        nowPlaying: {
          ...initialState.nowPlaying,
          relatedAlbums: {
            ...initialState.nowPlaying.relatedAlbums,
            byAlbumId: {
              'foo': {
                id: 'foo',
              },
            },
            allAlbumIds: [ 'foo' ],
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
      expect(reducer(initialState, {
        type: types.FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE,
        payload: 'foo',
      })).toEqual({
        ...initialState,
        nowPlaying: {
          ...initialState.nowPlaying,
          relatedAlbums: {
            byAlbumId: {},
            allAlbumIds: [],
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
