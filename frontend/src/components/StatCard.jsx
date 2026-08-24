import { motion } from 'framer-motion'

function StatCard({ title, value, subtitle, accent = "neutral", delay = 0 }) {
  const glow = {
  neutral: "shadow-[0_0_0_1px_rgba(111,168,220,0.2),0_0_32px_-6px_rgba(111,168,220,0.35)]",
  danger: "shadow-[0_0_0_1px_rgba(239,68,68,0.35),0_0_40px_-4px_rgba(239,68,68,0.55)]",
  safe: "shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_0_32px_-6px_rgba(34,197,94,0.4)]",
}

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`bg-panel rounded-xl p-5 sm:p-6 transition-shadow duration-500 hover:brightness-110 ${glow[accent]}`}
    >
      <p className="text-ink-muted text-xs sm:text-sm">{title}</p>
      <p className="text-ink text-2xl sm:text-3xl font-semibold mt-1">{value}</p>
      {subtitle && <p className="text-ink-muted/70 text-xs mt-1">{subtitle}</p>}
    </motion.div>
  )
}

export default StatCard