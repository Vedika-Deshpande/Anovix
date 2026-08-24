import { motion } from 'framer-motion'

function RiskGauge({ score = 0, size = 180 }) {
  const radius = (size - 20) / 2
  const circumference = radius * Math.PI // semi-circle
  const clampedScore = Math.min(Math.max(score, 0), 100)
  const progress = (clampedScore / 100) * circumference

  const getColor = (s) => {
    if (s < 40) return '#22c55e'   // safe green
    if (s < 70) return '#f59e0b'   // warn amber
    return '#ef4444'               // danger red
  }

  const color = getColor(clampedScore)
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* background track */}
        <path
          d={`M 10 ${cy} A ${radius} ${radius} 0 0 1 ${size - 10} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* animated progress arc */}
        <motion.path
          d={`M 10 ${cy} A ${radius} ${radius} 0 0 1 ${size - 10} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="-mt-8 text-center"
      >
        <p className="text-3xl font-bold" style={{ color }}>{Math.round(clampedScore)}</p>
        <p className="text-ink-muted text-xs">out of 100</p>
      </motion.div>
    </div>
  )
}

export default RiskGauge