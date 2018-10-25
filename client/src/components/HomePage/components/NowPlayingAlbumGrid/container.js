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
    nowPlaying: {
      relatedAlbums,
    },
  } = state;

  return {
    albums: relatedAlbums.map(album => ({
      title: album.name,
      imageUrl: album.images[0].url,
    })),
  };
}

export default connect(
  mapStateToProps,
  undefined,
)(AlbumGrid);
