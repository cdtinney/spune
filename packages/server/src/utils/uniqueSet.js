module.exports = function uniqueSet(...arrs) {
  const combinedArr = arrs.reduce((acc, curr) => acc.concat(curr), []);
  return new Set([...combinedArr]);
};
