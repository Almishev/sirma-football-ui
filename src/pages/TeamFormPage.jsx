import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchTeamById, createTeam, updateTeam } from '../api/client'

function TeamFormPage() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const isEdit = teamId && teamId !== 'new'
  const numericId = isEdit ? Number(teamId) : null

  const [name, setName] = useState('')
  const [managerFullName, setManagerFullName] = useState('')
  const [groupLetter, setGroupLetter] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) {
      setLoading(false)
      return
    }
    let cancelled = false
    async function load() {
      try {
        const data = await fetchTeamById(numericId)
        if (!cancelled) {
          setName(data.name ?? '')
          setManagerFullName(data.managerFullName ?? '')
          setGroupLetter(data.groupLetter ?? '')
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load team.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [isEdit, numericId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const body = { name: name.trim(), managerFullName: managerFullName.trim() || null, groupLetter: groupLetter.trim() || null }
      if (isEdit) {
        await updateTeam(numericId, body)
        navigate(`/teams/${numericId}`)
      } else {
        const created = await createTeam(body)
        navigate(`/teams/${created.id}`)
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
      <h2>{isEdit ? 'Edit team' : 'New team'}</h2>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit} className="crud-form">
        <label>
          Name <span className="required">*</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label>
          Manager full name
          <input
            type="text"
            value={managerFullName}
            onChange={(e) => setManagerFullName(e.target.value)}
          />
        </label>
        <label>
          Group letter
          <input
            type="text"
            value={groupLetter}
            onChange={(e) => setGroupLetter(e.target.value)}
            placeholder="e.g. A"
            maxLength={1}
          />
        </label>
        <div className="form-actions">
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}</button>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </section>
  )
}

export default TeamFormPage
