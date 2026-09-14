import { useNavigate } from 'react-router-dom';
import { getCurrentAdmin, logout } from '../services/auth';

export default function Header({ title, onMenuClick }) {
  const navigate = useNavigate();
  const admin = getCurrentAdmin();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          ☰
        </button>
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <div className="header-admin">
          <div className="avatar">{admin?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
          <span className="header-admin-name">{admin?.name || 'Admin'}</span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
