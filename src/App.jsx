import './App.css'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import MatchesTable from './components/MatchesTable.jsx'
import MatchDetails from './components/MatchDetails.jsx'
import TeamDetails from './components/TeamDetails.jsx'
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
            <Route path="/" element={<MatchesTable />} />
            <Route path="/matches/:matchId" element={<MatchDetails />} />
            <Route path="/teams/:teamId" element={<TeamDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default App
