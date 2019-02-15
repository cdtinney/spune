//////////////////////////
// External dependencies//
//////////////////////////

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import ReactDOM from 'react-dom';

//////////////////////////
// Internal dependencies//
//////////////////////////

import './index.css';
import Routes from './routes';
import configureStore, {
  history,
} from './store/configureStore';

class Root extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
