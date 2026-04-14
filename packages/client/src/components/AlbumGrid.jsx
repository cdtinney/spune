import AlbumImage from './AlbumImage';
import './AlbumGrid.css';

function AlbumColumn({ column }) {
  const { width, tiles, direction, duration } = column;
  const animClass = direction === 'up'
    ? 'album-col--scroll-up'
    : 'album-col--scroll-down';

  return (
    <div
      className={`album-col ${animClass}`}
      style={{
        width: `${width}px`,
        animationDuration: `${duration}s`,
      }}
    >
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className="album-col__tile"
          style={{ width: `${width}px`, height: `${width}px` }}
        >
          <AlbumImage src={tile.imageUrl} alt={tile.title} />
        </div>
      ))}
    </div>
  );
}

export default function AlbumGrid({ columns }) {
  if (!columns || !columns.length) {
    return null;
  }

  return (
    <div className="album-grid-wrapper">
      {columns.map((col, i) => (
        <AlbumColumn key={i} column={col} />
      ))}
    </div>
  );
}
