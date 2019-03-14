import * as uiSelectors from '../uiSelectors';

describe('uiSelectors', () => {
  describe('uiAlbumGridSelector()', () => {
    it('returns state.ui.albumGrid', () => {
      expect(uiSelectors.uiAlbumGridSelector({
        ui: {
          albumGrid: 'foo',
        },
      })).toEqual('foo');
    });
  });

  describe('uiAlbumGridImageSizeSelector()', () => {
    it('returns the largest evenly divisible column size within min and max size', () => {
      const resultFunc =
        uiSelectors.uiAlbumGridImageSizeSelector.resultFunc;
      expect(resultFunc({
        minSize: 80,
        maxSize: 151,
      }, {
        width: 1000,
      })).toEqual(125);
    });
  });

  describe('uiAlbumGridNumAlbumsSelector()', () => {
    it('returns the number of rows and cols required to fill the window', () => {
      const resultFunc =
        uiSelectors.uiAlbumGridNumAlbumsSelector.resultFunc;
      expect(resultFunc(125, {
        width: 1000,
        height: 1000,
      })).toEqual(64); // 8 rows * 8 cols
    });
  });
});
