import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMatches } from '../api/client'

function MatchesTable() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchMatches()
        if (!cancelled) {
          setMatches(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load matches.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section>
      <h2>Matches</h2>

      {loading && <p>Loading matches...</p>}
      {error && !loading && <p>Error loading matches: {error}</p>}

      {!loading && !error && matches.length === 0 && (
        <p>No matches available yet.</p>
      )}

      {!loading && !error && matches.length > 0 && (
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
                <td>{match.groupLetter}</td>
                <td>{match.aTeamName}</td>
                <td>{match.score}</td>
                <td>{match.bTeamName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default MatchesTable
