import './App.css'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import MatchesPage from './pages/MatchesPage.jsx'
import MatchDetailsPage from './pages/MatchDetailsPage.jsx'
import TeamDetailsPage from './pages/TeamDetailsPage.jsx'
import TeamsPage from './pages/TeamsPage.jsx'
import Navigation from './components/Navigation.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <>
      <header className="top-nav">
        <div className="top-nav-inner">
          <h1 className="top-nav-title">
            <Link to="/">Football Tournament</Link>
          </h1>
          <Navigation />
        </div>
      </header>
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<MatchesPage />} />
            <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default App
