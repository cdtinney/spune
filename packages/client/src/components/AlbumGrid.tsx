import AlbumImage from './AlbumImage';
import type { Album } from '../types';
import './AlbumGrid.css';

interface AlbumGridProps {
  tiles: Album[];
  gridCols: number;
  gridRows: number;
  base: number;
}

export default function AlbumGrid({ tiles, gridCols, gridRows, base }: AlbumGridProps) {
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
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className="album-grid__tile"
            style={{
              gridColumn: `${tile.col} / span ${tile.span}`,
              gridRow: `${tile.row} / span ${tile.span}`,
            }}
          >
            <AlbumImage src={tile.imageUrl} alt={tile.title} />
          </div>
        ))}
      </div>
    </div>
  );
}
