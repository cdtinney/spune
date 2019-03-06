import flatten from '../flatten';

describe('flatten()', () => {
  it('returns an empty array when undefined is given', () => {
    expect(flatten()).toEqual([]);
  });

  it('returns a flattened array when a non-empty array and no accessor is given', () => {
    const input = [
      [1, 1, 1],
      [2, 2, 2],
      [3, 3, 3],
    ];

    expect(flatten(input)).toEqual([
      1, 1, 1, 2, 2, 2, 3, 3, 3,
    ]);
  });

  it('returns a flattened array when a non-empty array and accessor function is given', () => {
    const input = [{
      foo: [1, 1, 1]
    }, {
      foo: [2, 2, 2]
    }, {
      foo: [3, 3, 3]
    }];

    expect(flatten(input, obj => obj.foo)).toEqual([
      1, 1, 1, 2, 2, 2, 3, 3, 3,
    ]);
  });
})
