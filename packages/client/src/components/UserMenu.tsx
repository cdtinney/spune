import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import useDropdown from '../hooks/useDropdown';
import './UserMenu.css';

interface UserMenuProps {
  onLogout: () => void;
}

export default function UserMenu({ onLogout }: UserMenuProps) {
  const { open, ref, toggle, handleKeyDown } = useDropdown();

  return (
    <div className="user-menu" ref={ref} onKeyDown={handleKeyDown}>
      <button
        className="user-menu__trigger btn-unstyled icon-interactive focus-ring"
        onClick={toggle}
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <FontAwesomeIcon icon={faCaretDown} className="user-menu__icon" />
      </button>
      {open && (
        <div className="user-menu__dropdown dropdown-panel" role="menu">
          <button className="user-menu__item" role="menuitem" onClick={onLogout}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
