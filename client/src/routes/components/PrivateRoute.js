///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';

function RedirectComponent(props) {
  return (
    <Redirect to={{
      pathname: '/',
      state: {
        from: props.path,
      },
    }} />
  );
};

function PrivateRoute(props) {
  const {
    component: AuthenticatedComponent,
    authenticated, 
    ...rest
  } = props;

  const CurrentComponent = authenticated ?
    AuthenticatedComponent :
    RedirectComponent;

  return (
    <Route {...rest} component={CurrentComponent} />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

export default PrivateRoute;
