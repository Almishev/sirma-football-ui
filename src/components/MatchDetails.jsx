import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchMatchById, deleteMatch } from '../api/client'

function MatchDetails() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const numericId = Number(matchId)
  const hasValidId = !Number.isNaN(numericId)

  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!hasValidId) {
      setLoading(false)
      setError('Invalid match id.')
      return
    }

    let cancelled = false

    async function load() {
      try {
        const data = await fetchMatchById(numericId)
        if (!cancelled) {
          setMatch(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load match details.')
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
        onClick={() => navigate('/')}
      >
        Back to matches
      </button>

      {loading && <p>Loading match details...</p>}
      {error && !loading && <p>Error: {error}</p>}

      {!loading && !error && match && (
        <>
          <div className="page-header">
            <div className="match-header">
              <h2>
                {match.aTeam?.name} {match.score} {match.bTeam?.name}
              </h2>
              <div>{match.date}</div>
            </div>
            <div className="detail-actions">
              <button type="button" className="button-secondary" onClick={() => navigate(`/matches/${match.id}/edit`)}>
                Edit
              </button>
              <button
                type="button"
                className="button-danger"
                onClick={() => {
                  if (window.confirm('Delete this match? All player records for this match will be deleted.')) {
                    deleteMatch(match.id).then(() => navigate('/')).catch((err) => setError(err.message))
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="match-teams">
            <div className="match-team-column">
              <h3
                className="section-title"
                onClick={() => navigate(`/teams/${match.aTeam?.id}`)}
              >
                {match.aTeam?.name} (Group {match.aTeam?.groupLetter})
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
                  {match.aTeam?.players?.map((player) => (
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
            </div>

            <div className="match-team-column">
              <h3
                className="section-title"
                onClick={() => navigate(`/teams/${match.bTeam?.id}`)}
              >
                {match.bTeam?.name} (Group {match.bTeam?.groupLetter})
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
                  {match.bTeam?.players?.map((player) => (
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
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default MatchDetails
