///////////////////////////
// External dependencies //
///////////////////////////

import { connect } from 'react-redux';

//////////////////////////
// Internal dependencies//
//////////////////////////

import * as nowPlayingSelectors from
  '../../../../selectors/nowPlayingSelectors';
import AlbumGrid from './view';

function mapStateToProps(state) {
  return {
    albums:
      nowPlayingSelectors.relatedAlbumImagesSelector(state),
  };
}

export default connect(
  mapStateToProps,
  undefined,
)(AlbumGrid);
