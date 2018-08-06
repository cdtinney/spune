///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';

export default class Error extends Component {
  render() {
    // Injected by react-router.
    const { errorMsg } = this.props.match.params;
    
    return (
      <div className="error">
        <h2>Oops! Something bad happened.</h2>
        <p>{ errorMsg }</p>
      </div>
    );
  }
}