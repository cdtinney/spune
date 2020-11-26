////////////////////////////
// Internal dependencies  //
////////////////////////////

import { types } from '../actions/ui';

const initialState = {
  // Album grid properties.
  albumGrid: {
    maxPerRow: 26,
    // Min/max size of a single album image, in pixels.
    minSize: 80,
    maxSize: 151,
  },
  // Window properties.
  window: {
    fullscreen: false,
    width: 0,
    height: 0,
  },
};

/**
 * Handles the `ui` slice of state.
 *
 * @param {Object} state - Current state.
 * @param {Object} action - Action object.
 */
export default function ui(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_FULLSCREEN: {
      return {
        ...state,
        window: {
          ...state.window,
          fullscreen: action.payload.fullscreen,
        },
      };
    }

    case types.CALCULATE_RESPONSIVE_STATE: {
      const { window } = action.payload;
      return {
        ...state,
        window: {
          ...state.window,
          ...window,
        },
      };
    }

    default: {
      return state;
    }
  }
}
