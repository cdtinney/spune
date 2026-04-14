import AlbumImage from './AlbumImage';
import './AlbumGrid.css';

export default function AlbumGrid({ albums, baseUnit, cols }) {
  if (!albums.length) {
    return null;
  }

  return (
    <div className="album-grid-wrapper">
      <div
        className="album-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${baseUnit}px)`,
          gridAutoRows: `${baseUnit}px`,
        }}
      >
        {albums.map((album) => (
          <div
            key={album.id}
            className="album-grid__tile"
            style={{
              gridColumn: `span ${album.span}`,
              gridRow: `span ${album.span}`,
            }}
          >
            <AlbumImage
              src={album.imageUrl}
              alt={album.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
