///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
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
    component: AuthenticatedComponent,
    authenticated,
    ...rest
  } = props;

  const CurrentComponent = authenticated ? 
    AuthenticatedComponent :
    function RedirectComponent(props) {
      return (
        <Redirect
          to={{
            pathname: '/',
            state: {
              from: props.path,
            },
          }}
        />
      );
    };

  return (
    <Route
      { ...rest }
      component={CurrentComponent}
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
