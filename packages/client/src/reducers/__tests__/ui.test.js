import * as uiActions from '../../actions/ui';
import uiReducer from '../ui';

const initialState = {
  fullscreen: false,
  albums: {
    maxPerRow: 26,
    minSize: 80,
    maxSize: 151,
  },
};

describe('ui reducer', () => {
  it('returns initial state', () => {
    expect(uiReducer()).toEqual(initialState);
  });

  it('sets fullscreen', () => {
    expect(uiReducer(initialState, {
      type: uiActions.SET_FULLSCREEN,
      payload: {
        fullscreen: true,
      },
    })).toEqual({
      ...initialState,
      fullscreen: true,
    });
  });
});

