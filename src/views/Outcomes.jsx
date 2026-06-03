import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, ArrowUpDown, Info, Download } from 'lucide-react'
import { weeklyOutcomes } from '../data/syntheticData'

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
  const [sortAsc, setSortAsc] = useState(false)

  const clearanceRate = Math.round((summary.casesCleared / summary.totalCasesScheduled) * 100)
  const autoRateDelta = summary.autoResolutionRate - summary.autoResolutionRatePriorWeek

  const sortedVariance = [...surgeonVariance].sort((a, b) =>
    sortAsc ? a.avgVarianceItems - b.avgVarianceItems : b.avgVarianceItems - a.avgVarianceItems
  )

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
        <button
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 mt-1"
          style={{ backgroundColor: '#006FDD', color: '#ffffff' }}
          onClick={() => exportCSV(sortedVariance, weeklyOutcomes.period)}
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {metricCards.map(card => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-5 flex flex-col"
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
          </div>
        ))}
      </div>

      {/* Agent activity row */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">
          Agent Activity This Week
        </p>
        <div className="grid grid-cols-3 gap-4">
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
              {['Surgeon', 'Procedure', 'Cases'].map(col => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#909BA6]"
                >
                  {col}
                </th>
              ))}
              {/* Sortable column */}
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest cursor-pointer select-none"
                style={{ color: '#006FDD' }}
                onClick={() => setSortAsc(s => !s)}
              >
                <span className="flex items-center gap-1">
                  Avg Variance Items
                  <ArrowUpDown size={12} />
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
