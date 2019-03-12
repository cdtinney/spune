import React from 'react';
import { mount } from 'enzyme';
import AlbumImage from '../';

describe('AlbumImage', () => {
  it('renders an image when given a valid src url', () => {
    mount(
      <AlbumImage
        src='https://via.placeholder.com/150'
        thumbnail='https://via.placeholder.com/150'
        height={100}
        width={100}
      />
    );
  });
});
