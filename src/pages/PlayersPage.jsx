import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPlayersPage } from '../api/client'
import Pagination from '../components/Pagination.jsx'

function PlayersPage() {
  const [players, setPlayers] = useState([])
  const [page, setPage] = useState(0)
  const [size] = useState(15)
  const [totalPages, setTotalPages] = useState(0)
  const [sort, setSort] = useState('fullName,asc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchPlayersPage(page, size, sort)
        if (!cancelled) {
          const items = Array.isArray(data) ? data : data.content || data.items || []
          setPlayers(items)
          setTotalPages(data?.totalPages ?? 0)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load players.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [page, size, sort])

  const toggleSort = (field) => {
    setPage(0)
    setSort((current) => {
      const isSameField = current.startsWith(field)
      if (!isSameField) return `${field},asc`
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
        <h2>Players</h2>
        <button type="button" className="button-primary" onClick={() => navigate('/players/new')}>
          New player
        </button>
      </div>

      {loading && <p>Loading players...</p>}
      {error && !loading && <p>Error: {error}</p>}
      {!loading && !error && players.length === 0 && <p>No players yet.</p>}

      {!loading && !error && players.length > 0 && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th
                  className="sortable-header"
                  onClick={() => toggleSort('teamNumber')}
                >
                  # <span className="sort-indicator">{sortIndicator('teamNumber')}</span>
                </th>
                <th
                  className="sortable-header"
                  onClick={() => toggleSort('fullName')}
                >
                  Name <span className="sort-indicator">{sortIndicator('fullName')}</span>
                </th>
                <th
                  className="sortable-header"
                  onClick={() => toggleSort('position')}
                >
                  Position <span className="sort-indicator">{sortIndicator('position')}</span>
                </th>
                <th
                  className="sortable-header"
                  onClick={() => toggleSort('teamName')}
                >
                  Team <span className="sort-indicator">{sortIndicator('teamName')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/players/${p.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{p.teamNumber}</td>
                  <td>{p.fullName}</td>
                  <td>{p.position}</td>
                  <td>{p.teamName}</td>
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

export default PlayersPage
