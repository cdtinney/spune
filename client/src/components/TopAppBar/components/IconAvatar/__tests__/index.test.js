import React from 'react';
import ReactDOM from 'react-dom';
import IconAvatar from '../';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<IconAvatar alt="" src="" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
