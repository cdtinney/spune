import './SongCard.css';

export default function SongCard({ artistName, songTitle, albumName, albumImageUrl }) {
  return (
    <div className="song-card">
      <div
        className="song-card__cover"
        style={{ backgroundImage: `url(${albumImageUrl})` }}
        title={albumName}
      />
      <div className="song-card__details">
        <div className="song-card__text song-card__artist">
          {artistName.toUpperCase()}
        </div>
        <div className="song-card__text song-card__album">
          {albumName.toUpperCase()}
        </div>
        <div className="song-card__text song-card__title">
          {songTitle}
        </div>
      </div>
    </div>
  );
}
