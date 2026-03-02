const exampleMatchDetails = {
  1: {
    id: 1,
    date: '2024-06-14',
    score: '5-1',
    aTeam: { id: 1, name: 'Germany', group: 'A' },
    bTeam: { id: 2, name: 'Scotland', group: 'A' },
    aTeamPlayers: [
      { id: 1, number: 1, fullName: 'Manuel Neuer', position: 'GK' },
      { id: 2, number: 2, fullName: 'Antonio Rüdiger', position: 'DF' },
      { id: 3, number: 3, fullName: 'David Raum', position: 'DF' },
      { id: 4, number: 4, fullName: 'Jonathan Tah', position: 'DF' },
      { id: 5, number: 5, fullName: 'Pascal Groß', position: 'MF' },
    ],
    bTeamPlayers: [
      { id: 7, number: 1, fullName: 'Angus Gunn', position: 'GK' },
      { id: 8, number: 2, fullName: 'Scott McTominay', position: 'MF' },
    ],
  },
}

function getMatch(matchId) {
  if (matchId && exampleMatchDetails[matchId]) {
    return exampleMatchDetails[matchId]
  }
  return exampleMatchDetails[1]
}

function MatchDetails({ matchId, onBack, onSelectTeam }) {
  const match = getMatch(matchId)

  return (
    <section>
      <button
        type="button"
        className="back-button"
        onClick={() => onBack?.()}
      >
        Back to matches
      </button>

      <div className="match-header">
        <h2>
          {match.aTeam.name} {match.score} {match.bTeam.name}
        </h2>
        <div>{match.date}</div>
      </div>

      <div className="match-teams">
        <div className="match-team-column">
          <h3
            className="section-title"
            onClick={() => onSelectTeam?.(match.aTeam.id)}
          >
            {match.aTeam.name} (Group {match.aTeam.group})
          </h3>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {match.aTeamPlayers.map((player) => (
                <tr key={player.id}>
                  <td>{player.number}</td>
                  <td>{player.fullName}</td>
                  <td>{player.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="match-team-column">
          <h3
            className="section-title"
            onClick={() => onSelectTeam?.(match.bTeam.id)}
          >
            {match.bTeam.name} (Group {match.bTeam.group})
          </h3>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {match.bTeamPlayers.map((player) => (
                <tr key={player.id}>
                  <td>{player.number}</td>
                  <td>{player.fullName}</td>
                  <td>{player.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default MatchDetails
