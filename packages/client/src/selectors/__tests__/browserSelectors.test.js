import * as browserSelectors from '../browserSelectors';

describe('browserSelectors', () => {
  describe('browserResolutionSelector()', () => {
    it('returns state.browser.resolution', () => {
      expect(browserSelectors.browserResolutionSelector({
        browser: {
          resolution: 'foo',
        },
      })).toEqual('foo');
    })
  })
})
