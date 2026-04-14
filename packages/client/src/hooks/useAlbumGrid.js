import { useMemo } from 'react';
import shuffle from '../utils/shuffle';

const BASE_UNIT = 80;

// 5 size tiers with grid spans and distribution weights
const SIZE_TIERS = [
  { span: 1, weight: 35 }, // XS: 80px
  { span: 2, weight: 30 }, // S:  160px
  { span: 3, weight: 20 }, // M:  240px
  { span: 4, weight: 10 }, // L:  320px
  { span: 5, weight: 5 },  // XL: 400px
];

function pickSize(index) {
  // Deterministic but varied size assignment based on index
  // Uses the weight distribution to approximate the target ratios
  const roll = ((index * 7 + 13) * 31) % 100;
  let cumulative = 0;
  for (const tier of SIZE_TIERS) {
    cumulative += tier.weight;
    if (roll < cumulative) return tier.span;
  }
  return 1;
}

export default function useAlbumGrid(relatedAlbums, windowSize) {
  return useMemo(() => {
    const { width, height } = windowSize;
    const { byAlbumId, allAlbumIds } = relatedAlbums;

    if (allAlbumIds.length === 0) {
      return { albums: [], baseUnit: BASE_UNIT };
    }

    // Make the grid ~2x wider than viewport for animation headroom
    const gridWidth = width * 2;
    const cols = Math.ceil(gridWidth / BASE_UNIT);
    const rows = Math.ceil(height / BASE_UNIT);
    // Rough estimate of how many tiles we need to fill the area,
    // accounting for variable sizes (average span ~2)
    const avgSpan = 2;
    const numTiles = Math.ceil((cols * rows) / (avgSpan * avgSpan));

    const shuffledIds = shuffle(allAlbumIds);

    const albums = [];
    let prevSpan = 0;
    for (let i = 0; i < numTiles; i++) {
      const albumId = shuffledIds[i % shuffledIds.length];
      const album = byAlbumId[albumId];
      let span = pickSize(i);
      // Avoid placing two large tiles (L/XL) consecutively
      if (span >= 4 && prevSpan >= 4) {
        span = 2;
      }
      prevSpan = span;
      albums.push({
        id: `${album.id}_${i}`,
        title: album.name,
        span,
        imageUrl: (album.images[1] || album.images[0])?.url,
      });
    }

    return { albums, baseUnit: BASE_UNIT, cols };
  }, [relatedAlbums, windowSize]);
}
