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

  // Indices of tiles that are roughly within the viewport
  const visibleTileIndices = useMemo(() => {
    const maxCol = Math.ceil(window.innerWidth / base) + 2;
    const maxRow = Math.ceil(window.innerHeight / base) + 2;
    return tiles
      .map((tile, index) => ({ tile, index }))
      .filter(({ tile }) => tile.col <= maxCol && tile.row <= maxRow)
      .map(({ index }) => index);
  }, [tiles, base]);

  const flipRandomTile = useCallback(() => {
    if (visibleTileIndices.length === 0 || allImageUrls.length === 0) return;

    // Pick a random visible tile
    const visIdx = Math.floor(Math.random() * visibleTileIndices.length);
    const tileIndex = visibleTileIndices[visIdx];

    // Pick the next image, skip if same as current
    let nextImage = allImageUrls[imagePoolRef.current % allImageUrls.length];
    imagePoolRef.current++;
    if (nextImage === tiles[tileIndex].imageUrl) {
      nextImage = allImageUrls[imagePoolRef.current % allImageUrls.length];
      imagePoolRef.current++;
    }

    setCurrentFlip({ tileIndex, imageUrl: nextImage });
  }, [tiles, allImageUrls, visibleTileIndices]);

  useEffect(() => {
    if (tiles.length === 0) return;

    // First flip after 7 seconds, then every 7-10 seconds
    const firstTimeout = setTimeout(flipRandomTile, 7000);

    const interval = setInterval(
      flipRandomTile,
      7000 + Math.random() * 3000,
    );

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
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
