import { useState, useEffect } from 'react';
import './SongCard.css';

const SONG_CARD_FADE_MS = 500;

interface SongCardProps {
  artistName: string;
  songTitle: string;
  albumName: string;
  albumImageUrl: string | undefined;
  dominantColor?: string | null;
  songId: string;
}

export default function SongCard({
  artistName,
  songTitle,
  albumName,
  albumImageUrl,
  dominantColor,
  songId,
}: SongCardProps) {
  const [visible, setVisible] = useState(true);
  const [displayedSong, setDisplayedSong] = useState({
    artistName,
    songTitle,
    albumName,
    albumImageUrl,
    songId,
  });

  useEffect(() => {
    if (songId === displayedSong.songId) return;

    // Fade out
    setVisible(false);

    // After fade-out, update content and fade in
    const timer = setTimeout(() => {
      setDisplayedSong({ artistName, songTitle, albumName, albumImageUrl, songId });
      setVisible(true);
    }, SONG_CARD_FADE_MS);

    return () => clearTimeout(timer);
  }, [songId, artistName, songTitle, albumName, albumImageUrl, displayedSong.songId]);

  const coverStyle = {
    backgroundImage: `url("${displayedSong.albumImageUrl}")`,
    boxShadow: dominantColor
      ? `0 0 4px 1px ${dominantColor}, 0 6px 10px 0 rgba(0,0,0,.14)`
      : undefined,
  };

  return (
    <div
      className={`song-card ${visible ? 'song-card--visible' : 'song-card--hidden'}`}
      data-testid="song-card"
    >
      <div className="song-card__cover" style={coverStyle} title={displayedSong.albumName} />
      <div className="song-card__details">
        <div className="song-card__text song-card__artist" data-testid="song-artist">
          {displayedSong.artistName.toUpperCase()}
        </div>
        <div className="song-card__text song-card__album" data-testid="song-album">
          {displayedSong.albumName.toUpperCase()}
        </div>
        <div className="song-card__text song-card__title" data-testid="song-title">
          {displayedSong.songTitle}
        </div>
      </div>
    </div>
  );
}
