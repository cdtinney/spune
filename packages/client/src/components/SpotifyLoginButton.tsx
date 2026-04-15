import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import './SpotifyLoginButton.css';

interface SpotifyLoginButtonProps {
  onClick: () => void;
}

export default function SpotifyLoginButton({ onClick }: SpotifyLoginButtonProps) {
  return (
    <button id="button-login" className="spotify-login-button" onClick={onClick}>
      <FontAwesomeIcon icon={faSpotify} size="lg" className="spotify-login-button__icon" />
      LOG IN WITH SPOTIFY
    </button>
  );
}
