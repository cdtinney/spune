import React from 'react';
import { mount } from 'enzyme';
import AlbumGrid from '../view';
import AlbumImage from '../components/AlbumImage';

describe('AlbumGrid', () => {
  it('renders when given albums', () => {
    mount(
      <AlbumGrid
        albums={[{
          rowId: 1,
          rowAlbums: [{
            id: 'fooId_0',
            title: 'foo',
            images: {
              fullSize: 'fooFullSize',
              thumbnail: 'fooThumbnail',
            },
          }],
        }]}
        ui={{
          albumSize: 80,
        }}
      />
    );
  });

  it('renders null when given an empty albums array', () => {
    const wrapper =  mount(
      <AlbumGrid
        albums={[]}
        ui={{
          albumSize: 80,
        }}
      />
    );

    expect(wrapper.html()).toEqual(null);
  });
});
