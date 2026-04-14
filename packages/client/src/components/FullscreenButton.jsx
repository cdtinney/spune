import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import './FullscreenButton.css';

export default function FullscreenButton({ onClick }) {
  return (
    <div className="fullscreen-button">
      <FontAwesomeIcon
        icon={faExpandArrowsAlt}
        size="1x"
        className="fullscreen-button__icon"
        onClick={onClick}
      />
    </div>
  );
}
