import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../api/client.js'

function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!token) {
      setError('Reset link is invalid.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      await resetPassword(token, password)
      setMessage('Your password has been reset. You can now log in.')
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1500)
    } catch (err) {
      setError(err.message || 'Unable to reset password.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <section>
        <h2>Reset password</h2>
        <p className="form-error">Reset link is invalid or missing.</p>
      </section>
    )
  }

  return (
    <section>
      <p className="auth-tagline">Choose a new password</p>
      <h2>Reset password</h2>
      {message && <p className="form-success">{message}</p>}
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit} className="crud-form">
        <label>
          New password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            autoFocus
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>
        <button type="submit" className="auth-form-button" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save new password'}
        </button>
      </form>
    </section>
  )
}

export default ResetPasswordPage

