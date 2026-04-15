import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import './FullscreenButton.css';

interface FullscreenButtonProps {
  onClick: () => void;
}

export default function FullscreenButton({ onClick }: FullscreenButtonProps) {
  return (
    <button
      className="fullscreen-button icon-interactive focus-ring"
      onClick={onClick}
      aria-label="Toggle fullscreen"
      title="Toggle fullscreen"
    >
      <FontAwesomeIcon icon={faExpand} size="1x" className="fullscreen-button__icon" />
    </button>
  );
}
