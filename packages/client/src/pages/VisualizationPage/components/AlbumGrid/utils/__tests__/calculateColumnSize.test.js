import calculateColumnSize from '../calculateColumnSize';

describe('calculateColumnSize()', () => {
  it('uses maxSize when it divides evenly into windowWidth', () => {
    expect(calculateColumnSize({
      windowWidth: 1000,
      minSize: 100,
      maxSize: 200,
    })).toEqual(200);
  });

  it('uses minSize when no values between min and max divide evenly', () => {
    expect(calculateColumnSize({
      windowWidth: 1234,
      maxSize: 200,
      minSize: 100,
    })).toEqual(100);
  });

  it('returns 0 when windowWidth is 0', () => {
    expect(calculateColumnSize({
      windowWidth: 0,
      minSize: 80,
      maxSize: 151,
    })).toEqual(0);
  });
});
