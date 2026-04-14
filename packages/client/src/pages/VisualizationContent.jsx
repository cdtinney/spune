import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useUser } from '../contexts/UserContext';
import { useSpotify } from '../contexts/SpotifyContext';
import useNowPlayingPoller from '../hooks/useNowPlayingPoller';
import useWindowSize from '../hooks/useWindowSize';
import useAlbumGrid from '../hooks/useAlbumGrid';
import LoadingScreen from '../components/LoadingScreen';
import CoverOverlay from '../components/CoverOverlay';
import SongCard from '../components/SongCard';
import AlbumGrid from '../components/AlbumGrid';
import UserAvatar from '../components/UserAvatar';
import UserMenu from '../components/UserMenu';
import FullscreenButton from '../components/FullscreenButton';
import './VisualizationContent.css';

const REPO_URL = 'https://github.com/cdtinney/spune';

export default function VisualizationContent() {
  useNowPlayingPoller();
  const { user, logout } = useUser();
  const { nowPlaying, relatedAlbums, loading } = useSpotify();
  const windowSize = useWindowSize();
  const { albums, imageSize } = useAlbumGrid(relatedAlbums, windowSize);
  const [fullscreen, setFullscreen] = useState(false);

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  const userName = user?.displayName || user?.spotifyId;
  const userImageUrl = user?.photos?.[0];
  const isInitialLoad = loading && !nowPlaying;
  const songPlaying = nowPlaying?.artistName && nowPlaying?.songTitle;

  return (
    <div className="visualization">
      {!isInitialLoad && (
        <FullscreenButton onClick={handleFullscreenToggle} />
      )}

      <CoverOverlay />

      {!isInitialLoad && (
        <>
          {!fullscreen && (
            <a href={REPO_URL} className="visualization__github-icon">
              <FontAwesomeIcon icon={faGithub} size="1x" />
            </a>
          )}

          {userName && userImageUrl && (
            <div className="visualization__user-container">
              <UserAvatar displayName={userName} thumbnailSrc={userImageUrl} />
              <UserMenu onLogout={logout} />
            </div>
          )}
        </>
      )}

      <div className="visualization__content">
        {isInitialLoad && (
          <LoadingScreen className="visualization__loading" />
        )}

        {!isInitialLoad && !songPlaying && (
          <div className="visualization__empty">
            <p>No song playing. Play something.</p>
          </div>
        )}

        {!isInitialLoad && songPlaying && (
          <>
            <SongCard
              artistName={nowPlaying.artistName}
              songTitle={nowPlaying.songTitle}
              albumName={nowPlaying.albumName}
              albumImageUrl={nowPlaying.albumImageUrl}
            />
            <AlbumGrid albums={albums} imageSize={imageSize} />
          </>
        )}
      </div>
    </div>
  );
}
