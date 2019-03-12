import memoizeWithCache from '../memoizeWithCache';

describe('memoizeWithCache()', () => {
  it('calls resultFunc when the param result is not cached', () => {
    const resultFunc = jest.fn().mockImplementation((input) => {
      return input * 2;
    });

    const memoizedFunc = memoizeWithCache(
      input => input,
      resultFunc,
    );

    const result = memoizedFunc(1);
    expect(result).toEqual(2);
    expect(resultFunc).toHaveBeenCalled();
  });

  it('does not call resultFunc when the param result is not cached', () => {
    const resultFunc = jest.fn().mockImplementation((input) => {
      return input * 2;
    });

    const memoizedFunc = memoizeWithCache(
      input => input,
      resultFunc,
    );

    memoizedFunc(1);
    expect(resultFunc).toHaveBeenCalled();
    const result = memoizedFunc(1);
    expect(result).toEqual(2);
    expect(resultFunc.mock.calls.length).toEqual(1);
  });
});
