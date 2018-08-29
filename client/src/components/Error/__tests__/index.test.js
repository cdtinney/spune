import React from 'react';
import ReactDOM from 'react-dom';
import Error from '../';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Error />, div);
  ReactDOM.unmountComponentAtNode(div);
});
