///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

/**
 * Provides a button for logging in/connecting to
 * the user's Spotify account.
 */
export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <Button variant="contained" href="/api/login">
          Connect to Spotify
        </Button>
      </div>
    );
  }
}
