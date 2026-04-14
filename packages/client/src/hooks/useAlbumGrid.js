import { useMemo } from 'react';
import shuffle from '../utils/shuffle';

const BASE = 80;
const SPANS = [1, 2, 3, 4];
const SPAN_WEIGHTS = [35, 35, 20, 10];
const BAND_ROWS = 4;
const BAND_HEIGHT = BAND_ROWS * BASE;

function pickSpan(index) {
  const roll = ((index * 13 + 7) * 37) % 100;
  let cumulative = 0;
  for (let i = 0; i < SPANS.length; i++) {
    cumulative += SPAN_WEIGHTS[i];
    if (roll < cumulative) return SPANS[i];
  }
  return 1;
}

export default function useAlbumGrid(relatedAlbums, windowSize) {
  return useMemo(() => {
    const { width, height } = windowSize;
    const { byAlbumId, allAlbumIds } = relatedAlbums;

    if (allAlbumIds.length === 0) {
      return { bands: [], base: BASE, bandRows: BAND_ROWS };
    }

    // 2x viewport width — enough for animation without burning too many albums
    const bandCols = Math.ceil((width * 2) / BASE);

    // Pool uses albums in server order first (artist albums come first),
    // then shuffles the full set for any remaining/repeating tiles.
    let pool = [...allAlbumIds].reverse(); // reverse so pop() gives first items first
    const usedSet = new Set();

    function nextAlbum() {
      while (pool.length > 0) {
        const id = pool.pop();
        if (!usedSet.has(id)) {
          usedSet.add(id);
          return byAlbumId[id];
        }
      }
      // Exhausted — reshuffle for repeats
      usedSet.clear();
      pool = shuffle(allAlbumIds);
      const id = pool.pop();
      usedSet.add(id);
      return byAlbumId[id];
    }

    const bands = [];
    let y = 0;
    let bandIndex = 0;
    let tileIndex = 0;

    while (y < height + BAND_HEIGHT) {
      // Estimate: band grid cells / weighted-average tile area
      // Weighted avg: 0.35*1 + 0.35*4 + 0.20*9 + 0.10*16 = 4.15
      const bandCells = BAND_ROWS * bandCols;
      const estTiles = Math.ceil(bandCells / 4.5);

      const tiles = [];
      let prevSpan = 0;
      for (let t = 0; t < estTiles; t++) {
        const album = nextAlbum();
        let span = pickSpan(tileIndex);
        if (span > BAND_ROWS) span = BAND_ROWS;
        if (span >= 3 && prevSpan >= 3) span = 1;
        prevSpan = span;
        tileIndex++;

        tiles.push({
          id: `${album.id}_b${bandIndex}_t${t}`,
          title: album.name,
          span,
          imageUrl: (album.images[1] || album.images[0])?.url,
        });
      }

      const direction = bandIndex % 2 === 0 ? 'left' : 'right';
      const duration = 70 + (bandIndex % 4) * 15;

      bands.push({ tiles, direction, duration, cols: bandCols });
      y += BAND_HEIGHT;
      bandIndex++;
    }

    return { bands, base: BASE, bandRows: BAND_ROWS };
  }, [relatedAlbums, windowSize]);
}
