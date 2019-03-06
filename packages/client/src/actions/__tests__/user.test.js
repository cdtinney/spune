import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as userActions from '../user';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const mockAxios = new MockAdapter(axios);

describe('user actions', () => {
  describe('async actions', () => {
    describe('fetchUserAuth()', () => {
      it('creates FETCH_USER_AUTH_SUCCESS when fetching user auth succeeds with a user', () => {
        mockAxios.onGet('/api/auth/user').reply(200, {
          user: 'foo',
        });

        const expectedActions = [{
          type: userActions.FETCH_USER_AUTH_REQ,
        }, {
          type: userActions.FETCH_USER_AUTH_SUCCESS,
          payload: {
            profile: 'foo',
          },
        }];

        const store = mockStore({});
        return store.dispatch(userActions.fetchUserAuth())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates FETCH_USER_AUTH_SUCCESS with a null profile when fetching user auth succeeds without a user', () => {
        mockAxios.onGet('/api/auth/user').reply(200, {
          user: undefined,
        });

        const expectedActions = [{
          type: userActions.FETCH_USER_AUTH_REQ,
        }, {
          type: userActions.FETCH_USER_AUTH_SUCCESS,
          payload: {
            profile: null,
          },
        }];

        const store = mockStore({});
        return store.dispatch(userActions.fetchUserAuth())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });

      it('creates FETCH_USER_AUTH_FAILURE when fetching user auth fails', () => {
        mockAxios.onGet('/api/auth/user').reply(400, 'foo');

        const expectedActions = [{
          type: userActions.FETCH_USER_AUTH_REQ,
        }, {
          type: userActions.FETCH_USER_AUTH_FAILURE,
          payload: new Error('foo'),
          error: true,
        }];

        const store = mockStore({});
        return store.dispatch(userActions.fetchUserAuth())
          .then(() => {
            expect(store.getActions()).toEqual(expectedActions);
          });
      });
    });
  });

  describe('loginUser()', () => {
    it('changes the window location to the spotify authorization route', () => {
      const assignMock = jest.fn();
      window.location.assign = assignMock;

      userActions.loginUser();
      expect(assignMock).toHaveBeenCalledWith('api/auth/spotify');
    });
  });
});
