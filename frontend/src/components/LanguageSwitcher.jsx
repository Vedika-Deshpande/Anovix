import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { useState } from 'react'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
]

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const changeLang = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('anovix_lang', code)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-ink-muted hover:text-ink text-xs px-2.5 py-1.5 rounded-full border border-border transition-colors"
      >
        <Languages size={13} />
        {languages.find(l => l.code === i18n.language)?.label || 'English'}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-panel border border-border rounded-lg overflow-hidden z-30 min-w-[120px]">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className="block w-full text-left px-3 py-2 text-xs text-ink hover:bg-brand/10 transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher