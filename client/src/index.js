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
import configureStore from './store/configureStore';

const { store, history } = configureStore();

class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Routes />
                </ConnectedRouter>
            </Provider>
        );
    }
}

ReactDOM.render(<Root />, document.getElementById('root'));
