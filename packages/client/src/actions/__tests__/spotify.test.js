import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../spotify';
import SpotifyApi, {
  mockGetMe,
  mockGetCurrentlyPlayingRelatedAlbums,
  mockGetMyCurrentPlaybackState,
} from '../../api/SpotifyApi';

jest.mock('../../api/SpotifyApi');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('spotifyActions', () => {
  describe('async actions', () => {

    describe('fetchNowPlayingRelatedAlbums()', () => {
      beforeEach(() => {
        SpotifyApi.mockClear();
        mockGetCurrentlyPlayingRelatedAlbums.mockClear();
      });

      it('creates FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS when fetching related albums succeeds', () => {
        mockGetCurrentlyPlayingRelatedAlbums.mockImplementation(() =>
          Promise.resolve([{
            albumId: 'foo',
          }]));

        const expectedActions = [{
          type: actions.types.FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST,
          payload: {
            songId: 'fooSongId',
          },
        }, {
          type: actions.types.FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS,
          payload: {
            songId: 'fooSongId',
            albums: [{
              albumId: 'foo',
            }],
          },
        }];

        const store = mockStore({
          spotify: {
            nowPlaying: {
              info: {
                songId: 'fooSongId',
              },
            },
          },
        });

        return store.dispatch(actions.fetchNowPlayingRelatedAlbums())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE when fetching related albums fails', () => {
        mockGetCurrentlyPlayingRelatedAlbums.mockImplementation(() => Promise.reject('foo'));

        const expectedActions = [{
          type: actions.types.FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST,
          payload: {
            songId: 'fooSongId',
          },
        }, {
          type: actions.types.FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE,
          payload: new Error('foo'),
          error: true,
        }];

        const store = mockStore({
          spotify: {
            nowPlaying: {
              info: {
                songId: 'fooSongId',
              },
            },
          },
        });

        return store.dispatch(actions.fetchNowPlayingRelatedAlbums())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });

    describe('fetchNowPlayingInfo()', () => {
      beforeEach(() => {
        SpotifyApi.mockClear();
        mockGetMyCurrentPlaybackState.mockClear();
      });

      it('creates FETCH_NOW_PLAYING_INFO_SUCCESS when fetching playback state succeeds and current album is the same', () => {
        mockGetMyCurrentPlaybackState.mockImplementation(() =>
          Promise.resolve({
            item: {
              id: 'id',
              name: 'name',
              artists: 'artists',
              album: {
                id: 'albumId',
                name: 'albumName',
                images: [{
                  url: 'albumImageUrl',
                }],
                artists: 'albumArtists',
              },
            },
          }));

        const expectedActions = [{
          type: actions.types.FETCH_NOW_PLAYING_INFO_REQUEST,
        }, {
          type: actions.types.FETCH_NOW_PLAYING_INFO_SUCCESS,
          payload: {
            info: {
              songId: 'id',
              songTitle: 'name',
              songArtists: 'artists',
              albumId: 'albumId',
              albumName: 'albumName',
              albumArtists: 'albumArtists',
              albumImageUrl: 'albumImageUrl',
            },
          },
        }];

        const store = mockStore({
          spotify: {
            nowPlaying: {
              request: {
                loading: false,
              },
              info: {
                albumId: 'albumId',
              },
            },
          },
        });

        return store.dispatch(actions.fetchNowPlayingInfo())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates FETCH_NOW_PLAYING_INFO_FAILURE when fetching playback state succeeds and current album is the same', () => {
        mockGetMyCurrentPlaybackState.mockImplementation(() =>
          Promise.reject('foo'));

        const expectedActions = [{
          type: actions.types.FETCH_NOW_PLAYING_INFO_REQUEST,
        }, {
          type: actions.types.FETCH_NOW_PLAYING_INFO_FAILURE,
          payload: new Error('foo'),
          error: true,
        }];

        const store = mockStore({
          spotify: {
            nowPlaying: {
              request: {
                loading: false,
              },
              info: {
                albumId: 'albumId',
              },
            },
          },
        });

        return store.dispatch(actions.fetchNowPlayingInfo())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates no actions if info is already being loaded', () => {
        const expectedActions = [];

        const store = mockStore({
          spotify: {
            nowPlaying: {
              request: {
                loading: true,
              },
              info: {
                albumId: 'foo',
              },
            },
          },
        });

        return store.dispatch(actions.fetchNowPlayingInfo())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('calls fetchNowPlayingRelatedAlbums when fetching playback state succeeds and the current album is different', () => {
        actions.fetchNowPlayingRelatedAlbums = jest.fn().mockImplementation(() => ({
          type: 'mockFetchNowPlayingRelatedAlbums',
        }));

        mockGetMyCurrentPlaybackState.mockImplementation(() =>
          Promise.resolve({
            item: {
              id: 'id',
              name: 'name',
              artists: 'artists',
              album: {
                id: 'barAlbumId',
                name: 'albumName',
                images: [{
                  url: 'albumImageUrl',
                }],
                artists: 'albumArtists',
              },
            },
          }));

        const expectedActions = [{
          type: actions.types.FETCH_NOW_PLAYING_INFO_REQUEST,
        }, {
          type: actions.types.FETCH_NOW_PLAYING_INFO_SUCCESS,
          payload: {
            info: {
              songId: 'id',
              songTitle: 'name',
              songArtists: 'artists',
              albumId: 'barAlbumId',
              albumName: 'albumName',
              albumArtists: 'albumArtists',
              albumImageUrl: 'albumImageUrl',
            },
          },
        }, {
          type: actions.types.CLEAR_NOW_PLAYING_RELATED_ALBUMS,
        }, {
          type: 'mockFetchNowPlayingRelatedAlbums',
        }];

        const store = mockStore({
          spotify: {
            nowPlaying: {
              request: {
                loading: false,
              },
              info: {
                albumId: 'fooAlbumId',
              },
            },
          },
        });

        return store.dispatch(actions.fetchNowPlayingInfo())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });
  });

  describe('sync actions', () => {
    describe('clearNowPlayingRelatedAlbums()', () => {
      it('should create an action for clearing related albums', () => {
        expect(actions.clearNowPlayingRelatedAlbums()).toEqual({
          type: actions.types.CLEAR_NOW_PLAYING_RELATED_ALBUMS,
        });
      });
    });
  });
});
