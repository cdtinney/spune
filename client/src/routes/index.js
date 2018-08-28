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
import User from '../components/User/container';
import Error from '../components/Error';

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/user/:accessToken/:refreshToken" component={User} />
        <Route path="/error/:errorMsg" component={Error} />
      </Switch>
    </App>
  );
}
