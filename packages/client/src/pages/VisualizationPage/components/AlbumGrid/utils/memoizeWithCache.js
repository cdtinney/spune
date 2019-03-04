export default function memoizeWithCache(
  paramSelector,
  resultFunc,
) {
  const paramResultCache = {};

  return function memoizeWithCacheInner() {
    const param = paramSelector(...arguments);
    const cacheVal = paramResultCache[param];
    if (cacheVal) {
      return cacheVal;
    }

    const result =
      resultFunc.apply(null, arguments);
    paramResultCache[param] = result;
    return result;
  };
}
