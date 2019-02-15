////////////////////////////
// External dependencies  //
////////////////////////////

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import spotify from './spotify';

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    spotify,
  });
}
