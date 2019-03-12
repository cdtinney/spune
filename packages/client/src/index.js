///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { whyDidYouUpdate } from 'why-did-you-update';

///////////////////////////
// Internal dependencies //
///////////////////////////

import App from './App';
import configureStore, {
  history,
} from './store/configureStore';
import createTheme from './theme/createTheme';
import './index.css';

if (process.env.NODE_ENV !== 'production') {
  whyDidYouUpdate(React);
}

function Root() {
  return (
    <Provider store={configureStore()}>
      <MuiThemeProvider theme={createTheme()}>
        <App history={history} />
      </MuiThemeProvider>
    </Provider>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));
