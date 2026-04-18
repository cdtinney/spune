import { useState, useCallback, useEffect } from 'react';
import HelpDialog from '../components/HelpDialog';
import { useUser } from '../contexts/UserContext';
import { useSpotify } from '../contexts/SpotifyContext';
import useNowPlayingPoller from '../hooks/useNowPlayingPoller';
import useWindowSize from '../hooks/useWindowSize';
import useAlbumGrid from '../hooks/useAlbumGrid';
import useDominantColor from '../hooks/useDominantColor';
import LoadingScreen from '../components/LoadingScreen';
import CoverOverlay from '../components/CoverOverlay';
import SongCard from '../components/SongCard';
import AlbumGrid from '../components/AlbumGrid';
import UserAvatar from '../components/UserAvatar';
import UserMenu from '../components/UserMenu';
import FullscreenButton from '../components/FullscreenButton';
import ProgressBar from '../components/ProgressBar';
import CastButton from '../cast/sender/CastButton';
import useCastSession from '../cast/sender/useCastSession';
import type { CastMessage } from '../cast/types';
import './VisualizationContent.css';

export default function VisualizationContent() {
  useNowPlayingPoller();
  const { user, logout, login } = useUser();
  const { nowPlaying, relatedAlbums, initialized, error, connectionLost } = useSpotify();
  const castSession = useCastSession();
  const windowSize = useWindowSize();
  const { tiles, gridCols, gridRows, tileSize } = useAlbumGrid(relatedAlbums, windowSize);
  const dominantColor = useDominantColor(nowPlaying?.albumImageUrl);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleChange = (): void => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // Send playback data to Chromecast receiver when casting
  useEffect(() => {
    if (!castSession.connected || !nowPlaying) return;

    const albumImageUrls = relatedAlbums.allAlbumIds
      .map((id) => {
        const album = relatedAlbums.byAlbumId[id];
        return (album?.images[1] || album?.images[0])?.url;
      })
      .filter((url): url is string => !!url);

    const message: CastMessage = {
      type: 'UPDATE_PLAYBACK',
      nowPlaying: {
        songId: nowPlaying.songId,
        songTitle: nowPlaying.songTitle,
        artistName: nowPlaying.artistName,
        albumName: nowPlaying.albumName,
        albumImageUrl: nowPlaying.albumImageUrl,
        progressMs: nowPlaying.progressMs,
        durationMs: nowPlaying.durationMs,
        isPlaying: nowPlaying.isPlaying,
      },
      albumImageUrls,
    };

    castSession.sendMessage(message);
  }, [castSession, nowPlaying, relatedAlbums]);

  const handleFullscreenToggle = useCallback((): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const userName = user?.displayName || user?.spotifyId;
  const photo = user?.photos?.[0];
  const userImageUrl = typeof photo === 'string' ? photo : photo?.url || photo?.value;
  const isInitialLoad = !initialized;
  const isSongPlaying = nowPlaying?.artistName && nowPlaying?.songTitle;
  const hasError = !!error;

  return (
    <div className="visualization">
      {!isInitialLoad && <FullscreenButton onClick={handleFullscreenToggle} />}

      <CoverOverlay dominantColor={dominantColor} />

      {!isInitialLoad && (
        <>
          {!fullscreen && <HelpDialog />}

          <CastButton
            available={castSession.available}
            connected={castSession.connected}
            onConnect={castSession.startCasting}
            onDisconnect={castSession.stopCasting}
          />

          {userName && (
            <div className="visualization__user-container">
              <UserAvatar displayName={userName} thumbnailSrc={userImageUrl} />
              <UserMenu onLogout={logout} />
            </div>
          )}
        </>
      )}

      {!isInitialLoad && isSongPlaying && (
        <SongCard
          songId={nowPlaying.songId}
          artistName={nowPlaying.artistName}
          songTitle={nowPlaying.songTitle}
          albumName={nowPlaying.albumName}
          albumImageUrl={nowPlaying.albumImageUrl}
          dominantColor={dominantColor}
        />
      )}

      <div className="visualization__content">
        {isInitialLoad && <LoadingScreen className="visualization__loading" />}

        {!isInitialLoad && !hasError && !connectionLost && !isSongPlaying && (
          <div className="visualization__empty">
            <p>No song playing. Play something.</p>
          </div>
        )}

        {!isInitialLoad && isSongPlaying && (
          <AlbumGrid tiles={tiles} gridCols={gridCols} gridRows={gridRows} tileSize={tileSize} />
        )}
      </div>

      {!isInitialLoad && (hasError || connectionLost) && (
        <div
          className={`visualization__error${isSongPlaying ? ' visualization__error--overlay' : ''}`}
        >
          <p>
            {isSongPlaying ? 'Connection lost. Retrying…' : 'Session expired or connection failed.'}
          </p>
          <button className="btn-primary" onClick={login}>
            Reconnect with Spotify
          </button>
        </div>
      )}

      {!isInitialLoad && isSongPlaying && (
        <ProgressBar
          progressMs={nowPlaying.progressMs}
          durationMs={nowPlaying.durationMs}
          isPlaying={nowPlaying.isPlaying}
        />
      )}

      <div className="visualization__bottom-gradient" />
    </div>
  );
}
