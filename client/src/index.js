//////////////////////////
// External dependencies//
//////////////////////////

import React from 'react';
import ReactDOM from 'react-dom';

//////////////////////////
// Internal dependencies//
//////////////////////////

import './index.css';
import App from './App/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
