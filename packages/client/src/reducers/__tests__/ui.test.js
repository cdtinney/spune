import * as actions from '../../actions/ui';
import reducer from '../ui';

const initialState = {
  albumGrid: {
    maxPerRow: 26,
    minSize: 80,
    maxSize: 151,
  },
  window: {
    fullscreen: false,
    width: 0,
    height: 0,
  },
};

describe('ui reducer', () => {
  it('returns initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  it('sets fullscreen', () => {
    expect(reducer(initialState, {
      type: actions.types.SET_FULLSCREEN,
      payload: {
        fullscreen: true,
      },
    })).toEqual({
      ...initialState,
      window: {
        ...initialState.window,
        fullscreen: true,
      },
    });
  });
});

