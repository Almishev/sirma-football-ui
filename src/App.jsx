import { useState } from 'react'
import './App.css'
import MatchesTable from './components/MatchesTable.jsx'
import MatchDetails from './components/MatchDetails.jsx'
import TeamDetails from './components/TeamDetails.jsx'

function App() {
  const [view, setView] = useState('matches')
  const [selectedMatchId, setSelectedMatchId] = useState(1)
  const [selectedTeamId, setSelectedTeamId] = useState(1)

  const handleSelectMatch = (matchId) => {
    setSelectedMatchId(matchId)
    setView('matchDetails')
  }

  const handleSelectTeam = (teamId) => {
    setSelectedTeamId(teamId)
    setView('teamDetails')
  }

  let content
  if (view === 'matchDetails') {
    content = (
      <MatchDetails
        matchId={selectedMatchId}
        onBack={() => setView('matches')}
        onSelectTeam={handleSelectTeam}
      />
    )
  } else if (view === 'teamDetails') {
    content = (
      <TeamDetails
        teamId={selectedTeamId}
        onBack={() => setView('matches')}
      />
    )
  } else {
    content = <MatchesTable onSelectMatch={handleSelectMatch} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Football Tournament</h1>
        <nav className="app-nav">
          <button
            type="button"
            className={view === 'matches' ? 'nav-button active' : 'nav-button'}
            onClick={() => setView('matches')}
          >
            Matches
          </button>
          <button
            type="button"
            className={view === 'teamDetails' ? 'nav-button active' : 'nav-button'}
            onClick={() => setView('teamDetails')}
          >
            Team details
          </button>
        </nav>
      </header>
      <main className="app-main">{content}</main>
    </div>
  )
}

export default App
