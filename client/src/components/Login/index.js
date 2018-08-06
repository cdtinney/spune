///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';

//////////////////////////
// Internal dependencies//
//////////////////////////

import './index.css';

/**
 * Provides a button for logging in/connecting to
 * the user's Spotify account.
 */
export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <a href="/api/login" className="login__link">
          Connect to Spotify
        </a>
      </div>
    );
  }
}