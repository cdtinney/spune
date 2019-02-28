import React from 'react';
import { mount } from 'enzyme';
import FullscreenButton from '../';

describe('FullscreenButton', () => {
  it('renders', () => {
    mount(
      <FullscreenButton
        onClick={jest.fn()}
      />
    );
  });
});
