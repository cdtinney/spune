export default function memoizeWithCache(
  resultFunc,
) {
  const cache = {};

  return function memoizeWithCacheInner() {
    const inputVal = arguments[0];
    const cacheVal = cache[inputVal];
    if (cacheVal) {
      return cacheVal;
    }

    const result =
      resultFunc.apply(null, [...arguments].slice(1));
    cache[inputVal] = result;
    return result;
  };
}
