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

interface FlipEntry {
  url: string;
  key: number;
}

type FlipMap = Record<number, FlipEntry>;

export default function AlbumGrid({ tiles, gridCols, gridRows, base }: AlbumGridProps) {
  const [flipMap, setFlipMap] = useState<FlipMap>({});
  const imagePoolRef = useRef(0);
  const flipCounterRef = useRef(1);
  const prevTileIdsRef = useRef('');

  const allImageUrls = useMemo(
    () => tiles.map((t) => t.imageUrl).filter((url): url is string => !!url),
    [tiles],
  );

  const visibleTileIndices = useMemo(() => {
    const maxCol = Math.ceil(window.innerWidth / base) + 2;
    const maxRow = Math.ceil(window.innerHeight / base) + 2;
    return tiles
      .map((tile, index) => ({ tile, index }))
      .filter(({ tile }) => tile.col <= maxCol && tile.row <= maxRow)
      .map(({ index }) => index);
  }, [tiles, base]);

  // Cascade flip on song change
  useEffect(() => {
    const currentIds = allImageUrls.slice(0, 20).join(',');
    if (currentIds === prevTileIdsRef.current || tiles.length === 0) {
      prevTileIdsRef.current = currentIds;
      return;
    }

    const isFirstLoad = prevTileIdsRef.current === '';
    prevTileIdsRef.current = currentIds;

    if (isFirstLoad) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const shuffled = [...visibleTileIndices].sort(() => Math.random() - 0.5);

    shuffled.forEach((tileIndex, i) => {
      const timer = setTimeout(() => {
        const newImage = tiles[tileIndex]?.imageUrl;
        if (newImage) {
          const key = flipCounterRef.current++;
          setFlipMap((prev) => ({ ...prev, [tileIndex]: { url: newImage, key } }));
        }
      }, i * 50);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [allImageUrls, tiles, visibleTileIndices]);

  // Ambient random flip
  const flipRandomTile = useCallback(() => {
    if (visibleTileIndices.length === 0 || allImageUrls.length === 0) return;

    const visIdx = Math.floor(Math.random() * visibleTileIndices.length);
    const tileIndex = visibleTileIndices[visIdx];

    const visibleImages = new Set(
      visibleTileIndices.map((i) => tiles[i].imageUrl).filter(Boolean),
    );

    let nextImage: string | undefined;
    for (let attempt = 0; attempt < allImageUrls.length; attempt++) {
      const candidate = allImageUrls[imagePoolRef.current % allImageUrls.length];
      imagePoolRef.current++;
      if (!visibleImages.has(candidate)) {
        nextImage = candidate;
        break;
      }
    }

    if (!nextImage) {
      nextImage = allImageUrls[imagePoolRef.current % allImageUrls.length];
      imagePoolRef.current++;
    }

    if (nextImage) {
      const key = flipCounterRef.current++;
      setFlipMap((prev) => ({ ...prev, [tileIndex]: { url: nextImage!, key } }));
    }
  }, [tiles, allImageUrls, visibleTileIndices]);

  useEffect(() => {
    if (tiles.length === 0) return;

    const firstTimeout = setTimeout(flipRandomTile, 7000);
    const interval = setInterval(flipRandomTile, 7000 + Math.random() * 3000);

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
        {tiles.map((tile, index) => {
          const isVisible = visibleTileIndices.includes(index);
          const entranceDelay = isVisible ? index * 15 : 0;
          const flip = flipMap[index];

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
                src={tile.imageUrl}
                alt={tile.title}
                flipToSrc={flip?.url ?? null}
                flipKey={flip?.key ?? 0}
                entranceDelay={entranceDelay}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
