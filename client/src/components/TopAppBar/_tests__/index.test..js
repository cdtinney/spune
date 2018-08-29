import React from 'react';
import ReactDOM from 'react-dom';
import TopAppBar from '../TopAppBar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TopAppBar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
