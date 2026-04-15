import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import FlippableTile from './FlippableTile';
import type { Album } from '../types';
import './AlbumGrid.css';

interface AlbumGridProps {
  tiles: Album[];
  gridCols: number;
  gridRows: number;
  base: number;
}

interface FlipState {
  tileIndex: number;
  imageUrl: string;
}

export default function AlbumGrid({ tiles, gridCols, gridRows, base }: AlbumGridProps) {
  const [currentFlip, setCurrentFlip] = useState<FlipState | null>(null);
  const imagePoolRef = useRef(0);

  const allImageUrls = useMemo(
    () => tiles.map((t) => t.imageUrl).filter((url): url is string => !!url),
    [tiles],
  );

  const flipRandomTile = useCallback(() => {
    if (tiles.length === 0 || allImageUrls.length === 0) return;

    // Pick a random tile
    const tileIndex = Math.floor(Math.random() * tiles.length);
    // Pick the next image from the pool (cycling), skip if it's the same as the tile's current image
    let nextImage = allImageUrls[imagePoolRef.current % allImageUrls.length];
    imagePoolRef.current++;
    if (nextImage === tiles[tileIndex].imageUrl) {
      nextImage = allImageUrls[imagePoolRef.current % allImageUrls.length];
      imagePoolRef.current++;
    }

    setCurrentFlip({ tileIndex, imageUrl: nextImage });
  }, [tiles, allImageUrls]);

  useEffect(() => {
    if (tiles.length === 0) return;

    // First flip after 10 seconds, then every 10-15 seconds
    const firstTimeout = setTimeout(() => {
      flipRandomTile();

      const interval = setInterval(
        () => flipRandomTile(),
        10000 + Math.random() * 5000,
      );

      return () => clearInterval(interval);
    }, 10000);

    return () => clearTimeout(firstTimeout);
  }, [tiles.length, flipRandomTile]);

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
        {tiles.map((tile, index) => (
          <div
            key={tile.id}
            className="album-grid__tile"
            style={{
              gridColumn: `${tile.col} / span ${tile.span}`,
              gridRow: `${tile.row} / span ${tile.span}`,
            }}
          >
            <FlippableTile
              src={tile.imageUrl}
              alt={tile.title}
              flipToSrc={currentFlip?.tileIndex === index ? currentFlip.imageUrl : null}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
