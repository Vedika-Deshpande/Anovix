import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Loader2 } from 'lucide-react'
import SpecularButton from '../components/SpecularButton'
import { useTranslation } from 'react-i18next'
import { playgroundTransaction } from '../api/api'
import RiskGauge from '../components/RiskGauge'

function Playground() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('')
  const [location, setLocation] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await playgroundTransaction({ amount, location, time })
      setResult(data)
    } catch (err) {
      console.error("Error analyzing transaction:", err)
      setError("Couldn't reach the fraud detection service. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg px-4 sm:px-6 lg:px-10 py-14 sm:py-20 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, var(--color-glow-blue) 0%, transparent 45%), radial-gradient(circle at 70% 60%, var(--color-glow-rose) 0%, transparent 50%)',
        }}
      />

      <div className="relative max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-brand-bright text-xs font-medium tracking-[0.2em] uppercase mb-3">
            <FlaskConical size={14} /> {t('playground.eyebrow')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-ink mb-2">{t('playground.title')}</h1>
          <p className="text-ink-muted text-sm max-w-sm mx-auto">
            {t('playground.subtitle')}
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-panel/60 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-7"
        >
          <div className="mb-4">
            <label className="block text-ink-muted text-xs mb-1.5">{t('playground.amount')}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="e.g. 48000"
            />
          </div>

          <div className="mb-4">
            <label className="block text-ink-muted text-xs mb-1.5">{t('playground.location')}</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-brand transition-colors"
              placeholder="e.g. Delhi"
            />
          </div>

          <div className="mb-6">
            <label className="block text-ink-muted text-xs mb-1.5">{t('playground.time')}</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          <SpecularButton size="md" className="w-full" type="submit">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> {t('playground.scoring')}
              </span>
            ) : (
              t('playground.submit')
            )}
          </SpecularButton>

          {error && (
            <p className="mt-3 text-danger text-xs text-center">{error}</p>
          )}
        </motion.form>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                boxShadow: result.isFraud
                  ? `0 0 0 1.5px rgba(239,68,68,0.4), 0 0 32px -4px rgba(239,68,68,0.4)`
                  : `0 0 0 1px rgba(34,197,94,0.2), 0 0 24px -8px rgba(34,197,94,0.25)`,
              }}
              className="mt-5 bg-panel/60 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="flex justify-center mb-2">
  <RiskGauge score={result.score} />
</div>

<p className="text-center text-ink font-medium text-sm mb-4">
  {result.isFraud ? t('playground.flagged') : t('playground.safe')}
</p>

              <div className="w-full bg-ink/10 rounded-full h-1.5 overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className={`h-full rounded-full ${result.isFraud ? 'bg-danger' : 'bg-safe'}`}
                />
              </div>

              {result.reasons.length > 0 && (
                <div>
                  <p className="text-brand-bright text-xs font-medium mb-1.5">{t('playground.whyScore')}</p>
                  <ul className="text-ink text-xs space-y-1">
                    {result.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1 h-1 bg-brand-bright rounded-full mt-1.5 shrink-0"></span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Playground