import * as uiActions from '../../actions/ui';
import uiReducer from '../ui';

const initialState = {
  fullscreen: false,
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

