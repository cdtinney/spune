import React from 'react';
import { mount } from 'enzyme';
import AlbumGrid from '../view';
import AlbumImage from '../components/AlbumImage';

describe('AlbumGrid', () => {
  it('renders when given albums', () => {
    mount(
      <AlbumGrid
        albums={[{
          title: 'foo',
          images: {
            fullSize: 'fooFullSize',
            thumbnail: 'fooThumbnail',
          },
        }]}
      />
    );
  });

  it('renders null when given an empty albums array', () => {
    const wrapper =  mount(
      <AlbumGrid
        albums={[]}
      />
    );

    expect(wrapper.html()).toEqual(null);
  });
});
