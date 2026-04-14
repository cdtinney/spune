import AlbumImage from './AlbumImage';
import './AlbumGrid.css';

function AlbumRow({ row }) {
  const { height, tiles, direction, duration } = row;
  const animationClass = direction === 'left'
    ? 'album-row--pan-left'
    : 'album-row--pan-right';

  return (
    <div
      className={`album-row ${animationClass}`}
      style={{
        height: `${height}px`,
        animationDuration: `${duration}s`,
      }}
    >
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className="album-row__tile"
          style={{ width: `${height}px`, height: `${height}px` }}
        >
          <AlbumImage src={tile.imageUrl} alt={tile.title} />
        </div>
      ))}
    </div>
  );
}

export default function AlbumGrid({ rows }) {
  if (!rows || !rows.length) {
    return null;
  }

  return (
    <div className="album-grid-wrapper">
      {rows.map((row, i) => (
        <AlbumRow key={i} row={row} />
      ))}
    </div>
  );
}
