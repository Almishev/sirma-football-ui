import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchTeams, fetchPlayerById, createPlayer, updatePlayer } from '../api/client'

function PlayerFormPage() {
  const { playerId } = useParams()
  const navigate = useNavigate()
  const isEdit = playerId && playerId !== 'new'
  const numericId = isEdit ? Number(playerId) : null

  const [teams, setTeams] = useState([])
  const [fullName, setFullName] = useState('')
  const [position, setPosition] = useState('')
  const [teamNumber, setTeamNumber] = useState('')
  const [teamId, setTeamId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchTeams()
      .then((data) => { if (!cancelled) setTeams(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setTeams([]) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!isEdit) {
      setLoading(false)
      return
    }
    let cancelled = false
    async function load() {
      try {
        const data = await fetchPlayerById(numericId)
        if (!cancelled) {
          setFullName(data.fullName ?? '')
          setPosition(data.position ?? '')
          setTeamNumber(data.teamNumber ?? '')
          setTeamId(String(data.teamId ?? ''))
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load player.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [isEdit, numericId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const tid = teamId ? Number(teamId) : null
    if (!tid) {
      setError('Please select a team.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const body = {
        fullName: fullName.trim(),
        position: position.trim() || null,
        teamNumber: teamNumber === '' ? null : Number(teamNumber),
        teamId: tid,
      }
      if (isEdit) {
        await updatePlayer(numericId, body)
        navigate(`/players/${numericId}`)
      } else {
        const created = await createPlayer(body)
        navigate(`/players/${created.id}`)
      }
    } catch (err) {
      setError(err.message || 'Save failed.')
      setSaving(false)
    }
  }

  if (loading) return <section><p>Loading...</p></section>

  return (
    <section>
      <button type="button" className="back-button" onClick={() => navigate(-1)}>Back</button>
      <h2>{isEdit ? 'Edit player' : 'New player'}</h2>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit} className="crud-form">
        <label>
          Full name <span className="required">*</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label>
          Position
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g. GK, DF, MF, FW"
          />
        </label>
        <label>
          Team number
          <input
            type="number"
            min={0}
            value={teamNumber}
            onChange={(e) => setTeamNumber(e.target.value)}
          />
        </label>
        <label>
          Team <span className="required">*</span>
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
          >
            <option value="">Select team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>
        <div className="form-actions">
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}</button>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </section>
  )
}

export default PlayerFormPage
