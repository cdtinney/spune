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
        <header className="app__header">
          <h1 className="app__header__title">
            szune
          </h1>
        </header>
        <div className="app__content">
          { children }
        </div>
      </div>
    );
  }
}

export default App;
