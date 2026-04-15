import './SongCard.css';

interface SongCardProps {
  artistName: string;
  songTitle: string;
  albumName: string;
  albumImageUrl: string | undefined;
  dominantColor?: string | null;
}

export default function SongCard({
  artistName,
  songTitle,
  albumName,
  albumImageUrl,
  dominantColor,
}: SongCardProps) {
  const coverStyle = {
    backgroundImage: `url("${albumImageUrl}")`,
    boxShadow: dominantColor
      ? `0 0 40px 10px ${dominantColor}, 0 6px 10px 0 rgba(0,0,0,.14)`
      : undefined,
  };

  return (
    <div className="song-card">
      <div className="song-card__cover" style={coverStyle} title={albumName} />
      <div className="song-card__details">
        <div className="song-card__text song-card__artist">{artistName.toUpperCase()}</div>
        <div className="song-card__text song-card__album">{albumName.toUpperCase()}</div>
        <div className="song-card__text song-card__title">{songTitle}</div>
      </div>
    </div>
  );
}
