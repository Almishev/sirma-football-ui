import { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function Navigation() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/', { replace: true })
  }

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  return (
    <nav className="app-nav">
      <button
        type="button"
        className="nav-button nav-hamburger"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
          onClick={() => setMenuOpen(false)}
        >
          Matches
        </NavLink>
        <NavLink
          to="/teams"
          className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
          onClick={() => setMenuOpen(false)}
        >
          Teams
        </NavLink>
        <NavLink
          to="/players"
          className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
          onClick={() => setMenuOpen(false)}
        >
          Players
        </NavLink>
        <NavLink
          to="/groups"
          className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
          onClick={() => setMenuOpen(false)}
        >
          Groups
        </NavLink>
        <NavLink
          to="/standings"
          className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
          onClick={() => setMenuOpen(false)}
        >
          Standings
        </NavLink>
        <NavLink
          to="/donate"
          className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
          onClick={() => setMenuOpen(false)}
        >
          Donate
        </NavLink>
        <NavLink
          to="/stats/player-pairs"
          className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
          onClick={() => setMenuOpen(false)}
        >
          Player pairs
        </NavLink>
        {isAuthenticated && user?.roles?.includes('ROLE_ADMIN') && (
          <NavLink
            to="/import"
            className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
            onClick={() => setMenuOpen(false)}
          >
            Import
          </NavLink>
        )}
        {isAuthenticated && user?.roles?.includes('ROLE_ADMIN') && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
            onClick={() => setMenuOpen(false)}
          >
            Users
          </NavLink>
        )}
        {isAuthenticated ? (
          <button
            type="button"
            className="nav-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
            onClick={() => setMenuOpen(false)}
          >
            Login
          </NavLink>
        )}
      </div>

      {!menuOpen && (
        <button
          type="button"
          className="nav-button nav-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      )}
    </nav>
  )
}

export default Navigation

