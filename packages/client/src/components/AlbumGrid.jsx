import AlbumImage from './AlbumImage';
import './AlbumGrid.css';

export default function AlbumGrid({ albums, imageSize }) {
  if (!albums.length) {
    return null;
  }

  return (
    <div
      className="album-grid"
      style={{ gridTemplateColumns: `repeat(auto-fill, ${imageSize}px)` }}
    >
      {albums.map((album) => (
        <AlbumImage
          key={album.id}
          src={album.images.fullSize}
          alt={album.title}
          width={imageSize}
          height={imageSize}
        />
      ))}
    </div>
  );
}
