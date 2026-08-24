import { ShieldCheck } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import LanguageSwitcher from  './LanguageSwitcher'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LogIn, LogOut } from 'lucide-react'

const navLinkClass = ({ isActive }) =>
  `text-sm px-4 py-1.5 rounded-full transition-colors ${
    isActive
      ? 'bg-brand/15 text-brand-bright border border-brand/30'
      : 'text-ink-muted hover:text-ink border border-transparent'
  }`

function Navbar() {
  const [user, setUser] = useState(null)

useEffect(() => {
  const stored = localStorage.getItem('anovix_user')
  if (stored) setUser(JSON.parse(stored))
}, [])

const handleLogout = () => {
  localStorage.removeItem('anovix_token')
  localStorage.removeItem('anovix_user')
  setUser(null)
  window.location.href = '/'
}
  return (
    <nav className="bg-bg/70 backdrop-blur-md border-b border-border px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <ShieldCheck className="text-brand-bright" size={22} />
        <span className="text-base sm:text-lg font-semibold text-ink tracking-tight">Anovix</span>
      </div>

      <div className="hidden md:flex items-center gap-1">
        <NavLink to="/" end className={navLinkClass}>Home</NavLink>
        <NavLink to="/dashboard" className={navLinkClass}>Live Feed</NavLink>
        <NavLink to="/playground" className={navLinkClass}>Playground</NavLink>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
      <LanguageSwitcher />
      {user ? (
  <button onClick={handleLogout} className="flex items-center gap-1.5 text-ink-muted hover:text-ink text-xs px-2.5 py-1.5 rounded-full border border-border transition-colors">
    <LogOut size={13} /> Logout
  </button>
) : (
  <Link to="/login" className="flex items-center gap-1.5 text-ink-muted hover:text-ink text-xs px-2.5 py-1.5 rounded-full border border-border transition-colors">
    <LogIn size={13} /> Login
  </Link>
)}
        <span className="hidden sm:inline text-ink-muted text-sm">Team MarshalX</span>
        <span className="flex items-center gap-1.5 bg-accent/10 text-accent-bright text-xs px-2.5 py-1 rounded-full border border-accent/25">
          <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
          Live
        </span>
      </div>
    </nav>
  )
}

export default Navbar