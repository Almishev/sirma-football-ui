import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPlayerPairs } from '../api/client'

function PlayerPairsPage() {
  const [pairs, setPairs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    fetchPlayerPairs(100)
      .then((data) => {
        if (isMounted) {
          setPairs(Array.isArray(data) ? data : [])
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load player pairs')
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
    return <div>Loading player pairs...</div>
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>
  }

  if (!pairs.length) {
    return <div>No data.</div>
  }

  const player1Label = (pair) =>
    pair.player1Name != null && pair.player1Name !== '' ? pair.player1Name : String(pair.player1Id)
  const player2Label = (pair) =>
    pair.player2Name != null && pair.player2Name !== '' ? pair.player2Name : String(pair.player2Id)

  return (
    <div className="player-pairs-page standings-page">
      <h2>Player pairs (most minutes together)</h2>

      <div className="player-pairs-table-desktop">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player 1</th>
                <th>Player 2</th>
                <th>Minutes together</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((pair, index) => (
                <tr key={`${pair.player1Id}-${pair.player2Id}-${index}`}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/players/${pair.player1Id}`}>{player1Label(pair)}</Link>
                  </td>
                  <td>
                    <Link to={`/players/${pair.player2Id}`}>{player2Label(pair)}</Link>
                  </td>
                  <td>{pair.totalMinutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="player-pairs-list-mobile">
        {pairs.map((pair, index) => (
          <div key={`${pair.player1Id}-${pair.player2Id}-${index}`} className="player-pair-card">
            <span className="player-pair-card-rank">#{index + 1}</span>
            <div className="player-pair-card-players">
              <Link to={`/players/${pair.player1Id}`}>{player1Label(pair)}</Link>
              <span className="player-pair-card-sep"> · </span>
              <Link to={`/players/${pair.player2Id}`}>{player2Label(pair)}</Link>
            </div>
            <span className="player-pair-card-minutes">{pair.totalMinutes} min</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlayerPairsPage
