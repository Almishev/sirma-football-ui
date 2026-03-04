import { useRef, useState } from 'react'
import { importCsv, deleteAllImportData, deleteImportData } from '../api/client'
import './ImportPage.css'

const IMPORTS = [
  { key: 'teams', label: 'Teams', hint: 'teams.csv' },
  { key: 'players', label: 'Players', hint: 'players.csv' },
  { key: 'matches', label: 'Matches', hint: 'matches.csv' },
  { key: 'records', label: 'Records', hint: 'records.csv' },
]

function ImportPage() {
  const [files, setFiles] = useState({ teams: null, players: null, matches: null, records: null })
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteTypeLoading, setDeleteTypeLoading] = useState(null)
  const [error, setError] = useState(null)
  const [deleteResult, setDeleteResult] = useState(null)
  const [deleteTypeResults, setDeleteTypeResults] = useState({})
  const fileInputRefs = useRef({})

  const handleFileChange = (key, e) => {
    const file = e.target.files?.[0] || null
    setFiles((prev) => ({ ...prev, [key]: file }))
    setResults((prev) => ({ ...prev, [key]: undefined }))
    setError(null)
  }

  const handleClearFile = (key) => {
    setFiles((prev) => ({ ...prev, [key]: null }))
    setResults((prev) => ({ ...prev, [key]: undefined }))
    setError(null)
    const input = fileInputRefs.current[key]
    if (input) input.value = ''
  }

  const handleClearAll = () => {
    setFiles({ teams: null, players: null, matches: null, records: null })
    setResults({})
    setError(null)
    IMPORTS.forEach(({ key }) => {
      const input = fileInputRefs.current[key]
      if (input) input.value = ''
    })
  }

  const handleUpload = async (key) => {
    const file = files[key]
    if (!file) {
      setError(`Select a file for ${key} first.`)
      return
    }
    setLoading(key)
    setError(null)
    try {
      const data = await importCsv(key, file)
      setResults((prev) => ({ ...prev, [key]: data?.imported ?? data }))
    } catch (err) {
      setError(err.message || 'Upload failed.')
      setResults((prev) => ({ ...prev, [key]: undefined }))
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete all data (teams, players, matches, records). Are you sure?')) return
    setDeleteLoading(true)
    setError(null)
    setDeleteResult(null)
    try {
      const data = await deleteAllImportData()
      setDeleteResult(data)
    } catch (err) {
      setError(err.message || 'Delete failed.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteType = async (key) => {
    const label = IMPORTS.find((i) => i.key === key)?.label || key
    if (!window.confirm(`Delete all ${label} from the database?`)) return
    setDeleteTypeLoading(key)
    setError(null)
    setDeleteTypeResults((prev) => ({ ...prev, [key]: undefined }))
    try {
      const data = await deleteImportData(key)
      const count = data?.deleted ?? data
      setDeleteTypeResults((prev) => ({ ...prev, [key]: count }))
    } catch (err) {
      setError(err.message || 'Delete failed.')
    } finally {
      setDeleteTypeLoading(null)
    }
  }

  return (
    <section className="import-page">
      <h2>Import CSV data</h2>
      <p className="import-hint">
        Upload files in order: Teams → Players → Matches → Records.
      </p>

      <div className="import-delete-section">
        <h3>Delete data</h3>
        <p className="import-hint-small">
          Remove data from the database. Delete by table below, or use &quot;Delete all&quot; to clear everything. Order for single-table delete: Records → Matches → Players → Teams (due to dependencies).
        </p>
        <button
          type="button"
          className="import-button import-button-delete"
          onClick={handleDeleteAll}
          disabled={loading !== null || deleteLoading || deleteTypeLoading !== null}
        >
          {deleteLoading ? 'Deleting…' : 'Delete all data'}
        </button>
        {deleteResult && (
          <p className="import-result">
            Deleted: records {deleteResult.records}, matches {deleteResult.matches}, players {deleteResult.players}, teams {deleteResult.teams}.
          </p>
        )}
      </div>

      <button
        type="button"
        className="import-clear-all"
        onClick={handleClearAll}
        disabled={loading !== null}
      >
        Clear all files
      </button>

      {error && <div className="import-error">{error}</div>}

      <div className="import-grid">
        {IMPORTS.map(({ key, label, hint }) => (
          <div key={key} className="import-card">
            <h3>{label}</h3>
            <p className="import-hint-small">{hint}</p>
            <div className="import-file-wrap">
              <input
                id={`import-file-${key}`}
                ref={(el) => (fileInputRefs.current[key] = el)}
                type="file"
                accept=".csv"
                onChange={(e) => handleFileChange(key, e)}
                disabled={loading !== null}
                className="import-file-input"
              />
              <label
                htmlFor={`import-file-${key}`}
                className={`import-file-label ${loading !== null ? 'disabled' : ''}`}
              >
                Choose file
              </label>
              <span className="import-file-status">
                {files[key] ? files[key].name : 'No file chosen'}
              </span>
            </div>
            <div className="import-actions">
              <button
                type="button"
                className="import-button"
                onClick={() => handleUpload(key)}
                disabled={!files[key] || loading !== null}
              >
                {loading === key ? 'Uploading…' : 'Upload'}
              </button>
              <button
                type="button"
                className="import-button import-button-clear"
                onClick={() => handleClearFile(key)}
                disabled={loading !== null}
              >
                Clear file
              </button>
              <button
                type="button"
                className="import-button import-button-delete-small"
                onClick={() => handleDeleteType(key)}
                disabled={loading !== null || deleteLoading || deleteTypeLoading !== null}
                title={`Delete all ${label} from the database`}
              >
                {deleteTypeLoading === key ? 'Deleting…' : 'Delete from DB'}
              </button>
            </div>
            {results[key] !== undefined && (
              <p className="import-result">Imported: {results[key]}</p>
            )}
            {deleteTypeResults[key] !== undefined && (
              <p className="import-result">Deleted from DB: {deleteTypeResults[key]}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ImportPage
