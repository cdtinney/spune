import * as actions from '../ui';

describe('ui actions', () => {
  describe('setFullscreen()', () => {
    it('should create an action to set fullscreen', () => {
      expect(actions.setFullscreen(true)).toEqual({
        type: actions.types.SET_FULLSCREEN,
        payload: {
          fullscreen: true,
        },
      });
    });
  });
});
