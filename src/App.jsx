import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import MatchesPage from './pages/MatchesPage.jsx'
import MatchDetailsPage from './pages/MatchDetailsPage.jsx'
import TeamDetailsPage from './pages/TeamDetailsPage.jsx'
import PlayerDetailsPage from './pages/PlayerDetailsPage.jsx'
import TeamsPage from './pages/TeamsPage.jsx'
import GroupsPage from './pages/GroupsPage.jsx'
import StandingsPage from './pages/StandingsPage.jsx'
import ImportPage from './pages/ImportPage.jsx'
import Navigation from './components/Navigation.jsx'
import Footer from './components/Footer.jsx'
import TopBanner from './components/TopBanner.jsx'
import TopStrip from './components/TopStrip.jsx'

function App() {
  return (
    <>
      <TopStrip />
      <TopBanner />
      <header className="top-nav">
        <div className="top-nav-inner">
          <Navigation />
        </div>
      </header>
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<MatchesPage />} />
            <Route path="/matches/:matchId" element={<MatchDetailsPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/standings" element={<StandingsPage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
            <Route path="/players/:playerId" element={<PlayerDetailsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default App
