import { useMemo } from 'react';

// Column widths — varying widths create the mosaic look
const COL_WIDTHS = [100, 140, 180, 120, 200, 100, 160, 140, 180, 120, 160, 200, 100, 140, 180];

export default function useAlbumGrid(relatedAlbums, windowSize) {
  return useMemo(() => {
    const { height } = windowSize;
    const { byAlbumId, allAlbumIds } = relatedAlbums;

    if (allAlbumIds.length === 0) {
      return { columns: [] };
    }

    // Build columns to fill viewport width, cycling through COL_WIDTHS
    const columns = [];
    let totalWidth = 0;
    let colIndex = 0;
    // Global album index — cycles through all albums without adjacent dupes
    let albumCursor = 0;

    while (totalWidth < windowSize.width + 400) {
      const colWidth = COL_WIDTHS[colIndex % COL_WIDTHS.length];
      // Each column needs enough tiles to fill ~2.5x viewport height
      // (for scroll animation headroom). Tiles are square: width = height.
      const tilesNeeded = Math.ceil((height * 2.5) / colWidth);

      const tiles = [];
      for (let t = 0; t < tilesNeeded; t++) {
        const id = allAlbumIds[albumCursor % allAlbumIds.length];
        const album = byAlbumId[id];
        tiles.push({
          id: `${album.id}_c${colIndex}_t${t}`,
          title: album.name,
          imageUrl: (album.images[1] || album.images[0])?.url,
        });
        albumCursor++;
      }

      // Alternate scroll direction per column
      const direction = colIndex % 2 === 0 ? 'up' : 'down';
      // Vary speed — larger columns scroll slower
      const duration = 40 + colWidth / 3 + (colIndex % 3) * 10;

      columns.push({ width: colWidth, tiles, direction, duration });
      totalWidth += colWidth;
      colIndex++;
    }

    return { columns };
  }, [relatedAlbums, windowSize]);
}
