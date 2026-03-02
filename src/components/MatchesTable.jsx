import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialMatches = [
  {
    id: 1,
    date: '2024-06-14',
    group: 'A',
    aTeamName: 'Germany',
    bTeamName: 'Scotland',
    score: '5-1',
  },
  {
    id: 2,
    date: '2024-06-15',
    group: 'A',
    aTeamName: 'Hungary',
    bTeamName: 'Switzerland',
    score: '1-3',
  },
]

function MatchesTable() {
  const [matches] = useState(initialMatches)
  const navigate = useNavigate()

  return (
    <section>
      <h2>Matches</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Group</th>
            <th>Home team</th>
            <th>Score</th>
            <th>Away team</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr
              key={match.id}
              onClick={() => navigate(`/matches/${match.id}`)}
            >
              <td>{match.date}</td>
              <td>{match.group}</td>
              <td>{match.aTeamName}</td>
              <td>{match.score}</td>
              <td>{match.bTeamName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default MatchesTable
