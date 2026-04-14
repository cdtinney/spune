import { useMemo } from 'react';
import shuffle from '../utils/shuffle';

// Row heights — each row is one of these heights.
// Tiles within a row always match the row height (square tiles)
// but adjacent rows have different heights, creating the mosaic look.
const ROW_HEIGHTS = [80, 120, 160, 240, 320];
const ROW_WEIGHTS = [25, 30, 25, 15, 5];

function pickRowHeight(index) {
  const roll = ((index * 7 + 13) * 31) % 100;
  let cumulative = 0;
  for (let i = 0; i < ROW_HEIGHTS.length; i++) {
    cumulative += ROW_WEIGHTS[i];
    if (roll < cumulative) return ROW_HEIGHTS[i];
  }
  return ROW_HEIGHTS[0];
}

export default function useAlbumGrid(relatedAlbums, windowSize) {
  return useMemo(() => {
    const { width, height } = windowSize;
    const { byAlbumId, allAlbumIds } = relatedAlbums;

    if (allAlbumIds.length === 0) {
      return { rows: [] };
    }

    // Build a pool that avoids repeats until exhausted
    let pool = shuffle(allAlbumIds);
    const usedSet = new Set();

    function nextAlbum() {
      // Try to find an unused album first
      while (pool.length > 0) {
        const id = pool.pop();
        if (!usedSet.has(id)) {
          usedSet.add(id);
          return byAlbumId[id];
        }
      }
      // All albums used — reset and reshuffle
      usedSet.clear();
      pool = shuffle(allAlbumIds);
      const id = pool.pop();
      usedSet.add(id);
      return byAlbumId[id];
    }

    const rows = [];
    let y = 0;
    let rowIndex = 0;
    let prevHeight = 0;

    while (y < height + 400) {
      let rowHeight = pickRowHeight(rowIndex);
      // Avoid two consecutive rows of the same large height
      if (rowHeight >= 240 && prevHeight >= 240) {
        rowHeight = 120;
      }
      prevHeight = rowHeight;

      // Each row is ~3x viewport width for animation headroom
      const rowWidth = width * 3;
      const tilesInRow = Math.ceil(rowWidth / rowHeight);

      const tiles = [];
      for (let t = 0; t < tilesInRow; t++) {
        const album = nextAlbum();
        tiles.push({
          id: `${album.id}_r${rowIndex}_t${t}`,
          title: album.name,
          imageUrl: (album.images[1] || album.images[0])?.url,
        });
      }

      const direction = rowIndex % 2 === 0 ? 'left' : 'right';
      // Slower for larger rows, faster for smaller — feels more natural
      const duration = 50 + rowHeight / 4 + (rowIndex % 3) * 10;

      rows.push({ height: rowHeight, tiles, direction, duration });
      y += rowHeight;
      rowIndex++;
    }

    return { rows };
  }, [relatedAlbums, windowSize]);
}
