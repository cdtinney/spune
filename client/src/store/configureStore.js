
//////////////////////////
// External dependencies//
//////////////////////////

import { createStore, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import thunk from 'redux-thunk';

//////////////////////////
// Internal dependencies//
//////////////////////////

import reducer from '../reducers';

export default function configureStore() {
  const history = createHashHistory();
  
  // Create a new root reducer with router state.
  const rootReducer = connectRouter(history)(reducer);

  // Dispatch history actions.
  const reduxRouterMiddleware = routerMiddleware(history);

  const createStoreWithMiddleware = applyMiddleware(
    thunk,
    reduxRouterMiddleware,
  )(createStore);

  return {
    store: createStoreWithMiddleware(rootReducer),
    history,
  };
}

