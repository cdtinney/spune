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
import AlbumGrid from './view';

import calculateColumnSize from './utils/calculateColumnSize';
import memoizeWithCache from './utils/memoizeWithCache';

const memoizedCalculateColumnSize =
  memoizeWithCache(
    args => args.windowWidth,
    calculateColumnSize,
  );

function mapStateToProps(state, ownProps) {
  const {
    ui: {
      albums: {
        minSize,
        maxSize,
      },
    },
  } = state;

  const {
    windowWidth,
    windowHeight,
  } = ownProps;

  const albumImageSize = memoizedCalculateColumnSize({
    windowWidth,
    minSize,
    maxSize,
  });

  const numCols = windowWidth / albumImageSize;
  const numRows = windowHeight / albumImageSize;

  return {
    albums: nowPlayingSelectors.relatedAlbumImagesSelector(state)
      .slice(0, numCols * (numRows + 3)),
    ui: {
      albumImageSize,
    },
  };
}

const ConnectedComponent = connect(
  mapStateToProps,
  undefined,
)(AlbumGrid);

export default windowSize(ConnectedComponent);
