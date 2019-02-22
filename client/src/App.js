//////////////////////////
// External dependencies//
//////////////////////////

import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

//////////////////////////
// Internal dependencies//
//////////////////////////

import './App.css';
import createTheme from './theme/createTheme';

class App extends Component {
  render() {
    // Children components are injected via react-router.
    const { children } = this.props;
    
    return (
      <MuiThemeProvider theme={createTheme()}>
        <div className="app">
          <div className="app__content">
            { children }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
