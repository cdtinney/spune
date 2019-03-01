const uniqueSet = require('../uniqueSet');

describe('uniqueSet', () => {
  it('returns an empty Set when no arrays are provided', () => {
    const set = uniqueSet();
    expect(set).toBeInstanceOf(Set);
    expect(set.size).toEqual(0);
  });

  it('combines two arrays with duplicate entries into a set', () => {
    const set = uniqueSet([
      1, 2, 3,
    ], [
      1, 1, 3,
    ]);

    expect(Array.from(set.values())).toEqual([
      1, 2, 3,
    ]);
  });
});
