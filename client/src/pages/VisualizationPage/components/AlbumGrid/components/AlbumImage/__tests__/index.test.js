import React from 'react';
import { mount } from 'enzyme';
import AlbumImage from '../';

describe('AlbumImage', () => {
  it('renders', () => {
    mount(
      <AlbumImage
        src='https://via.placeholder.com/150'
        height={100}
        width={100}
      />
    );
  });
});
