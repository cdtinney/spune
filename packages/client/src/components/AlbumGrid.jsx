import AlbumImage from './AlbumImage';
import './AlbumGrid.css';

function AlbumBand({ band, base, bandRows }) {
  const { tiles, direction, duration, cols } = band;
  const animationClass = direction === 'left'
    ? 'album-band--pan-left'
    : 'album-band--pan-right';

  return (
    <div
      className={`album-band ${animationClass}`}
      style={{
        height: `${bandRows * base}px`,
        gridTemplateColumns: `repeat(${cols}, ${base}px)`,
        gridTemplateRows: `repeat(${bandRows}, ${base}px)`,
        animationDuration: `${duration}s`,
      }}
    >
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className="album-band__tile"
          style={{
            gridColumn: `span ${tile.span}`,
            gridRow: `span ${tile.span}`,
          }}
        >
          <AlbumImage src={tile.imageUrl} alt={tile.title} />
        </div>
      ))}
    </div>
  );
}

export default function AlbumGrid({ bands, base, bandRows }) {
  if (!bands || !bands.length) {
    return null;
  }

  return (
    <div className="album-grid-wrapper">
      {bands.map((band, i) => (
        <AlbumBand key={i} band={band} base={base} bandRows={bandRows} />
      ))}
    </div>
  );
}
