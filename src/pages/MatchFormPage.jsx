import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchTeams, fetchMatchById, createMatch, updateMatch } from '../api/client'

function MatchFormPage() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const isEdit = matchId && matchId !== 'new'
  const numericId = isEdit ? Number(matchId) : null

  const [teams, setTeams] = useState([])
  const [aTeamId, setATeamId] = useState('')
  const [bTeamId, setBTeamId] = useState('')
  const [date, setDate] = useState('')
  const [score, setScore] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const selectedHomeTeam = teams.find((t) => String(t.id) === aTeamId)
  const homeGroupLetter = selectedHomeTeam?.groupLetter ?? null
  const awayTeamOptions = homeGroupLetter
    ? teams.filter((t) => t.id !== Number(aTeamId) && (t.groupLetter === homeGroupLetter))
    : []

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
        const data = await fetchMatchById(numericId)
        if (!cancelled && data) {
          setATeamId(data.aTeam?.id ? String(data.aTeam.id) : '')
          setBTeamId(data.bTeam?.id ? String(data.bTeam.id) : '')
          setDate(data.date ? String(data.date).slice(0, 10) : '')
          setScore(data.score || '')
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load match.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [isEdit, numericId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const aId = aTeamId ? Number(aTeamId) : null
    const bId = bTeamId ? Number(bTeamId) : null
    if (!aId || !bId) {
      setError('Please select both teams.')
      return
    }
    if (aId === bId) {
      setError('Home and away team must be different.')
      return
    }
    if (!date) {
      setError('Please enter the match date.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const body = {
        aTeamId: aId,
        bTeamId: bId,
        date,
        score: score.trim() || null,
      }
      if (isEdit) {
        await updateMatch(numericId, body)
        navigate(`/matches/${numericId}`)
      } else {
        const created = await createMatch(body)
        navigate(`/matches/${created.id}`)
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
      <h2>{isEdit ? 'Edit match' : 'New match'}</h2>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit} className="crud-form">
        <label>
          Home team <span className="required">*</span>
          <select
            value={aTeamId}
            onChange={(e) => {
              const newA = e.target.value
              setATeamId(newA)
              const newHome = teams.find((t) => String(t.id) === newA)
              const newGroup = newHome?.groupLetter
              const currentB = teams.find((t) => String(t.id) === bTeamId)
              if (!newGroup || currentB?.groupLetter !== newGroup) {
                setBTeamId('')
              }
            }}
            required
          >
            <option value="">Select team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name} {t.groupLetter ? `(Group ${t.groupLetter})` : ''}</option>
            ))}
          </select>
        </label>
        <label>
          Away team <span className="required">*</span>
          <select
            value={bTeamId}
            onChange={(e) => setBTeamId(e.target.value)}
            required
            disabled={!aTeamId}
          >
            <option value="">{aTeamId ? (awayTeamOptions.length ? 'Select team' : 'No other team in same group') : 'Select home team first'}</option>
            {awayTeamOptions.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>
        <label>
          Date <span className="required">*</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          Score
          <input
            type="text"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="e.g. 2-1"
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

export default MatchFormPage
