////////////////////////////
// External dependencies  //
////////////////////////////

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import spotify from './spotify';
import ui from './ui';
import user from './user';

/**
 * Combines all reducers into a single reducing function.
 *
 * @param {Object} history - Browser history.
 * @returns {Function} Root reducer for a Redux store.
 */
export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    spotify,
    ui,
    user,
  });
}
