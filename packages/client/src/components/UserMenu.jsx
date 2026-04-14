import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import './UserMenu.css';

export default function UserMenu({ onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="user-menu" ref={menuRef}>
      <FontAwesomeIcon
        icon={faCaretDown}
        className="user-menu__icon"
        title="Menu"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="user-menu__dropdown">
          <button className="user-menu__item" onClick={onLogout}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
