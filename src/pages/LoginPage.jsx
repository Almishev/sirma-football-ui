import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getGoogleLoginUrl } from '../api/client.js'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <p className="auth-tagline">Be our member</p>
      <h2>Log in</h2>
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
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit" className="auth-form-button" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
        <p className="auth-form-footer">
          <Link to="/forgot-password" className="auth-form-link">Forgot password?</Link>
        </p>
        <p className="auth-form-divider">or</p>
        <a href={getGoogleLoginUrl()} className="auth-form-button auth-form-google">
          Login with Google
        </a>
      </form>
      <p className="auth-form-footer">
        Don&apos;t have an account? <Link to="/register" className="auth-form-link">Register</Link>
      </p>
    </section>
  )
}

export default LoginPage
