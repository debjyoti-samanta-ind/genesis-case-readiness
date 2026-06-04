import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, ArrowUpDown, ArrowUp, ArrowDown, Info, Download, ChevronDown, X, AlertTriangle } from 'lucide-react'
import { weeklyOutcomes, samplePostCaseReport } from '../data/syntheticData'

const { summary, dailyBreakdown, surgeonVariance } = weeklyOutcomes

/* ── Custom tooltip ─────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#E3E3E3] rounded-lg shadow-md px-4 py-3 text-sm">
      <div className="font-semibold text-[#2F2D2E] mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: p.fill }} />
          <span className="text-[#909BA6]">{p.name}:</span>
          <span className="font-semibold text-[#2F2D2E]">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Variance pill ──────────────────────────────────────────── */
function VariancePill({ avg }) {
  const isHigh = avg >= 1.5
  const isMid  = avg >= 0.7
  return (
    <span
      className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full font-mono"
      style={{
        backgroundColor: isHigh ? '#F9EBEA' : isMid ? '#FFFFD6' : '#daffd1',
        color:           isHigh ? '#CB4630' : isMid ? '#F18F01' : '#42A800',
      }}
    >
      {avg.toFixed(1)}
    </span>
  )
}

function exportCSV(data, period) {
  const headers = ['Surgeon', 'Procedure', 'Cases This Week', 'Avg Variance Items', 'Top Variance Item']
  const rows = data.map(r => [r.surgeon, r.procedure, r.casesThisWeek, r.avgVarianceItems, `"${r.topVarianceItem}"`])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `genesis-outcomes-${period.replace(/[\s/]/g, '-')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function ChargeCapturModal({ onClose }) {
  const r = samplePostCaseReport
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#E3E3E3]">
          <div>
            <p className="text-base font-bold text-[#2F2D2E]">Post-Case Report — Charge Capture Detail</p>
            <p className="text-xs text-[#909BA6] mt-0.5">
              {r.procedure} · {r.surgeon} · {r.date} · {r.orRoom} · Generated {r.reportGeneratedAt}
            </p>
          </div>
          <button onClick={onClose} className="text-[#909BA6] hover:text-[#2F2D2E] transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Summary strip */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Line Items', value: r.totalLineItems, color: '#2F2D2E' },
              { label: 'Matched', value: r.matched, color: '#009999' },
              { label: 'Variances', value: r.variances, color: '#F18F01' },
            ].map(s => (
              <div key={s.label} className="rounded-lg border border-[#E3E3E3] p-3 text-center">
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[#909BA6] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Charge gap alert */}
          <div className="flex items-start gap-3 rounded-lg px-4 py-3" style={{ backgroundColor: '#FDF2F0', border: '1px solid #F5C4BC' }}>
            <AlertTriangle size={15} style={{ color: '#CB4630' }} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#2F2D2E]">
                Charge Capture Gap — ${r.chargeCaptureSummary.estimatedRecoveryValue} potential recovery
              </p>
              <p className="text-xs text-[#909BA6] mt-0.5">
                {r.chargeCaptureSummary.gapsDetected} gap detected · {r.chargeCaptureSummary.confidence} confidence · Monocryl Suture 2-0 used but not billed
              </p>
            </div>
            <span className="ml-auto flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F9EBEA', color: '#CB4630' }}>
              HIGH
            </span>
          </div>

          {/* Variance items table */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#909BA6] mb-3">Variance Items</p>
            <div className="rounded-lg border border-[#E3E3E3] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FCFCFC] border-b border-[#E3E3E3]">
                    {['Item', 'On Card', 'Used', 'Delta', 'Charge'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-[#909BA6] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.varianceItems.map(item => (
                    <tr key={item.sku} className="border-b border-[#E3E3E3] last:border-0">
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-[#2F2D2E]">{item.description}</p>
                        <p className="text-xs text-[#909BA6]">{item.sku} · {item.category}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#2F2D2E]">{item.qtyOnCard}</td>
                      <td className="px-4 py-3 text-xs text-[#2F2D2E]">{item.qtyUsed}</td>
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: item.delta > 0 || item.delta === '+2 (not on card)' ? '#F18F01' : '#009999' }}>
                        {typeof item.delta === 'number' ? (item.delta > 0 ? `+${item.delta}` : item.delta) : item.delta}
                      </td>
                      <td className="px-4 py-3">
                        {item.chargeCaptured === 'GAP'
                          ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F9EBEA', color: '#CB4630' }}>GAP</span>
                          : <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E0F7F7', color: '#009999' }}>Billed</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preference card update recommendation */}
          {r.preferenceCardUpdateRecommendation.triggered && (
            <div className="rounded-lg border border-[#E3E3E3] p-4" style={{ backgroundColor: '#FFFBF2' }}>
              <p className="text-xs font-bold uppercase tracking-widest text-[#F18F01] mb-2">Preference Card Update Recommended</p>
              <p className="text-xs text-[#545F66] mb-2">{r.preferenceCardUpdateRecommendation.reason}</p>
              <p className="text-xs font-semibold text-[#2F2D2E] mb-1">Suggested: <span className="font-normal text-[#545F66]">{r.preferenceCardUpdateRecommendation.suggestedUpdate}</span></p>
              <p className="text-xs mt-2 font-medium" style={{ color: '#CB4630' }}>
                ⚠ {r.preferenceCardUpdateRecommendation.actionRequired}
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#E3E3E3] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#095256' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Outcomes() {
  const [sortConfig, setSortConfig] = useState({ key: 'avgVarianceItems', dir: 'desc' })
  const [expandedCard, setExpandedCard] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('thisWeek')
  const [showChargeModal, setShowChargeModal] = useState(false)
  const [tooltipPos, setTooltipPos] = useState(null)

  const showTooltip = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTooltipPos({ top: r.bottom + 8, left: r.left + r.width / 2 })
  }

  const clearanceRate = Math.round((summary.casesCleared / summary.totalCasesScheduled) * 100)
  const autoRateDelta = summary.autoResolutionRate - summary.autoResolutionRatePriorWeek

  const handleSort = (key) => {
    setSortConfig(prev => prev.key === key
      ? { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' }
      : { key, dir: 'desc' }
    )
  }

  const sortedVariance = [...surgeonVariance].sort((a, b) => {
    const mul = sortConfig.dir === 'asc' ? 1 : -1
    if (sortConfig.key === 'surgeon') return mul * a.surgeon.localeCompare(b.surgeon)
    if (sortConfig.key === 'casesThisWeek') return mul * (a.casesThisWeek - b.casesThisWeek)
    return mul * (a.avgVarianceItems - b.avgVarianceItems)
  })

  function SortIcon({ colKey }) {
    if (sortConfig.key !== colKey) return <ArrowUpDown size={12} />
    return sortConfig.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
  }

  const metricCards = [
    {
      label: 'Cases Cleared',
      value: `${summary.casesCleared}/${summary.totalCasesScheduled}`,
      sub:   `${clearanceRate}% clearance rate`,
      delta: `+${clearanceRate - 71}% vs prior week`,
      kind:  'good',
    },
    {
      label: 'Auto-Resolution Rate',
      value: `${summary.autoResolutionRate}%`,
      sub:   'of detected supply gaps resolved without human action',
      delta: `+${autoRateDelta}pp vs prior week`,
      kind:  'good',
    },
    {
      label: 'Escalations Raised',
      value: `${summary.escalationsRaised}`,
      sub:   'gaps requiring human decision',
      delta: `−${summary.escalationsRaisedPriorWeek - summary.escalationsRaised} vs prior week`,
      kind:  'down-good',
    },
    {
      label: 'Variance Items Flagged',
      value: `${summary.varianceItemsFlagged}`,
      sub:   'preference card discrepancies',
      delta: 'across all surgeons this week',
      kind:  'neutral',
    },
  ]

  return (
    <div>
      {showChargeModal && <ChargeCapturModal onClose={() => setShowChargeModal(false)} />}

      {tooltipPos && (
        <div
          className="fixed z-50 w-60 rounded-lg shadow-lg border border-[#E3E3E3] bg-white px-3 py-3 pointer-events-none"
          style={{ top: tooltipPos.top, left: tooltipPos.left, transform: 'translateX(-50%)' }}
        >
          <p className="text-xs font-semibold text-[#2F2D2E] mb-1">Average variance items per case</p>
          <p className="text-[11px] text-[#545F66] mb-2 leading-relaxed">How often a surgeon uses items that don't match their preference card — extra items, missing items, or wrong quantities.</p>
          <div className="space-y-1">
            {[
              { dot: '#42A800', range: '< 0.7', label: 'card is well-maintained' },
              { dot: '#F18F01', range: '0.7 – 1.4', label: 'some drift, worth reviewing' },
              { dot: '#CB4630', range: '1.5+', label: 'significant drift, costing money' },
            ].map(t => (
              <div key={t.range} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.dot }} />
                <span className="text-[11px] text-[#545F66]">
                  <span className="font-semibold text-[#2F2D2E]">{t.range}</span> — {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2F2D2E]">Outcomes</h1>
          <p className="text-[#909BA6] mt-1 text-sm">
            {weeklyOutcomes.period} · Valley Regional Medical Center
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date range toggle (P3.2) */}
          <div className="flex rounded-lg overflow-hidden border border-[#E3E3E3]">
            {[
              { id: 'thisWeek', label: 'This Week' },
              { id: 'lastWeek', label: 'Last Week' },
              { id: 'last30',  label: 'Last 30 Days' },
            ].map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: selectedPeriod === p.id ? '#095256' : '#ffffff',
                  color: selectedPeriod === p.id ? '#ffffff' : '#909BA6',
                  borderLeft: i > 0 ? '1px solid #E3E3E3' : 'none',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#006FDD', color: '#ffffff' }}
            onClick={() => exportCSV(sortedVariance, weeklyOutcomes.period)}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Historical data banner (P3.2) */}
      {selectedPeriod !== 'thisWeek' ? (
        <div
          className="rounded-xl border px-6 py-5 mb-6 flex items-start gap-3"
          style={{ backgroundColor: '#EEFFFF', borderColor: '#8BFFFF' }}
        >
          <span style={{ color: '#009999', fontSize: 18 }}>ℹ</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#095256' }}>
              Historical data for {selectedPeriod === 'lastWeek' ? 'Last Week' : 'Last 30 Days'} not yet available
            </p>
            <p className="text-xs mt-1" style={{ color: '#545F66' }}>
              Genesis Case Readiness requires 4+ weeks of operation to show historical comparisons. Data collection started Mon 25 May 2026.
            </p>
          </div>
        </div>
      ) : (
        <>
      {/* Summary metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metricCards.map(card => {
          const isExpanded = expandedCard === card.label
          return (
          <div
            key={card.label}
            onClick={() => setExpandedCard(isExpanded ? null : card.label)}
            className="bg-white rounded-xl border shadow-sm p-5 flex flex-col cursor-pointer relative transition-all"
            style={{ borderColor: isExpanded ? '#009999' : '#E3E3E3', boxShadow: isExpanded ? '0 0 0 2px #009999' : undefined }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">
              {card.label}
            </p>
            <p className="text-3xl font-bold text-[#2F2D2E] leading-none mb-1">
              {card.value}
            </p>
            <p className="text-xs text-[#909BA6] mb-3">{card.sub}</p>
            {card.kind === 'good' ? (
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full self-start mt-auto"
                style={{ backgroundColor: '#daffd1', color: '#42A800' }}
              >
                <TrendingUp size={11} />
                {card.delta}
              </span>
            ) : card.kind === 'down-good' ? (
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full self-start mt-auto"
                style={{ backgroundColor: '#daffd1', color: '#42A800' }}
              >
                <TrendingDown size={11} />
                {card.delta}
              </span>
            ) : (
              <span className="text-xs text-[#909BA6] mt-auto">{card.delta}</span>
            )}
            <ChevronDown
              size={13}
              className="absolute bottom-3 right-3 transition-transform"
              style={{ color: '#909BA6', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </div>
        )})}
      </div>

      {/* Expandable drilldown panel (P2.4) */}
      {expandedCard && (
        <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6 mb-6">
          <p className="text-sm font-bold text-[#2F2D2E] mb-4">{expandedCard} — Detail</p>
          {expandedCard === 'Cases Cleared' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E3E3E3]">
                  <th className="py-2 text-left text-xs text-[#909BA6] font-semibold uppercase">Day</th>
                  <th className="py-2 text-left text-xs text-[#909BA6] font-semibold uppercase">Cleared / Scheduled</th>
                  <th className="py-2 text-left text-xs text-[#909BA6] font-semibold uppercase">At Risk</th>
                </tr>
              </thead>
              <tbody>
                {dailyBreakdown.map(row => (
                  <tr key={row.day} className="border-b border-[#E3E3E3] last:border-0">
                    <td className="py-2.5 font-medium text-[#2F2D2E]">{row.day}</td>
                    <td className="py-2.5 text-[#2F2D2E]">{row.casesCleared} / {row.casesScheduled}</td>
                    <td className="py-2.5">
                      {row.atRisk > 0
                        ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F9EBEA', color: '#CB4630' }}>{row.atRisk} at risk</span>
                        : <span className="text-xs text-[#909BA6]">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {expandedCard === 'Auto-Resolution Rate' && (
            <div className="space-y-3">
              {[
                { label: 'Inventory checks completed', value: 21 },
                { label: 'Auto-reorders triggered (below $500)', value: 3 },
                { label: 'Loan kit emails sent to vendor reps', value: summary.loanKitRequestsSent },
                { label: 'Preference card drift checks', value: 14 },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between border-b border-[#E3E3E3] pb-2.5">
                  <span className="text-sm text-[#2F2D2E]">{row.label}</span>
                  <span className="text-sm font-bold" style={{ color: '#009999' }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}
          {expandedCard === 'Escalations Raised' && (
            <div>
              <div className="space-y-3 mb-4">
                {[
                  { label: 'PPI items (no auto-action)', value: summary.ppiItemsEscalated },
                  { label: 'Vendor rep no-response', value: 3 },
                  { label: 'Preference card changes', value: 1 },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between border-b border-[#E3E3E3] pb-2.5">
                    <span className="text-sm text-[#2F2D2E]">{row.label}</span>
                    <span className="text-sm font-bold" style={{ color: '#F18F01' }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#909BA6] italic">All escalations raised to charge nurse by 02:00am</p>
            </div>
          )}
          {expandedCard === 'Variance Items Flagged' && (
            <div>
              <p className="text-xs text-[#909BA6] mb-3">Top surgeons with avg variance &gt; 1.0 item per case</p>
              <div className="space-y-3">
                {surgeonVariance.filter(s => s.avgVarianceItems > 1.0).slice(0, 3).map(row => (
                  <div key={row.surgeon} className="flex items-center justify-between border-b border-[#E3E3E3] pb-2.5">
                    <div>
                      <p className="text-sm font-medium text-[#2F2D2E]">{row.surgeon}</p>
                      <p className="text-xs text-[#909BA6]">{row.procedure}</p>
                    </div>
                    <VariancePill avg={row.avgVarianceItems} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
        </>
      )}

      {/* Current-week label when viewing historical period */}
      {selectedPeriod !== 'thisWeek' && (
        <p className="text-xs font-semibold uppercase tracking-widest text-[#F18F01] mb-3">
          Showing current week data (Mon 25 May – Fri 29 May) — historical period selected above has no data yet
        </p>
      )}

      {/* Agent activity row */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">
          Agent Activity This Week
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Preference Card Drift Detected',
              value: summary.preferenceCardDrift,
              sub:   'cases where surgeon usage differed from current preference card',
              color: '#F18F01',
              delta: `−${summary.preferenceCardDriftPriorWeek - summary.preferenceCardDrift} vs prior week`,
            },
            {
              label: 'PPI Items Escalated',
              value: summary.ppiItemsEscalated,
              sub:   'physician preference items flagged — auto-reorder blocked per governance',
              color: '#CB4630',
            },
            {
              label: 'Loan Kit Requests Sent',
              value: summary.loanKitRequestsSent,
              sub:   'vendor rep emails sent autonomously by agent',
              color: '#009999',
            },
            {
              label: 'Charge Capture Flagged',
              value: `$${samplePostCaseReport.chargeCaptureSummary.estimatedRecoveryValue}`,
              sub:   `potential recovery · 1 case this week · ${samplePostCaseReport.chargeCaptureSummary.confidence.toLowerCase()} confidence`,
              color: '#CB4630',
              note:  'View post-case report for detail',
            },
          ].map(card => (
            <div
              key={card.label}
              className="rounded-xl border border-[#E3E3E3] shadow-sm p-4 flex flex-col"
              style={{ backgroundColor: '#FCFCFC' }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-2">
                {card.label}
              </p>
              <p className="text-2xl font-bold leading-none mb-1" style={{ color: card.color }}>
                {card.value}
              </p>
              <p className="text-xs text-[#909BA6] mb-2">{card.sub}</p>
              {card.delta && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full self-start mt-auto"
                  style={{ backgroundColor: '#daffd1', color: '#42A800' }}
                >
                  <TrendingDown size={11} />
                  {card.delta}
                </span>
              )}
              {card.note && (
                <button
                  onClick={e => { e.stopPropagation(); setShowChargeModal(true) }}
                  className="text-xs mt-auto text-left hover:underline"
                  style={{ color: '#006FDD' }}
                >
                  {card.note} →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Daily breakdown bar chart */}
      <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6 mb-6">
        <div className="mb-5">
          <p className="text-base font-bold text-[#2F2D2E]">Daily Case Breakdown</p>
          <p className="text-xs text-[#909BA6] mt-0.5">
            Cases cleared vs at-risk vs auto-resolved · {weeklyOutcomes.period}
          </p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={dailyBreakdown}
            barCategoryGap="32%"
            barGap={3}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E3E3" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fill: '#909BA6' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fill: '#909BA6' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F5F3EF' }} />
            <Legend
              wrapperStyle={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, paddingTop: 12 }}
              iconType="square"
              iconSize={10}
            />
            <Bar dataKey="casesCleared" name="Cleared"       fill="#009999" radius={[4, 4, 0, 0]} />
            <Bar dataKey="atRisk"       name="At-Risk"       fill="#CB4630" radius={[4, 4, 0, 0]} />
            <Bar dataKey="autoResolved" name="Auto-Resolved" fill="#81D24C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Surgeon variance table */}
      <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[#E3E3E3]">
          <p className="text-base font-bold text-[#2F2D2E]">Surgeon Variance</p>
          <p className="text-xs text-[#909BA6] mt-0.5">
            Average preference card variance items per case this week
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#FCFCFC] border-b border-[#E3E3E3]">
              {[
                { label: 'Surgeon', key: 'surgeon' },
                { label: 'Procedure', key: null },
                { label: 'Cases', key: 'casesThisWeek' },
              ].map(col => (
                <th
                  key={col.label}
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest ${col.key ? 'cursor-pointer select-none' : ''}`}
                  style={{ color: col.key && sortConfig.key === col.key ? '#006FDD' : '#909BA6' }}
                  onClick={col.key ? () => handleSort(col.key) : undefined}
                >
                  {col.key ? (
                    <span className="flex items-center gap-1">
                      {col.label}
                      <SortIcon colKey={col.key} />
                    </span>
                  ) : col.label}
                </th>
              ))}
              {/* Sortable column */}
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest cursor-pointer select-none"
                style={{ color: sortConfig.key === 'avgVarianceItems' ? '#006FDD' : '#909BA6' }}
                onClick={() => handleSort('avgVarianceItems')}
              >
                <span className="flex items-center gap-1">
                  Avg Variance Items
                  <SortIcon colKey="avgVarianceItems" />
                  <span
                    className="ml-0.5 cursor-help"
                    onMouseEnter={showTooltip}
                    onMouseLeave={() => setTooltipPos(null)}
                  >
                    <Info size={11} style={{ color: '#C8CDD2' }} />
                  </span>
                </span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#909BA6]">
                Top Variance Item
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedVariance.map((row, i) => (
              <tr
                key={row.surgeon}
                className={`border-b border-[#E3E3E3] last:border-0 hover:bg-[#FCFCFC] transition-colors ${
                  i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                }`}
              >
                <td className="px-6 py-4 font-semibold text-[#2F2D2E]">{row.surgeon}</td>
                <td className="px-6 py-4 text-[#909BA6]">{row.procedure}</td>
                <td className="px-6 py-4 font-mono text-[#2F2D2E]">{row.casesThisWeek}</td>
                <td className="px-6 py-4">
                  <VariancePill avg={row.avgVarianceItems} />
                </td>
                <td className="px-6 py-4 text-[#909BA6]">{row.topVarianceItem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conversation starter banner */}
      <div
        className="rounded-xl border px-6 py-4"
        style={{ borderColor: '#C5D6D8', backgroundColor: '#EEFFFF' }}
      >
        <div className="flex items-start gap-3">
          <Info size={15} style={{ color: '#009999' }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#009999' }}>
              This week · confirmed operational metrics only
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#2F2D2E' }}>
              {summary.casesCleared} of {summary.totalCasesScheduled} cases reached the OR with no unresolved gaps
              · {summary.autoResolutionRate}% of detected gaps resolved autonomously
              · {summary.varianceItemsFlagged} post-case variance items flagged across all surgeons
            </p>
            <p className="text-xs mt-2" style={{ color: '#545F66' }}>
              Estimated savings not shown — no validated cost baseline established with design partner yet.
              Apply your own OR minute cost to calculate value.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
