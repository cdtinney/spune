export default function uniqueSet<T>(...arrs: T[][]): Set<T> {
  const combinedArr = arrs.reduce((acc, curr) => acc.concat(curr), []);
  return new Set([...combinedArr]);
}
