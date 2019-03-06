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

/**
 * Root application component.
 *
 * When it's first mounted, it attempts to authorize the user.
 */
export class App extends Component {
  static propTypes = {
    userAuthenticated: PropTypes.bool.isRequired,
    fetchUserAuth: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchUserAuth();
  }

  render() {
    const {
      userAuthenticated,
    } = this.props;

    return (
      <div className="app">
        <div className="app__content">
          <Routes authenticated={userAuthenticated} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userAuthenticated: state.user.profile !== null &&
      state.user.profile.spotifyId !== undefined,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUserAuth() {
      dispatch(userActions.fetchUserAuth());
    },
  };
}

function ConnectedApp(props) {
  const {
    history,
    userAuthenticated,
    fetchUserAuth,
  } = props;

  return (
    <ConnectedRouter history={history}>
      <App
        userAuthenticated={userAuthenticated}
        fetchUserAuth={fetchUserAuth}
      />
    </ConnectedRouter>
  );

}

ConnectedApp.propTypes = {
  history: PropTypes.object.isRequired,
  userAuthenticated: PropTypes.bool.isRequired,
  fetchUserAuth: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedApp);
