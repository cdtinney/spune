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

  describe('calculateResponsiveState()', () => {
    it('should create an action to set window state', () => {
      expect(actions.calculateResponsiveState({
        innerWidth: 123,
        innerHeight: 456,
      })).toEqual({
        type: actions.types.CALCULATE_RESPONSIVE_STATE,
        payload: {
          window: {
            width: 123,
            height: 123,
          },
        },
      });
    });
  });
});
