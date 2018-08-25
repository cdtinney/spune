//////////////////////////
// External dependencies//
//////////////////////////

import React, { Component } from 'react';

//////////////////////////
// Internal dependencies//
//////////////////////////

import './App.css';

class App extends Component {
  render() {
    // Children components are injected via react-router.
    const { children } = this.props;

    return (
      <div className="app">
        <div className="app__content">
          { children }
        </div>
      </div>
    );
  }
}

export default App;
