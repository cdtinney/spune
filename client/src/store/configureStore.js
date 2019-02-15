///////////////////////////
// External dependencies //
///////////////////////////

import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

///////////////////////////
// Internal dependencies //
///////////////////////////

import createRootReducer from '../reducers/createRootReducer';

export const history = createHashHistory();

export default function configureStore() {
  const store = createStore(
    createRootReducer(history),
    undefined,
    composeWithDevTools(
      applyMiddleware(
        thunk,
        routerMiddleware(history), // For dispatching history actions
      ),
    ),
  );

  return store;
}

