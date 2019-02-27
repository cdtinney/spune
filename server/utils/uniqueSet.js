module.exports = function uniqueSet(...arrs) {
  const combinedArr = arrs.reduce((acc, curr) => {
    return acc.concat(curr);
  }, []);
  return new Set([...combinedArr]);
};
