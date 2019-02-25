import * as uiActions from '../ui';

describe('ui actions', () => {
  describe('setFullscreen', () => {
    it('should create an action to set fullscreen', () => {
      expect(uiActions.setFullscreen(true)).toEqual({
        type: uiActions.SET_FULLSCREEN,
        payload: {
          fullscreen: true,
        },
      });
    });
  });
});
