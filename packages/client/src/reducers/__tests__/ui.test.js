import * as actions from '../../actions/ui';
import reducer from '../ui';

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
      fullscreen: true,
    });
  });
});

