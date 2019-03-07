////////////////////////////
// Internal dependencies  //
////////////////////////////

import * as uiActions from '../actions/ui';

const initialState = {
  // Whether or not the app is displaying in fullscreen.
  fullscreen: false,
  // Album grid properties.
  albums: {
    maxPerRow: 26,
    // Min/max size of a single album image, in pixels.
    minSize: 80,
    maxSize: 151,
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
    case uiActions.types.SET_FULLSCREEN: {
      return {
        ...state,
        fullscreen: action.payload.fullscreen,
      };
    }

    default: {
      return state;
    }
  }
}
