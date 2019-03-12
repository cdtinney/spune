export default function calculateColumnSize({
  windowWidth,
  minSize,
  maxSize,
}) {
  if (windowWidth === 0) {
    return 0;
  }

  for (let i = maxSize; i >= minSize; i--) {
    if (windowWidth % i === 0) {
      return i;
    }
  }

  return minSize;
}
