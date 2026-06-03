import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, ArrowUpDown, ArrowUp, ArrowDown, Info, Download, ChevronDown } from 'lucide-react'
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

export default function Outcomes() {
  const [sortConfig, setSortConfig] = useState({ key: 'avgVarianceItems', dir: 'desc' })
  const [expandedCard, setExpandedCard] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('thisWeek')

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
      sub:   'gaps resolved without human action',
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
          Showing current week data (Mon 25 May – Thu 29 May) — historical period selected above has no data yet
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
              sub:   `potential recovery identified · ${samplePostCaseReport.chargeCaptureSummary.confidence.toLowerCase()} confidence`,
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
                <p className="text-xs mt-auto" style={{ color: '#006FDD' }}>{card.note}</p>
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
