module.exports = function flatten(arr = [], accessorFn) {
  if (!arr.length) {
    return arr;
  }

  return arr.reduce((acc, curr) => {
    return acc.concat(accessorFn ? accessorFn(curr) : curr);
  }, []);
};
