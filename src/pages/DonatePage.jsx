import { useState } from 'react'
import { createDonationSession } from '../api/client.js'

function DonatePage() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleDonate = async () => {
    setError(null)
    setSubmitting(true)
    try {
      const data = await createDonationSession()
      if (data?.url) {
        window.location.href = data.url
      } else {
        setError('Unable to start donation.')
      }
    } catch (err) {
      setError(err.message || 'Unable to start donation.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <p className="auth-tagline">Support water for Gaza</p>
      <h2>Donate 1 EUR</h2>
      <p>
        This will redirect you to a secure Stripe Checkout page where you can donate
        <strong> 1 EUR</strong> for clean water for Gaza.
      </p>
      {error && <p className="form-error">{error}</p>}
      <button
        type="button"
        className="auth-form-button"
        disabled={submitting}
        onClick={handleDonate}
      >
        {submitting ? 'Redirecting…' : 'Donate 1 EUR'}
      </button>
    </section>
  )
}

export default DonatePage

