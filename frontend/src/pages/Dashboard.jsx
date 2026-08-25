import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import StatCard from '../components/StatCard'
import TransactionCard from '../components/TransactionCard'
import { getTransactions, BASE_URL } from '../api/api'

function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('anovix_user') || '{}')
  const isMerchant = user.role === 'merchant'

  useEffect(() => {
    getTransactions(20)
      .then((data) => {
        const filtered = isMerchant && user.merchant_id
          ? data.filter((tx) => tx.merchant_id === user.merchant_id)
          : data

        const mapped = filtered.map((tx) => ({
          id: tx.id,
          amount: tx.amount,
          location: tx.location || (tx.latitude ? `${tx.latitude.toFixed(1)}, ${tx.longitude.toFixed(1)}` : 'Unknown'),
          time: tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : '—',
          isFraud: tx.is_flagged,
          riskScore: tx.risk_score,
          reasons: tx.explanation ? tx.explanation.map((e) => `${e.feature}: ${e.impact > 0 ? '+' : ''}${e.impact}`) : [],
        }))
        setTransactions(mapped)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const flaggedCount = transactions.filter((t) => t.isFraud).length
  const avgRisk = transactions.length
    ? (transactions.reduce((sum, t) => sum + (t.riskScore || 0), 0) / transactions.length).toFixed(1)
    : 0

  const handleFeedback = async (transactionId, feedback) => {
    try {
      await fetch(`${BASE_URL}/transaction/${transactionId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      })
      alert('Feedback submitted!')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-ink">
            {isMerchant ? 'Merchant Transaction Dashboard' : 'My Fraud Detection Dashboard'}
          </h1>
          <button
            onClick={() => window.open(`${BASE_URL}/report/flagged`, '_blank')}
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-border text-ink-muted hover:text-ink hover:border-brand/50 transition-colors flex items-center gap-1.5"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard title="Total Transactions" value={transactions.length} accent="safe" delay={0} />
          <StatCard title="Flagged as Fraud" value={flaggedCount} accent="danger" delay={0.1} />
          <StatCard title="Avg Risk Score" value={avgRisk} subtitle="Out of 100" accent="neutral" delay={0.2} />
        </div>

        <h2 className="text-base sm:text-lg font-medium text-ink-muted mb-3 sm:mb-4">Recent Transactions</h2>
        <div>
          {loading && <p className="text-ink-muted text-sm">Loading transactions...</p>}
          {!loading && transactions.length === 0 && <p className="text-ink-muted text-sm">No transactions yet.</p>}
          {transactions.map((tx) => (
            <TransactionCard key={tx.id} {...tx} onFeedback={handleFeedback} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard