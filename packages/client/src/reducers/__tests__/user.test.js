import { types } from '../../actions/user';
import reducer from '../user';

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
    expect(reducer()).toEqual(initialState);
  });

  it('should set the request to loading', () => {
    expect(reducer(initialState, {
      type: types.FETCH_USER_AUTH_REQ,
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
    expect(reducer(initialState, {
      type: types.FETCH_USER_AUTH_SUCCESS,
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
    expect(reducer(initialState, {
      type: types.FETCH_USER_AUTH_FAILURE,
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

