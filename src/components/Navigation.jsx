import { NavLink } from 'react-router-dom'

function Navigation() {
  return (
    <nav className="app-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
      >
        Matches
      </NavLink>
      <NavLink
        to="/teams/1"
        className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
      >
        Team details
      </NavLink>
    </nav>
  )
}

export default Navigation

