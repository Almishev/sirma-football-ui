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
        to="/teams"
        className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
      >
        Teams
      </NavLink>
      <NavLink
        to="/groups"
        className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
      >
        Groups
      </NavLink>
      <NavLink
        to="/standings"
        className={({ isActive }) => (isActive ? 'nav-button active' : 'nav-button')}
      >
        Standings
      </NavLink>
    </nav>
  )
}

export default Navigation

