import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchPlayerById, deletePlayer } from '../api/client'

function PlayerDetailsPage() {
  const { playerId } = useParams()
  const navigate = useNavigate()
  const numericId = Number(playerId)
  const hasValidId = !Number.isNaN(numericId)

  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!hasValidId) {
      setLoading(false)
      setError('Invalid player id.')
      return
    }

    let cancelled = false

    async function load() {
      try {
        const data = await fetchPlayerById(numericId)
        if (!cancelled) {
          setPlayer(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load player details.')
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

      {loading && <p>Loading player statistics...</p>}
      {error && !loading && <p>Error: {error}</p>}

      {!loading && !error && player && (
        <>
          <div className="page-header">
            <h2>{player.fullName}</h2>
            <div className="detail-actions">
              <button type="button" className="button-secondary" onClick={() => navigate(`/players/${player.id}/edit`)}>
                Edit
              </button>
              <button
                type="button"
                className="button-danger"
                onClick={() => {
                  if (window.confirm('Delete this player? All their match records will be deleted.')) {
                    deletePlayer(player.id).then(() => navigate('/players')).catch((err) => setError(err.message))
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <p>
            #{player.teamNumber} · {player.position} · {player.teamName} (Group{' '}
            {player.groupLetter})
          </p>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Matches played</div>
              <div className="stat-value">{player.matchesPlayed}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total minutes</div>
              <div className="stat-value">{player.totalMinutes}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Avg minutes / match</div>
              <div className="stat-value">
                {player.matchesPlayed > 0
                  ? player.averageMinutesPerMatch.toFixed(1)
                  : '0.0'}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default PlayerDetailsPage

