////////////////////////////
// External dependencies  //
////////////////////////////

import { createSelector } from 'reselect';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import calculateColumnSize from '../utils/calculateColumnSize';
import memoizeWithCache from '../utils/memoizeWithCache';
import * as browserSelectors from './browserSelectors';

const memoizedCalculateColumnSize =
  memoizeWithCache(
    args => args.windowWidth,
    calculateColumnSize,
  );

export function uiAlbumGridSelector(state) {
  return state.ui.albumGrid;
}

export const uiAlbumGridImageSizeSelector =
  createSelector(
    uiAlbumGridSelector,
    browserSelectors.browserResolutionSelector,
    (albumGrid, resolution) => {
      const {
        width: windowWidth,
      } = resolution;

      const {
        minSize,
        maxSize,
      } = albumGrid;

      return memoizedCalculateColumnSize({
        windowWidth,
        minSize,
        maxSize,
      });
    },
  );

export const uiAlbumGridNumAlbumsSelector =
  createSelector(
    uiAlbumGridImageSizeSelector,
    browserSelectors.browserResolutionSelector,
    (imageSize, resolution) => {
      const {
        width, height
      } = resolution;
      // Rounding up ensures that there will be enough albums
      // to cover the entire screen.
      const numCols = Math.ceil(width / imageSize);
      const numRows = Math.ceil(height / imageSize);
      return numCols * numRows;
    },
  );
