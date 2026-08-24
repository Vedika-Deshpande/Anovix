import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Loader2 } from 'lucide-react'
import SpecularButton from '../components/SpecularButton'

const BASE_URL = "https://anovix.onrender.com"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error('Invalid email or password')
      const data = await res.json()
      localStorage.setItem('anovix_token', data.access_token)
      localStorage.setItem('anovix_user', JSON.stringify(data.user))
      navigate('/dashboard')
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
          <LogIn size={18} className="text-brand-bright" />
          <h1 className="text-xl font-semibold text-ink">Log in</h1>
        </div>
        <p className="text-ink-muted text-sm mb-6">Access your Anovix dashboard.</p>

        <form onSubmit={handleSubmit}>
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
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-danger text-xs mb-4">{error}</p>}

          <SpecularButton size="md" className="w-full" type="submit">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Logging in...
              </span>
            ) : (
              'Log In'
            )}
          </SpecularButton>
        </form>

        <p className="text-ink-muted text-xs text-center mt-5">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-bright hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login