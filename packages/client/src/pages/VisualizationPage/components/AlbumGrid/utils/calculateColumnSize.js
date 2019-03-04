export default function calculateColumnSize({
  windowWidth,
  minSize,
  maxSize,
}) {
  for (let i = maxSize; i >= minSize; i--) {
    if (windowWidth % i === 0) {
      return i;
    }
  }

  return minSize;
}
