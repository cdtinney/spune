import React from 'react';
import { mount } from 'enzyme';
import AlbumGrid from '../view';
import AlbumImage from '../components/AlbumImage';

describe('AlbumGrid', () => {
  it('renders when given albums', () => {
    mount(
      <AlbumGrid
        albums={[{
          id: 'fooId_0',
          title: 'foo',
          images: {
            fullSize: 'fooFullSize',
            thumbnail: 'fooThumbnail',
          },
        }]}
        ui={{
          albumImageSize: 80,
        }}
      />
    );
  });

  it('renders null when given an empty albums array', () => {
    const wrapper =  mount(
      <AlbumGrid
        albums={[]}
        albumImageSize={80}
      />
    );

    expect(wrapper.html()).toEqual(null);
  });
});
