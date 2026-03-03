import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchTeamById } from '../api/client'

function TeamDetails() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const numericId = Number(teamId)
  const hasValidId = !Number.isNaN(numericId)

  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!hasValidId) {
      setLoading(false)
      setError('Invalid team id.')
      return
    }

    let cancelled = false

    async function load() {
      try {
        const data = await fetchTeamById(numericId)
        if (!cancelled) {
          setTeam(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load team details.')
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
  }, [hasValidId, numericId])

  return (
    <section>
      <button
        type="button"
        className="back-button"
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      {loading && <p>Loading team details...</p>}
      {error && !loading && <p>Error: {error}</p>}

      {!loading && !error && team && (
        <>
          <h2>{team.name}</h2>
          <p>
            Group {team.groupLetter} · Manager: {team.managerFullName}
          </p>

          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {team.players?.map((player) => (
                <tr
                  key={player.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/players/${player.id}`)}
                >
                  <td>{player.teamNumber}</td>
                  <td>{player.fullName}</td>
                  <td>{player.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  )
}

export default TeamDetails
