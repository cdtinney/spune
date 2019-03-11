///////////////////////////
// External dependencies //
///////////////////////////

import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import {
  responsiveStoreEnhancer,
  calculateResponsiveState,
} from 'redux-responsive';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

///////////////////////////
// Internal dependencies //
///////////////////////////

import createRootReducer from '../reducers/createRootReducer';

export const history = createHashHistory();

export default function configureStore() {
  const store = createStore(
    // Routing history is stored in state thus it
    // must be created and passed to the router
    // reducer initially.
    createRootReducer(history),
    undefined,
    composeWithDevTools(
      responsiveStoreEnhancer,
      applyMiddleware(
        thunk,
        routerMiddleware(history), // For dispatching history actions
      ),
    ),
  );

  window.addEventListener('resize', () =>
    store.dispatch(calculateResponsiveState(window)));

  return store;
}

