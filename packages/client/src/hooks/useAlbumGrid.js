import { useMemo } from 'react';
import shuffle from '../utils/shuffle';

// 5 tile height tiers
const SIZES = [80, 120, 160, 200, 260];
// Weights control how often each size is picked for a row
const WEIGHTS = [30, 30, 20, 12, 8];

function pickRowHeight(index) {
  const roll = ((index * 7 + 13) * 31) % 100;
  let cumulative = 0;
  for (let i = 0; i < SIZES.length; i++) {
    cumulative += WEIGHTS[i];
    if (roll < cumulative) return SIZES[i];
  }
  return SIZES[0];
}

export default function useAlbumGrid(relatedAlbums, windowSize) {
  return useMemo(() => {
    const { width, height } = windowSize;
    const { byAlbumId, allAlbumIds } = relatedAlbums;

    if (allAlbumIds.length === 0) {
      return { rows: [] };
    }

    const shuffledIds = shuffle(allAlbumIds);
    let albumIndex = 0;

    const rows = [];
    let y = 0;
    let rowIndex = 0;

    while (y < height + 300) { // overshoot to avoid gaps
      const rowHeight = pickRowHeight(rowIndex);
      // Each row is ~2.5x viewport width to allow panning
      const rowWidth = width * 2.5;
      const tilesInRow = Math.ceil(rowWidth / rowHeight);

      const tiles = [];
      for (let t = 0; t < tilesInRow; t++) {
        const id = shuffledIds[albumIndex % shuffledIds.length];
        const album = byAlbumId[id];
        tiles.push({
          id: `${album.id}_r${rowIndex}_t${t}`,
          title: album.name,
          imageUrl: (album.images[1] || album.images[0])?.url,
        });
        albumIndex++;
      }

      // Alternate direction: even rows go left, odd rows go right
      const direction = rowIndex % 2 === 0 ? 'left' : 'right';
      // Vary speed slightly per row
      const duration = 60 + (rowIndex % 5) * 15;

      rows.push({ height: rowHeight, tiles, direction, duration });
      y += rowHeight;
      rowIndex++;
    }

    return { rows };
  }, [relatedAlbums, windowSize]);
}
