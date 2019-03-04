export default function partitionAlbums({
  albums,
  numCols,
}) {
  // We have to copy the original array to avoid mutating it.
  const albumsCopy = albums.slice(0);

  let partitionedArr = [];
  while (albumsCopy.length) {
    partitionedArr.push({
      rowId: albumsCopy.length,
      rowAlbums: albumsCopy.splice(0, numCols),
    });
  }
  return partitionedArr;
}
