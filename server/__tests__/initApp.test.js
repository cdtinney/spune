const initApp = require('../initApp');

describe('initApp', () => {
  it('returns a function', () => {
    expect(initApp()).toBeInstanceOf(Function)
  });
});
