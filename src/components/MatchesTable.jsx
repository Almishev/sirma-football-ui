import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMatches } from '../api/client'
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
      <h2>Matches</h2>

      {loading && <p>Loading matches...</p>}
      {error && !loading && <p>Error loading matches: {error}</p>}

      {!loading && !error && matches.length === 0 && (
        <p>No matches available yet.</p>
      )}

      {!loading && !error && matches.length > 0 && (
        <>
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
