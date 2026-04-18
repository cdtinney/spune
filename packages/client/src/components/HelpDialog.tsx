import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import useDropdown from '../hooks/useDropdown';
import './HelpDialog.css';

const REPO_URL = 'https://github.com/cdtinney/spune';
const WEBSITE_URL = 'https://tinney.dev';

export default function HelpDialog() {
  const { open, ref, toggle, handleKeyDown } = useDropdown();

  return (
    <div className="help-dialog" ref={ref} onKeyDown={handleKeyDown}>
      <button
        className="btn-unstyled icon-interactive focus-ring"
        onClick={toggle}
        aria-label="About Spune"
        aria-expanded={open}
      >
        <FontAwesomeIcon icon={faCircleQuestion} size="lg" />
      </button>

      {open && (
        <div className="help-dialog__panel dropdown-panel" role="dialog" aria-label="About Spune">
          <h2 className="help-dialog__title">Spune</h2>
          <p className="help-dialog__text">
            A Spotify visualizer inspired by the{' '}
            <a href="https://en.wikipedia.org/wiki/Zune_Software" target="_blank" rel="noreferrer">
              Zune desktop software
            </a>
            . It displays album artwork from related artists as an animated mosaic while you listen.
          </p>
          <p className="help-dialog__text">
            Designed as a screensaver-style display — cast it to your TV with Chromecast for the
            full experience.
          </p>
          <div className="help-dialog__links">
            <a className="link-subtle" href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span className="help-dialog__separator" aria-hidden="true">
              &middot;
            </span>
            <span>Author: </span>
            <a className="link-subtle" href={WEBSITE_URL} target="_blank" rel="noreferrer">
              tinney.dev
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
