import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import './FullscreenButton.css';

interface FullscreenButtonProps {
  onClick: () => void;
}

export default function FullscreenButton({ onClick }: FullscreenButtonProps) {
  return (
    <div className="fullscreen-button">
      <FontAwesomeIcon
        icon={faExpand}
        size="1x"
        className="fullscreen-button__icon"
        onClick={onClick}
      />
    </div>
  );
}
