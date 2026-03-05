import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchGroupStandings } from '../api/client'

function StandingsPage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    fetchGroupStandings()
      .then((data) => {
        if (isMounted) {
          setGroups(Array.isArray(data) ? data : [])
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load standings')
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <div>Loading standings...</div>
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>
  }

  if (!groups.length) {
    return <div>No standings available yet.</div>
  }

  return (
    <div className="standings-page">
      <h2>Group Standings</h2>
      <div className="standings-groups">
        {groups.map((group) => (
          <section key={group.groupLetter} className="standings-group">
            <h3>Group {group.groupLetter}</h3>
            <div className="table-container">
              <table>
              <thead>
                <tr>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>GD</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {group.teams.map((team) => (
                  <tr
                    key={team.teamId}
                    onClick={() => navigate(`/teams/${team.teamId}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{team.teamName}</td>
                    <td>{team.played}</td>
                    <td>{team.won}</td>
                    <td>{team.drawn}</td>
                    <td>{team.lost}</td>
                    <td>{team.goalsFor}</td>
                    <td>{team.goalsAgainst}</td>
                    <td>{team.goalDifference}</td>
                    <td>{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        ))}
      </div>
    </div>
  )
}

export default StandingsPage

