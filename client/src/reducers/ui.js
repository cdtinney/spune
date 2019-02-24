////////////////////////////
// Internal dependencies  //
////////////////////////////

import * as uiActions from '../actions/ui';

const initialState = {
  fullscreen: false,
};

export default function ui(state = initialState, action = {}) {
  switch (action.type) {
    case uiActions.SET_FULLSCREEN: {
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
