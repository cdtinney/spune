import shuffle from '../shuffle';

describe('shuffle()', () => {
  it('returns an array with the same elements', () => {
    const arr = [ 'foo', 'bar', 'baz' ];
    const result = shuffle(arr);
    result.forEach(entry => expect(arr.indexOf(entry) !== -1));
  });
});
