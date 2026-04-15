import { useMemo } from 'react';
import type { RelatedAlbums, WindowSize, Album, AlbumGridResult } from '../types';

const BASE = 120;

interface TemplateSlot {
  col: number;
  row: number;
  span: number;
}

// Fixed 6x6 tile template -- guaranteed gap-free because every cell is
// explicitly assigned. Mix of 2x2 large tiles and 1x1 small tiles.
// This pattern tiles seamlessly when repeated horizontally and vertically.
const TEMPLATE: TemplateSlot[] = [
  // { col, row, span } -- all tiles are square (span x span)
  { col: 0, row: 0, span: 2 },
  { col: 2, row: 0, span: 1 },
  { col: 3, row: 0, span: 2 },
  { col: 5, row: 0, span: 1 },
  { col: 2, row: 1, span: 1 },
  { col: 5, row: 1, span: 1 },
  { col: 0, row: 2, span: 1 },
  { col: 1, row: 2, span: 2 },
  { col: 3, row: 2, span: 1 },
  { col: 4, row: 2, span: 2 },
  { col: 0, row: 3, span: 1 },
  { col: 3, row: 3, span: 1 },
  { col: 0, row: 4, span: 2 },
  { col: 2, row: 4, span: 1 },
  { col: 3, row: 4, span: 1 },
  { col: 4, row: 4, span: 2 },
  { col: 2, row: 5, span: 1 },
  { col: 3, row: 5, span: 1 },
];
const TEMPLATE_COLS = 6;
const TEMPLATE_ROWS = 6;

export default function useAlbumGrid(
  relatedAlbums: RelatedAlbums,
  windowSize: WindowSize,
): AlbumGridResult {
  return useMemo(() => {
    const { width, height } = windowSize;
    const { byAlbumId, allAlbumIds } = relatedAlbums;

    if (allAlbumIds.length === 0) {
      return { tiles: [], gridCols: 0, gridRows: 0, base: BASE };
    }

    // How many template repetitions to fill ~1.5x viewport in each direction
    // (extra for animation headroom)
    const blockWidth = TEMPLATE_COLS * BASE;
    const blockHeight = TEMPLATE_ROWS * BASE;
    const repsX = Math.ceil((width * 1.5) / blockWidth) + 1;
    const repsY = Math.ceil((height * 1.5) / blockHeight) + 1;

    let albumCursor = 0;
    const tiles: Album[] = [];

    for (let ry = 0; ry < repsY; ry++) {
      for (let rx = 0; rx < repsX; rx++) {
        const offsetX = rx * TEMPLATE_COLS;
        const offsetY = ry * TEMPLATE_ROWS;

        for (const slot of TEMPLATE) {
          const id = allAlbumIds[albumCursor % allAlbumIds.length];
          const album = byAlbumId[id];
          albumCursor++;

          tiles.push({
            id: `${album.id}_${rx}_${ry}_${slot.col}_${slot.row}`,
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
      gridCols: repsX * TEMPLATE_COLS,
      gridRows: repsY * TEMPLATE_ROWS,
      base: BASE,
    };
  }, [relatedAlbums, windowSize]);
}
