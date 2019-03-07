///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';

/**
 * Displays an error message based on route parameters.
 */
export default class ErrorPage extends Component {
  render() {
    // Injected by react-router.
    const {
      match: {
        params: {
          errorMsg = "Unknown error",
        } = {},
      } = {},
    } = this.props;

    return (
      <div>
        <h2>Oops! Something bad happened.</h2>
        <p>{ errorMsg }</p>
      </div>
    );
  }
}
