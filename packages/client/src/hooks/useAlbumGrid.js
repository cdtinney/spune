import { useMemo } from 'react';
import calculateColumnSize from '../utils/calculateColumnSize';
import shuffle from '../utils/shuffle';

const MIN_SIZE = 80;
const MAX_SIZE = 151;

export default function useAlbumGrid(relatedAlbums, windowSize) {
  return useMemo(() => {
    const { width, height } = windowSize;
    const { byAlbumId, allAlbumIds } = relatedAlbums;

    const imageSize = calculateColumnSize({
      windowWidth: width,
      minSize: MIN_SIZE,
      maxSize: MAX_SIZE,
    });

    if (imageSize === 0 || allAlbumIds.length === 0) {
      return { albums: [], imageSize };
    }

    const numCols = Math.ceil(width / imageSize);
    const numRows = Math.ceil(height / imageSize);
    const numAlbums = numCols * numRows;

    const shuffledIds = shuffle(allAlbumIds);
    const displayedIds = shuffledIds.slice(0, numAlbums);

    const albums = displayedIds.map((id, index) => {
      const album = byAlbumId[id];
      return {
        id: `${album.id}_${index}`,
        title: album.name,
        images: {
          fullSize: album.images[1].url,
          thumbnail: album.images[album.images.length - 1].url,
        },
      };
    });

    return { albums, imageSize };
  }, [relatedAlbums, windowSize]);
}
