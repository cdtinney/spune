'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = uniqueSet;
function uniqueSet(...arrs) {
  const combinedArr = arrs.reduce((acc, curr) => acc.concat(curr), []);
  return new Set([...combinedArr]);
}
//# sourceMappingURL=uniqueSet.js.map
