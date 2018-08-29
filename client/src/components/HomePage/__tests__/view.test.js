import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from '../view';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HomePage loadUser={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
