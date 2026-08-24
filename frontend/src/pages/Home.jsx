import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, FlaskConical, ShieldCheck, Zap, ArrowRight, ArrowUpRight, AlertTriangle, TrendingUp, Cpu } from 'lucide-react'
import SpecularButton from '../components/SpecularButton'
import DepthText from '../components/DepthText'
import LightRays from '../components/LightRays'
import { useTranslation } from 'react-i18next'

const cardColors = {
  brand: {
    card: "bg-brand/10 border-brand/25 shadow-[0_0_30px_-10px_var(--color-brand)]",
    icon: "bg-brand/15 text-brand-bright",
  },
  danger: {
    card: "bg-danger/10 border-danger/25 shadow-[0_0_30px_-10px_var(--color-danger)]",
    icon: "bg-danger/15 text-danger",
  },
  warn: {
    card: "bg-warn/10 border-warn/25 shadow-[0_0_30px_-10px_var(--color-warn)]",
    icon: "bg-warn/15 text-warn",
  },
  accent: {
    card: "bg-accent/10 border-accent/25 shadow-[0_0_30px_-10px_var(--color-accent)]",
    icon: "bg-accent/15 text-accent-bright",
  },
  safe: {
    card: "bg-safe/10 border-safe/25 shadow-[0_0_30px_-10px_var(--color-safe)]",
    icon: "bg-safe/15 text-safe",
  },
}

const featureColors = {
  brand: { glow: 'var(--color-brand)', icon: "bg-brand/20 text-brand-bright" },
  accent: { glow: 'var(--color-accent)', icon: "bg-accent/20 text-accent-bright" },
  teal: { glow: 'var(--color-teal)', icon: "bg-teal/20 text-teal-bright" },
  lavender: { glow: 'var(--color-lavender)', icon: "bg-lavender/20 text-lavender-bright" },
}

const stats = [
  { label: 'Transactions Scanned', value: '1,284', icon: Activity, color: 'brand' },
  { label: 'Flagged as Fraud', value: '23', icon: AlertTriangle, color: 'danger' },
  { label: 'Avg Risk Score', value: '12.4', icon: TrendingUp, color: 'warn' },
  { label: 'Model', value: 'IsoForest', icon: Cpu, color: 'accent' },
]

function Home() {
  const { t } = useTranslation()

  const features = [
    {
      to: '/dashboard',
      number: '01',
      icon: Activity,
      title: t('home.feature1Title'),
      description: t('home.feature1Desc'),
      color: 'brand',
    },
    {
      to: '/playground',
      number: '02',
      icon: FlaskConical,
      title: t('home.feature2Title'),
      description: t('home.feature2Desc'),
      color: 'accent',
    },
    {
      number: '03',
      icon: ShieldCheck,
      title: t('home.feature3Title'),
      description: t('home.feature3Desc'),
      color: 'teal',
    },
    {
      number: '04',
      icon: Zap,
      title: t('home.feature4Title'),
      description: t('home.feature4Desc'),
      color: 'lavender',
    },
  ]

  return (
    <div className="min-h-screen bg-bg overflow-hidden">
      {/* hero */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-16 text-center">
        {/* moving light source — wrapped div isolates LightRays' internal z-index
            so it can only ever stack behind, never in front of, the content below */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <LightRays
            raysOrigin="top-center"
            raysColor="#6fa8dc"
            raysSpeed={1.1}
            lightSpread={0.65}
            rayLength={1.3}
            followMouse
            mouseInfluence={0.08}
            noiseAmount={0.06}
            distortion={0.03}
            fadeDistance={1.0}
            saturation={1.0}
          />
        </div>

        {/* colorful mesh glow, from the deck's tokens */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-35 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 25% 30%, var(--color-glow-blue) 0%, transparent 45%), radial-gradient(circle at 75% 25%, #ffffff 0%, transparent 40%), radial-gradient(circle at 60% 65%, var(--color-glow-rose) 0%, transparent 50%), radial-gradient(circle at 30% 70%, var(--color-accent-bright) 0%, transparent 45%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative inline-flex items-center gap-2 text-brand-bright text-xs font-medium tracking-[0.2em] uppercase mb-5"
        >
          {t('home.eyebrow')}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative flex justify-center"
        >
          <DepthText
            text="Anovix"
            layers={28}
            depth={2.2}
            faceColor="#f3f6fa"
            depthColor="#dd7e6b"
            tilt={6}
            pointerTracking
            smoothing={0.14}
            perspective={900}
            autoOrbit
            orbitSpeed={0.25}
            fontSize="clamp(3.5rem, 13vw, 7.5rem)"
            fontWeight={900}
            shadow
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative text-ink-muted text-sm sm:text-base max-w-xl mx-auto mt-4"
        >
          {t('home.tagline')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative mt-8"
        >
          <Link to="/dashboard">
            <SpecularButton size="md">
              {t('home.cta')}
              <ArrowUpRight size={16} className="inline ml-1.5 -mt-0.5" />
            </SpecularButton>
          </Link>
        </motion.div>
      </section>

      {/* stats bar */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const c = cardColors[s.color]
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + i * 0.08 }}
                className={`relative overflow-hidden backdrop-blur-2xl border rounded-2xl p-4 sm:p-5 transition-transform duration-300 hover:-translate-y-0.5 ${c.card}`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${c.icon}`}>
                  <Icon size={16} />
                </div>
                <p className="text-ink-muted text-[10px] uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-ink text-lg font-semibold">{s.value}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* feature cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <h2 className="text-ink text-2xl sm:text-3xl font-semibold text-center mb-2">
          {t('home.whatsInside')}
        </h2>
        <p className="text-ink-muted text-sm text-center mb-10">
          {t('home.whatsInsideSub')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {features.map(({ to, number, icon: Icon, title, description, color }, i) => {
            const c = featureColors[color]
            const CardInner = (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                  style={{ background: c.glow }}
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                <span className="absolute top-5 right-6 text-4xl font-bold text-white/10 transition-colors">
                  {number}
                </span>
                <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${c.icon}`}>
                  <Icon size={20} />
                </div>
                <h3 className="relative text-ink font-semibold text-base mb-1.5 flex items-center gap-1.5">
                  {title}
                  {to && <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                </h3>
                <p className="relative text-ink-muted text-sm">{description}</p>
              </>
            )

            const cardClass = "group relative block h-full rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-2xl p-6 sm:p-8 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.11]"

            return (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + i * 0.1 }}
              >
                {to ? (
                  <Link to={to} className={cardClass}>{CardInner}</Link>
                ) : (
                  <div className={cardClass}>{CardInner}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Home
