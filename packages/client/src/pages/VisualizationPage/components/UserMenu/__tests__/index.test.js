import React from 'react';
import ReactDOM from 'react-dom';
import UserMenu from '../';

describe('UserMenu', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <UserMenu
        handlers={{
          onLogout: () => {},
        }}
      />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
