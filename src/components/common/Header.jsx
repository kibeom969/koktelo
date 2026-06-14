import { Link, useLocation } from 'react-router-dom'
import { Wine, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()

  const navLinks = [
    { path: '/encyclopedia', label: '도감' },
    { path: '/recommend', label: '추천' },
    { path: '/favorites', label: '즐겨찾기' }
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout(); 
    window.location.reload();
  }

  return (
    <header className="header glass">
      <div className="header-container container">
        <Link to="/" className="logo">
          <span className="logo-text">Koktelo</span>
        </Link>

        <nav className="nav">
          <ul className="nav-list">
            {navLinks.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'nav-link--active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">
                <User size={16} />
                {user.name}
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={16} />
                로그아웃
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link
                to="/login"
                className="auth-link"
              >
                로그인
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
