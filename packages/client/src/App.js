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
    userAuthenticated: PropTypes.bool.isRequired,
    fetchAuthUser: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchAuthUser();
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
    fetchAuthUser() {
      dispatch(userActions.fetchAuthUser());
    },
  };
}

function ConnectedApp(props) {
  const {
    history,
    userAuthenticated,
    fetchAuthUser,
  } = props;

  return (
    <ConnectedRouter history={history}>
      <App
        userAuthenticated={userAuthenticated}
        fetchAuthUser={fetchAuthUser}
      />
    </ConnectedRouter>
  );

}

ConnectedApp.propTypes = {
  history: PropTypes.object.isRequired,
  userAuthenticated: PropTypes.bool.isRequired,
  fetchAuthUser: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedApp);
