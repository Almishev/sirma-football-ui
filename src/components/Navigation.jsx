import { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeContext.jsx'

function Navigation() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [menuOpen, setMenuOpen] = useState(false)

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

