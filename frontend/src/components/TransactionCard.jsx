import { AlertTriangle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

function TransactionCard({ id, amount, location, time, isFraud, reasons, riskScore = 8, onFeedback }) {
  const isHighRisk = isFraud && riskScore >= 80
  const glowIntensity = isFraud ? 0.25 + (riskScore / 100) * 0.5 : 0.15

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        boxShadow: isFraud
          ? `0 0 0 1.5px rgba(239,68,68,0.45), 0 0 ${36 + riskScore * 0.3}px -4px rgba(239,68,68,${glowIntensity})`
          : `0 0 0 1px rgba(34,197,94,0.2), 0 0 24px -8px rgba(34,197,94,0.25)`,
      }}
      className={`rounded-xl p-4 sm:p-5 mb-3 bg-panel transition-shadow duration-500 ${isHighRisk ? 'animate-pulse-danger' : ''}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {isFraud ? (
            <AlertTriangle className="text-danger shrink-0" size={18} />
          ) : (
            <CheckCircle className="text-safe shrink-0" size={18} />
          )}
          <div className="min-w-0">
            <p className="text-ink font-medium text-sm sm:text-base truncate">Transaction #{id}</p>
            <p className="text-ink-muted text-xs sm:text-sm truncate">{location} · {time}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-ink font-semibold text-sm sm:text-base">₹{amount}</p>
          <p className={`text-xs ${isFraud ? 'text-danger' : 'text-ink-muted'}`}>Risk {riskScore}/100</p>
        </div>
      </div>

      <div className="mt-3 w-full bg-ink/10 rounded-full h-1.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${riskScore}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full ${isFraud ? 'bg-danger' : 'bg-safe'}`}
        />
      </div>

      {isFraud && reasons && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-brand-bright text-xs font-medium mb-1.5">Why flagged</p>
          <ul className="text-ink text-xs space-y-1">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="w-1 h-1 bg-brand-bright rounded-full mt-1.5 shrink-0"></span>
                {reason}
              </li>
            ))}
          </ul>
          <button
  onClick={() => onFeedback && onFeedback(id, 'false_positive')}
  className="mt-3 text-xs text-ink-muted hover:text-brand-bright transition-colors underline underline-offset-2"
>
  This looks like a false positive
</button>
        </div>
      )}
    </motion.div>
  )
}

export default TransactionCard