import React from 'react';
import ReactDOM from 'react-dom';
import UserAvatar from '../';

describe('UserAvatar', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<UserAvatar displayName="" thumbnailSrc="" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
