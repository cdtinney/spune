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

import partitionAlbums from './utils/partitionAlbums';
import calculateColumnSize from './utils/calculateColumnSize';
import memoizeWithCache from './utils/memoizeWithCache';

const memoizedCalculateColumnSize =
  memoizeWithCache(calculateColumnSize);

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

  const columnSize = memoizedCalculateColumnSize(
    windowWidth, {
      windowWidth,
      minSize,
      maxSize,
    },
  );
  const numCols = Math.ceil(windowWidth / columnSize);
  const numRows = Math.ceil(windowHeight / columnSize);

  return {
    albums:
      partitionAlbums({
        albums: nowPlayingSelectors.relatedAlbumImagesSelector(state),
        numCols,
        numRows,
      }),
    ui: {
      albumSize: columnSize,
    },
  };
}

const ConnectedComponent = connect(
  mapStateToProps,
  undefined,
)(AlbumGrid);

export default windowSize(ConnectedComponent);
