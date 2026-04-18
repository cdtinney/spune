import { useMemo } from 'react';
import type { RelatedAlbums, WindowSize, Album, AlbumGridResult } from '../types';

const TILE_SIZE_PX = 100;
const TILE_SIZE_MOBILE_PX = 70;
const MOBILE_BREAKPOINT = 600;
const OVERSCAN_MULTIPLIER = 1.6;
const OVERSCAN_EXTRA_BLOCKS = 1;

interface TemplateSlot {
  col: number;
  row: number;
  span: number;
}

// Three alternating 6x6 templates with 1x1, 2x2, and 3x3 tiles.
// Each template covers every cell in the 6x6 grid with no gaps.
// Templates alternate in a checkerboard pattern to reduce visual repetition.

// Template A: 3x3 in top-left, 2x2 scattered
const TEMPLATE_A: TemplateSlot[] = [
  { col: 0, row: 0, span: 3 },
  { col: 3, row: 0, span: 2 },
  { col: 5, row: 0, span: 1 },
  { col: 5, row: 1, span: 1 },
  { col: 3, row: 2, span: 1 },
  { col: 4, row: 2, span: 2 },
  { col: 0, row: 3, span: 2 },
  { col: 2, row: 3, span: 2 },
  { col: 4, row: 3, span: 1 },
  { col: 5, row: 3, span: 1 },
  { col: 0, row: 4, span: 1 },
  { col: 1, row: 4, span: 1 },
  { col: 2, row: 4, span: 2 },
  { col: 4, row: 4, span: 2 },
  { col: 0, row: 5, span: 2 },
  { col: 2, row: 5, span: 1 },
  { col: 3, row: 5, span: 1 },
];

// Template B: 3x3 in bottom-right
const TEMPLATE_B: TemplateSlot[] = [
  { col: 0, row: 0, span: 2 },
  { col: 2, row: 0, span: 1 },
  { col: 3, row: 0, span: 1 },
  { col: 4, row: 0, span: 2 },
  { col: 2, row: 1, span: 2 },
  { col: 0, row: 2, span: 1 },
  { col: 1, row: 2, span: 1 },
  { col: 2, row: 2, span: 1 },
  { col: 4, row: 2, span: 1 },
  { col: 5, row: 2, span: 1 },
  { col: 0, row: 3, span: 2 },
  { col: 2, row: 3, span: 1 },
  { col: 3, row: 3, span: 3 },
  { col: 0, row: 4, span: 1 },
  { col: 1, row: 4, span: 2 },
  { col: 0, row: 5, span: 1 },
  { col: 1, row: 5, span: 1 },
  { col: 2, row: 5, span: 1 },
];

// Template C: 3x3 offset center, small tiles on edges
const TEMPLATE_C: TemplateSlot[] = [
  { col: 0, row: 0, span: 1 },
  { col: 1, row: 0, span: 2 },
  { col: 3, row: 0, span: 1 },
  { col: 4, row: 0, span: 2 },
  { col: 0, row: 1, span: 1 },
  { col: 3, row: 1, span: 1 },
  { col: 0, row: 2, span: 2 },
  { col: 2, row: 2, span: 1 },
  { col: 3, row: 2, span: 3 },
  { col: 2, row: 3, span: 1 },
  { col: 0, row: 3, span: 1 },
  { col: 1, row: 3, span: 1 },
  { col: 0, row: 4, span: 2 },
  { col: 2, row: 4, span: 2 },
  { col: 4, row: 4, span: 1 },
  { col: 5, row: 4, span: 1 },
  { col: 4, row: 5, span: 2 },
  { col: 0, row: 5, span: 1 },
  { col: 1, row: 5, span: 1 },
  { col: 2, row: 5, span: 1 },
  { col: 3, row: 5, span: 1 },
];

const TEMPLATES = [TEMPLATE_A, TEMPLATE_B, TEMPLATE_C];
const TEMPLATE_SIZE = 6;

export default function useAlbumGrid(
  relatedAlbums: RelatedAlbums,
  windowSize: WindowSize,
): AlbumGridResult {
  return useMemo(() => {
    const { width, height } = windowSize;
    const { byAlbumId, allAlbumIds } = relatedAlbums;
    const tileSize = width <= MOBILE_BREAKPOINT ? TILE_SIZE_MOBILE_PX : TILE_SIZE_PX;

    if (allAlbumIds.length === 0) {
      return { tiles: [], gridCols: 0, gridRows: 0, tileSize };
    }

    const blockSize = TEMPLATE_SIZE * tileSize;
    const repsX = Math.ceil((width * OVERSCAN_MULTIPLIER) / blockSize) + OVERSCAN_EXTRA_BLOCKS;
    const repsY = Math.ceil((height * OVERSCAN_MULTIPLIER) / blockSize) + OVERSCAN_EXTRA_BLOCKS;

    let albumCursor = 0;
    const tiles: Album[] = [];

    for (let ry = 0; ry < repsY; ry++) {
      for (let rx = 0; rx < repsX; rx++) {
        const offsetX = rx * TEMPLATE_SIZE;
        const offsetY = ry * TEMPLATE_SIZE;
        // Alternate templates in a checkerboard pattern
        const templateIndex = (rx + ry) % TEMPLATES.length;
        const template = TEMPLATES[templateIndex];

        for (const slot of template) {
          const id = allAlbumIds[albumCursor % allAlbumIds.length];
          const album = byAlbumId[id];
          albumCursor++;

          tiles.push({
            id: `tile_${rx}_${ry}_${slot.col}_${slot.row}`,
            title: album.name,
            imageUrl: (album.images[1] || album.images[0])?.url,
            col: offsetX + slot.col + 1,
            row: offsetY + slot.row + 1,
            span: slot.span,
          });
        }
      }
    }

    return {
      tiles,
      gridCols: repsX * TEMPLATE_SIZE,
      gridRows: repsY * TEMPLATE_SIZE,
      tileSize,
    };
  }, [relatedAlbums, windowSize]);
}
