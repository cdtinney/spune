import createTheme from '../createTheme';

describe('createTheme()', () => {
  it('returns an object', () => {
    expect(createTheme()).toBeInstanceOf(Object);
  });
});
