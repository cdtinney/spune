///////////////////////////
// External dependencies //
///////////////////////////

import { connect } from 'react-redux';

//////////////////////////
// Internal dependencies//
//////////////////////////

import AlbumGrid from './view';

function mapStateToProps(state) {
  const {
    spotify: {
      nowPlaying: {
        relatedAlbums: {
          byArtist,
        }
      },
    },
  } = state;

  return {
    albums: Object.values(byArtist)
      // Flatten the array first
      .reduce((acc, curr) => {
        return acc.concat(curr.albums);
      }, []).map(album => ({
        title: album.name,
        images: {
          fullSize: album.images[0].url,
          thumbnail: album.images[album.images.length - 1].url,
        },
      })),
  };
}

export default connect(
  mapStateToProps,
  undefined,
)(AlbumGrid);
