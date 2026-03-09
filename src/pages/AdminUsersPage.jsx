import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchUsers, updateUserRoles, banUser } from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'

const AVAILABLE_ROLES = [
  { value: 'ROLE_USER', label: 'User' },
  { value: 'ROLE_EDITOR', label: 'Editor' },
  { value: 'ROLE_ADMIN', label: 'Admin' },
]

function AdminUsersPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const isAdmin = isAuthenticated && user?.roles?.includes('ROLE_ADMIN')

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [banningId, setBanningId] = useState(null)

  const loadUsers = useCallback(async () => {
    try {
      const data = await fetchUsers()
      setUsers(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load users.')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true })
      return
    }
    loadUsers()
  }, [isAdmin, navigate, loadUsers])

  const handleRoleChange = async (userId, newRoleName) => {
    setUpdatingId(userId)
    try {
      await updateUserRoles(userId, [newRoleName])
      await loadUsers()
    } catch (err) {
      setError(err.message || 'Failed to update role.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleBan = async (userId) => {
    if (!window.confirm('Ban this user? They will be disabled and their tokens invalidated.')) return
    setBanningId(userId)
    try {
      await banUser(userId)
      await loadUsers()
    } catch (err) {
      setError(err.message || 'Failed to ban user.')
    } finally {
      setBanningId(null)
    }
  }

  if (!isAdmin) return null

  return (
    <section>
      <h2>Users (admin)</h2>
      {loading && <p>Loading users...</p>}
      {error && !loading && <p className="form-error">{error}</p>}
      {!loading && !error && users.length === 0 && <p>No users.</p>}

      {!loading && !error && users.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email ?? '-'}</td>
                <td>{u.roles?.join(', ') ?? '-'}</td>
                <td>{u.enabled ? 'Active' : 'Banned'}</td>
                <td>
                  <select
                    value={u.roles?.length ? (AVAILABLE_ROLES.some((r) => r.value === u.roles[0]) ? u.roles[0] : 'ROLE_USER') : 'ROLE_USER'}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={updatingId === u.id}
                    className="role-select"
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  {updatingId === u.id && <span className="inline-muted"> Updating...</span>}
                </td>
                <td>
                  {u.enabled ? (
                    <button
                      type="button"
                      className="button-danger"
                      onClick={() => handleBan(u.id)}
                      disabled={banningId === u.id}
                    >
                      {banningId === u.id ? 'Banning...' : 'Ban'}
                    </button>
                  ) : (
                    <span className="muted">Banned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default AdminUsersPage
