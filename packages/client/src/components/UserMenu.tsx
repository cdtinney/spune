import { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import './UserMenu.css';

interface UserMenuProps {
  onLogout: () => void;
}

export default function UserMenu({ onLogout }: UserMenuProps) {
  const [open, setOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    },
    [],
  );

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu__trigger"
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <FontAwesomeIcon icon={faCaretDown} className="user-menu__icon" />
      </button>
      {open && (
        <div className="user-menu__dropdown" role="menu">
          <button className="user-menu__item" role="menuitem" onClick={onLogout}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
