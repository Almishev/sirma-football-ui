import { useState } from 'react'
import { requestPasswordReset } from '../api/client.js'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setSubmitting(true)
    try {
      await requestPasswordReset(email.trim())
      setMessage('If this email is registered, we have sent a password reset link.')
    } catch (err) {
      setError(err.message || 'Unable to request password reset.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <p className="auth-tagline">Forgot your password?</p>
      <h2>Reset password</h2>
      {message && <p className="form-success">{message}</p>}
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit} className="crud-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
          />
        </label>
        <button type="submit" className="auth-form-button" disabled={submitting}>
          {submitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </section>
  )
}

export default ForgotPasswordPage

