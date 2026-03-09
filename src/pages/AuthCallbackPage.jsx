import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/** Reads ?token= from URL (after Google OAuth), stores it and redirects to home. */
function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      loginWithToken(token)
    }
    navigate('/', { replace: true })
  }, [searchParams, loginWithToken, navigate])

  return (
    <section>
      <p>Signing you in...</p>
    </section>
  )
}

export default AuthCallbackPage
