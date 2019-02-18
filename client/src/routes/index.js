///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import { Switch, Route } from 'react-router';

//////////////////////////
// Internal dependencies//
//////////////////////////

import App from '../App';
import Login from '../components/Login';
import HomePage from '../components/HomePage/container';
import Error from '../components/Error';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/home/" component={HomePage} />
        <Route path="/error/:errorMsg" component={Error} />
      </Switch>
    </App>
  );
}
