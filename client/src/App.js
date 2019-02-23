//////////////////////////
// External dependencies//
//////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router'

//////////////////////////
// Internal dependencies//
//////////////////////////

import Routes from './routes';
import * as userActions from './actions/user';
import './App.css';

export class App extends Component {
  static propTypes = {
    checkUserAuth: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.checkUserAuth();
  }

  render() {
    return (
      <div className="app">
        <div className="app__content">
          <Routes />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    checkUserAuth() {
      dispatch(userActions.fetchAuthUserAndRedirect());
    },
  };
}

const ConnectedApp = connect(
  null,
  mapDispatchToProps,
)(App);

function RoutedApp(props) {
  const {
    history,
  } = props;

  return (
    <ConnectedRouter history={history}>
      <ConnectedApp />
    </ConnectedRouter>
  );
  
}

RoutedApp.propTypes = {
  history: PropTypes.object.isRequired,
};

export default RoutedApp;
