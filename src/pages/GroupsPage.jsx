import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchTeams } from '../api/client'

function GroupsPage() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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
          setError(err.message || 'Failed to load groups.')
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

  const groups = teams.reduce((acc, team) => {
    const key = team.groupLetter || 'Other'
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(team)
    return acc
  }, {})

  const sortedGroupKeys = Object.keys(groups).sort()

  return (
    <section>
      <h2>Groups</h2>

      {loading && <p>Loading groups...</p>}
      {error && !loading && <p>Error loading groups: {error}</p>}

      {!loading && !error && teams.length === 0 && <p>No groups available.</p>}

      {!loading &&
        !error &&
        sortedGroupKeys.map((group) => (
          <div key={group} style={{ marginBottom: '24px' }}>
            <h3>Group {group}</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Team</th>
                </tr>
              </thead>
              <tbody>
                {groups[group].map((team) => (
                  <tr
                    key={team.id}
                    onClick={() => navigate(`/teams/${team.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{team.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </section>
  )
}

export default GroupsPage

