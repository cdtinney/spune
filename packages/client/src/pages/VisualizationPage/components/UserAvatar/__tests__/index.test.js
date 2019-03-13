import React from 'react';
import ReactDOM from 'react-dom';
import UserAvatar from '../';

describe('UserAvatar', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<UserAvatar title="" alt="" src="" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
