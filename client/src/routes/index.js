///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router';

///////////////////////////
// Internal dependencies //
///////////////////////////

import HomePage from '../pages/HomePage';
import VisualizationPage from '../pages/VisualizationPage';
import ErrorPage from '../pages/ErrorPage';

function PrivateRoute(props) {
  const {
    component,
    authenticated,
    ...rest
  } = props;

  return (
    <Route
      { ...rest }
      render={props => (
        authenticated ? <Component {...props} /> :
        <Redirect to={{
          pathname: '/',
          state: {
            from: props.path,
            },
          }}
        />
      )}
    />
  );
}

export function Routes(props) {
  const {
    authenticated,
  } = props;

  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route path="/home" component={HomePage} />
      <PrivateRoute
        path="/visualization"
        component={VisualizationPage}
        authenticated={authenticated}
      />
      <Route path="/error/:errorMsg" component={ErrorPage} />
    </Switch>
  );
}

Routes.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default Routes;
