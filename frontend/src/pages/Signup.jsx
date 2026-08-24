import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Loader2 } from 'lucide-react'
import SpecularButton from '../components/SpecularButton'

const BASE_URL = "https://anovix.onrender.com"

function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || 'Signup failed')
      }
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-panel/60 backdrop-blur-sm border border-border rounded-2xl p-7"
      >
        <div className="flex items-center gap-2 mb-1">
          <UserPlus size={18} className="text-brand-bright" />
          <h1 className="text-xl font-semibold text-ink">Sign up</h1>
        </div>
        <p className="text-ink-muted text-sm mb-6">Create your Anovix account.</p>

        {success ? (
          <p className="text-safe text-sm">Account created! Redirecting to login...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-ink-muted text-xs mb-1.5">Account Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                    role === 'user'
                      ? 'bg-brand/15 border-brand text-ink'
                      : 'border-border text-ink-muted hover:border-brand/40'
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('merchant')}
                  className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                    role === 'merchant'
                      ? 'bg-brand/15 border-brand text-ink'
                      : 'border-border text-ink-muted hover:border-brand/40'
                  }`}
                >
                  Merchant
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-ink-muted text-xs mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-5">
              <label className="block text-ink-muted text-xs mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="At least 6 characters"
              />
            </div>

            {error && <p className="text-danger text-xs mb-4">{error}</p>}

            <SpecularButton size="md" className="w-full" type="submit">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </SpecularButton>
          </form>
        )}

        <p className="text-ink-muted text-xs text-center mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-bright hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Signup