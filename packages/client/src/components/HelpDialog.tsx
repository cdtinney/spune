import { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import './HelpDialog.css';

const REPO_URL = 'https://github.com/cdtinney/spune';
const WEBSITE_URL = 'https://tinney.dev';

export default function HelpDialog() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && e.target instanceof Node && !dialogRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  }, []);

  return (
    <div className="help-dialog" ref={dialogRef} onKeyDown={handleKeyDown}>
      <button
        className="help-dialog__trigger icon-interactive focus-ring"
        onClick={() => setOpen(!open)}
        aria-label="About Spune"
        aria-expanded={open}
      >
        <FontAwesomeIcon icon={faCircleQuestion} size="lg" />
      </button>

      {open && (
        <div className="help-dialog__panel" role="dialog" aria-label="About Spune">
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
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span className="help-dialog__separator" aria-hidden="true">
              &middot;
            </span>
            <span>Author: </span>
            <a href={WEBSITE_URL} target="_blank" rel="noreferrer">
              tinney.dev
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
