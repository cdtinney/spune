import { useMemo } from 'react';
import FlippableTile from './FlippableTile';
import type { Album } from '../types';
import './AlbumGrid.css';

interface AlbumGridProps {
  tiles: Album[];
  gridCols: number;
  gridRows: number;
  base: number;
}

export default function AlbumGrid({ tiles, gridCols, gridRows, base }: AlbumGridProps) {
  // Build a pool of all image URLs for tile flipping
  const allImageUrls = useMemo(
    () => tiles.map((t) => t.imageUrl).filter((url): url is string => !!url),
    [tiles],
  );

  if (!tiles || !tiles.length) {
    return null;
  }

  return (
    <div className="album-grid-viewport">
      <div
        className="album-grid"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, ${base}px)`,
          gridTemplateRows: `repeat(${gridRows}, ${base}px)`,
        }}
      >
        {tiles.map((tile, index) => {
          // ~15% of tiles flip, with staggered intervals (8-20s)
          const shouldFlip = (index * 7 + 3) % 7 === 0;
          const flipInterval = shouldFlip ? 8000 + ((index * 13) % 12) * 1000 : 0;

          return (
            <div
              key={tile.id}
              className="album-grid__tile"
              style={{
                gridColumn: `${tile.col} / span ${tile.span}`,
                gridRow: `${tile.row} / span ${tile.span}`,
              }}
            >
              <FlippableTile
                frontSrc={tile.imageUrl}
                frontAlt={tile.title}
                extraImages={allImageUrls}
                flipInterval={flipInterval}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
