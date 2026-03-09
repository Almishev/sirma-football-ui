import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMatches } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'
import Pagination from './Pagination.jsx'

function MatchesTable() {
  const [matches, setMatches] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(15)
  const [totalPages, setTotalPages] = useState(0)
  const [sort, setSort] = useState('date,asc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const canEdit = isAuthenticated && (user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_EDITOR'))

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchMatches(page, size, sort)
        if (!cancelled) {
          const items = Array.isArray(data) ? data : data.content || data.items || []
          setMatches(items)
          if (data && typeof data.totalPages === 'number') {
            setTotalPages(data.totalPages)
          } else {
            setTotalPages(0)
          }
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
  }, [page, size, sort])

  const toggleSort = (field) => {
    setPage(0)
    setSort((current) => {
      const isSameField = current.startsWith(field)
      if (!isSameField) {
        return `${field},asc`
      }
      const [, direction] = current.split(',')
      return `${field},${direction === 'asc' ? 'desc' : 'asc'}`
    })
  }

  const sortIndicator = (field) => {
    if (!sort.startsWith(field)) return '↕'
    const [, direction] = sort.split(',')
    return direction === 'asc' ? '↑' : '↓'
  }

  return (
    <section>
      <div className="page-header">
        <h2>Matches</h2>
        {canEdit && (
          <button type="button" className="button-primary" onClick={() => navigate('/matches/new')}>
            New match
          </button>
        )}
      </div>

      {loading && <p>Loading matches...</p>}
      {error && !loading && <p>Error loading matches: {error}</p>}

      {!loading && !error && matches.length === 0 && (
        <p>No matches available yet.</p>
      )}

      {!loading && !error && matches.length > 0 && (
        <>
          <div className="matches-table-desktop">
            <table className="table">
              <thead>
                <tr>
                  <th
                    className="sortable-header"
                    onClick={() => toggleSort('date')}
                  >
                    Date <span className="sort-indicator">{sortIndicator('date')}</span>
                  </th>
                  <th
                    className="sortable-header"
                    onClick={() => toggleSort('groupLetter')}
                  >
                    Group <span className="sort-indicator">{sortIndicator('groupLetter')}</span>
                  </th>
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
          </div>

          <div className="matches-list-mobile">
            {matches.map((match) => (
              <button
                key={match.id}
                type="button"
                className="match-card"
                onClick={() => navigate(`/matches/${match.id}`)}
              >
                <div className="match-card-header">
                  <span className="match-card-date">{match.date}</span>
                </div>
                <div className="match-card-body">
                  <div className="match-card-meta">
                    <span className="match-card-group">Group {match.groupLetter}</span>
                  </div>
                  <div className="match-card-row">
                    <span className="match-card-team match-card-team-home">
                      {match.aTeamName}
                    </span>
                    <span className="match-card-score">{match.score}</span>
                    <span className="match-card-team match-card-team-away">
                      {match.bTeamName}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  )
}

export default MatchesTable
