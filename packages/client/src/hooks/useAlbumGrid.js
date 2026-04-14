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

    // Cycle through shuffled albums to fill the entire grid,
    // repeating if we don't have enough unique albums.
    const displayedIds = [];
    for (let i = 0; i < numAlbums; i++) {
      displayedIds.push(shuffledIds[i % shuffledIds.length]);
    }

    const albums = displayedIds.map((id, index) => {
      const album = byAlbumId[id];
      return {
        id: `${album.id}_${index}`,
        title: album.name,
        images: {
          fullSize: (album.images[1] || album.images[0])?.url,
          thumbnail: album.images[album.images.length - 1]?.url,
        },
      };
    });

    return { albums, imageSize };
  }, [relatedAlbums, windowSize]);
}
