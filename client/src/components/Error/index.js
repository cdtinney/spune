///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';

/**
 * Displays an error message injected by `react-router`.
 */
export default class Error extends Component {
  render() {
    // Injected by react-router.
    const {
      match: {
        params: {
          errorMsg,
        },
      },
    } = this.props;
    
    return (
      <div>
        <h2>Oops! Something bad happened.</h2>
        <p>{ errorMsg }</p>
      </div>
    );
  }
}