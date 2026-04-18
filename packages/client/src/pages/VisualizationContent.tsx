import { useState, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useUser } from '../features/auth/UserContext';
import { useSpotify } from '../features/playback/SpotifyContext';
import useNowPlayingPoller from '../features/playback/useNowPlayingPoller';
import useWindowSize from '../hooks/useWindowSize';
import useAlbumGrid from '../features/visualization/useAlbumGrid';
import useDominantColor from '../features/visualization/useDominantColor';
import LoadingScreen from '../components/LoadingScreen';
import VisualizationLayout from '../features/visualization/VisualizationLayout';
import UserAvatar from '../features/auth/UserAvatar';
import UserMenu from '../features/auth/UserMenu';
import FullscreenButton from '../components/FullscreenButton';
import CastButton from '../cast/sender/CastButton';
import useCastSession from '../cast/sender/useCastSession';
import type { CastMessage } from '../cast/types';
import './VisualizationContent.css';

const REPO_URL = 'https://github.com/cdtinney/spune';

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
  const isSongPlaying = !!(nowPlaying?.artistName && nowPlaying?.songTitle);
  const hasError = !!error;

  return (
    <VisualizationLayout
      dominantColor={dominantColor}
      nowPlaying={nowPlaying}
      tiles={tiles}
      gridCols={gridCols}
      gridRows={gridRows}
      tileSize={tileSize}
      songPlaying={!isInitialLoad && isSongPlaying}
      loadingContent={
        isInitialLoad ? <LoadingScreen className="visualization__loading" /> : undefined
      }
      emptyContent={
        !isInitialLoad && !hasError && !connectionLost && !isSongPlaying ? (
          <div className="visualization__empty">
            <p>No song playing. Play something.</p>
          </div>
        ) : undefined
      }
      errorContent={
        !isInitialLoad && (hasError || connectionLost) ? (
          <div
            className={`visualization__error${isSongPlaying ? ' visualization__error--overlay' : ''}`}
          >
            <p>
              {isSongPlaying
                ? 'Connection lost. Retrying…'
                : 'Session expired or connection failed.'}
            </p>
            <button className="btn-primary" onClick={login}>
              Reconnect with Spotify
            </button>
          </div>
        ) : undefined
      }
      controls={
        !isInitialLoad ? (
          <>
            <FullscreenButton onClick={handleFullscreenToggle} />

            {!fullscreen && (
              <a href={REPO_URL} className="visualization__github-icon icon-interactive">
                <FontAwesomeIcon icon={faGithub} size="1x" />
              </a>
            )}

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
        ) : undefined
      }
    />
  );
}
