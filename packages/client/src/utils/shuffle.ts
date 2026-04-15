function getRandomInt(min: number, max: number): number {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}

export default function shuffle<T>(arr: T[]): T[] {
  const arrCopy = arr.slice(0);
  for (let i = arr.length - 1; i > 0; i--) {
    const swapIndex = getRandomInt(0, i);
    const temp = arrCopy[i];
    arrCopy[i] = arrCopy[swapIndex];
    arrCopy[swapIndex] = temp;
  }
  return arrCopy;
}
