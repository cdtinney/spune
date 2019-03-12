///////////////////////////
// External dependencies //
///////////////////////////

import { connect } from 'react-redux';
import windowSize from 'react-window-size';

//////////////////////////
// Internal dependencies//
//////////////////////////

import * as nowPlayingSelectors from
  '../../../../selectors/nowPlayingSelectors';
  import * as uiSelectors from
    '../../../../selectors/uiSelectors';
import AlbumGrid from './view';

function mapStateToProps(state) {
  return {
    albums: nowPlayingSelectors.relatedAlbumImagesSelector(state),
    ui: {
      albumImageSize: uiSelectors.uiAlbumGridImageSizeSelector(state),
    },
  };
}

const ConnectedComponent = connect(
  mapStateToProps,
  undefined,
)(AlbumGrid);

export default windowSize(ConnectedComponent);
