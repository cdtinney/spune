///////////////////////////
// External dependencies //
///////////////////////////

import { connect } from 'react-redux';

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
    albumImageSize: uiSelectors.uiAlbumGridImageSizeSelector(state),
  };
}

export default connect(
  mapStateToProps,
  undefined,
)(AlbumGrid);
