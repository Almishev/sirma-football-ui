import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchTeams } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'

function TeamsPage() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const canEdit = isAuthenticated && (user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_EDITOR'))

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchTeams()
        if (!cancelled) {
          setTeams(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load teams.')
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
      <div className="page-header">
        <h2>Teams</h2>
        {canEdit && (
          <button type="button" className="button-primary" onClick={() => navigate('/teams/new')}>
            New team
          </button>
        )}
      </div>

      {loading && <p>Loading teams...</p>}
      {error && !loading && <p>Error loading teams: {error}</p>}

      {!loading && !error && teams.length === 0 && <p>No teams available.</p>}

      {!loading && !error && teams.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Group</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.id}
                onClick={() => navigate(`/teams/${team.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td>{team.groupLetter}</td>
                <td>{team.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default TeamsPage

