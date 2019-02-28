import * as userActions from '../../actions/user';
import userReducer from '../user';

const initialState = {
  request: {
    loading: false,
    lastUpdated: null,
    error: null,
    errored: false,
  },
  profile: null,
};

describe('user reducer', () => {
  it('should have initial state', () => {
    expect(userReducer()).toEqual(initialState);
  });

  it('should set the request to loading', () => {
    expect(userReducer(initialState, {
      type: userActions.FETCH_AUTH_USER_REQ,
    })).toEqual({
      ...initialState,
      request: {
        loading: true,
        lastUpdated: null,
        error: null,
        errored: false,
      },
      profile: null,
    });
  });

  it('should set successful requests', () => {
    Date.now = jest.fn(() => 123);
    expect(userReducer(initialState, {
      type: userActions.FETCH_AUTH_USER_SUCCESS,
      payload: {
        profile: 'foo',
      },
    })).toEqual({
      ...initialState,
      request: {
        loading: false,
        lastUpdated: 123,
        error: null,
        errored: false,
      },
      profile: 'foo',
    });
  });

  it('should set failed requests', () => {
    expect(userReducer(initialState, {
      type: userActions.FETCH_AUTH_USER_FAILURE,
      payload: 'foo',
    })).toEqual({
      ...initialState,
      request: {
        loading: false,
        lastUpdated: null,
        error: 'foo',
        errored: true,
      },
      profile: null,
    });
  });
});

