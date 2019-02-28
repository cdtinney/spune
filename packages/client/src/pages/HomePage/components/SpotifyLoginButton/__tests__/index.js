import React from 'react';
import { mount } from 'enzyme';
import SpotifyLoginButton from '../';

describe('SpotifyLoginButton', () => {
  it('renders without crashing', () => {
    mount(
      <SpotifyLoginButton
        onClick={jest.fn()}
      />
    );
  });
});
