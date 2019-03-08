function getRandomInt(min, max) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  // Min and max are both inclusive
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}

export default function shuffle(arr) {
  const arrCopy = arr.slice(0);
  for (let i = arr.length - 1; i > 0; i--) {
    const swapIndex = getRandomInt(0, i);
    const temp = arrCopy[i];
    arrCopy[i] = arrCopy[swapIndex];
    arrCopy[swapIndex] = temp;
  }
  return arrCopy;
}
