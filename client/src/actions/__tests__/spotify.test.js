import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as spotifyActions from '../spotify';
import SpotifyApi, {
  mockGetMe,
} from '../../api/SpotifyApi';

jest.mock('../../api/SpotifyApi');

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('spotifyActions', () => {
  describe('async actions', () => {
    describe('getMyInfo', () => {
      beforeEach(() => {
        SpotifyApi.mockClear();
        mockGetMe.mockClear();
      });

      it('creates FETCH_USER_INFO_SUCCESS when fetching user info succeeds with a user with an image', () => {
        mockGetMe.mockImplementation(() => Promise.resolve({  
          id: 'fooId',
          display_name: 'foo',
          images: [{
            url: 'fooImageUrl',
          }],
        }));
    
        const expectedActions = [{
          type: spotifyActions.FETCH_USER_INFO_REQUEST,
        }, {
          type: spotifyActions.FETCH_USER_INFO_SUCCESS,
          payload: {
            info: {
              id: 'fooId',
              displayName: 'foo',
              avatarImageUrl: 'fooImageUrl',
            },
          },
        }];

        const store = mockStore({});
        return store.dispatch(spotifyActions.getMyInfo())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates FETCH_USER_INFO_SUCCESS when fetching user info succeeds with a user without an image', () => {
        mockGetMe.mockImplementation(() => Promise.resolve({  
          id: 'fooId',
          display_name: 'foo',
          images: undefined,
        }));
    
        const expectedActions = [{
          type: spotifyActions.FETCH_USER_INFO_REQUEST,
        }, {
          type: spotifyActions.FETCH_USER_INFO_SUCCESS,
          payload: {
            info: {
              id: 'fooId',
              displayName: 'foo',
              avatarImageUrl: '',
            },
          },
        }];

        const store = mockStore({});
        return store.dispatch(spotifyActions.getMyInfo())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates FETCH_USER_INFO_FAILURE when fetching user info fails', () => {
        mockGetMe.mockImplementation(() => Promise.reject('foo'));
    
        const expectedActions = [{
          type: spotifyActions.FETCH_USER_INFO_REQUEST,
        }, {
          type: spotifyActions.FETCH_USER_INFO_FAILURE,
          payload: new Error('foo'),
          error: true,
        }];

        const store = mockStore({});
        return store.dispatch(spotifyActions.getMyInfo())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });
  });

  describe('sync actions', () => {
    describe('clearNowPlayingRelatedAlbums', () => {
      it('should create an action for clearing related albums', () => {
        expect(spotifyActions.clearNowPlayingRelatedAlbums()).toEqual({
          type: spotifyActions.CLEAR_NOW_PLAYING_RELATED_ALBUMS,
        });
      });
    });
  });
});
