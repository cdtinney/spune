///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

///////////////////////////
// Internal dependencies //
///////////////////////////

import HomePage from '../pages/HomePage';
import VisualizationPage from '../pages/VisualizationPage';
import ErrorPage from '../pages/ErrorPage';

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route path="/home" component={HomePage} />
      <Route path="/visualization" component={VisualizationPage} />
      <Route path="/error/:errorMsg" component={ErrorPage} />
    </Switch>
  );
}
