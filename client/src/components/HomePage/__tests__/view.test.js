import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from '../view';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    user: {
      loading: false,      
    },
    nowPlaying: {},
    onLoad: () => {},
  };
  ReactDOM.render(<HomePage {...props} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
