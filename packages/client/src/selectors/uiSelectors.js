////////////////////////////
// External dependencies  //
////////////////////////////

import { createSelector } from 'reselect';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import calculateColumnSize from '../utils/calculateColumnSize';
import memoizeWithCache from '../utils/memoizeWithCache';

const memoizedCalculateColumnSize =
  memoizeWithCache(
    args => args.windowWidth,
    calculateColumnSize,
  );

export function uiAlbumGridSelector(state) {
  return state.ui.albumGrid;
}

export function uiWindowSelector(state) {
  return state.ui.window;
}

export const uiAlbumGridImageSizeSelector =
  createSelector(
    uiAlbumGridSelector,
    uiWindowSelector,
    (albumGrid, window) => {
      const {
        width: windowWidth,
      } = window;

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
    uiWindowSelector,
    (imageSize, window) => {
      const {
        width, height
      } = window;
      // Rounding up ensures that there will be enough albums
      // to cover the entire screen.
      const numCols = Math.ceil(width / imageSize);
      const numRows = Math.ceil(height / imageSize);
      return numCols * numRows;
    },
  );
