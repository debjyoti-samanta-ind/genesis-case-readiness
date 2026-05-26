/*
 * PHASE 5 — Post-Case Report
 *
 * What: Variance report comparing actual PoC scans vs preference card line items.
 * Accessed: Completed case entry in Today's OR left panel (not a nav item).
 *
 * Data: samplePostCaseReport from syntheticData.js
 *   - Header:   procedure, surgeon, date, orRoom, reportGeneratedAt, preferenceCardVersion, totalLineItems
 *   - Cards:    matched, variances, chargeGaps, chargeCaptureSummary
 *   - Table:    varianceItems[] — sku, description, onCard, scannedAtPoC, qtyOnCard, qtyUsed, delta, category, chargeCaptured, note
 *   - Rec:      preferenceCardUpdateRecommendation
 *
 * Design tokens: #81D24C (primary CTA + Yes indicators), #009999 (matched card),
 *   #F18F01 (variances card + delta+), #CB4630 (gap card + GAP badge + row tint),
 *   #EEFFFF (recommendation banner bg)
 *
 * Constraints met:
 *   - $186 recovery figure IS shown here (PostCaseReport, not Outcomes — per pressure test)
 *   - Genesis Primary Green #81D24C on screen (Export CTA + indicators)
 *   - One primary CTA: Export Report
 *   - Preference card update is informational only — no auto-update action
 *   - No Kermit, no Meperia, no substitute recommendations
 *
 * Assumption: always shows samplePostCaseReport (CASE-2026-0831, Tue 26 May).
 */

import { Download, GitCompare, CheckCircle, AlertTriangle, ClipboardList } from 'lucide-react'
import { samplePostCaseReport } from '../data/syntheticData'

function ChargeBadge({ status }) {
  if (status === 'GAP') {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
        style={{ backgroundColor: '#F9EBEA', color: '#CB4630' }}
      >
        <AlertTriangle size={10} />
        Gap
      </span>
    )
  }
  return (
    <span className="text-xs font-medium" style={{ color: '#009999' }}>
      Yes
    </span>
  )
}

function CategoryBadge({ category }) {
  const styles = {
    PPI:        { bg: '#F9EBEA', color: '#CB4630' },
    STANDARD:   { bg: '#E3E3E3', color: '#545F66' },
    CONSUMABLE: { bg: '#e4f7ff', color: '#006FDD' },
  }
  const s = styles[category] || styles.STANDARD
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {category}
    </span>
  )
}

function DeltaCell({ delta }) {
  if (typeof delta === 'number') {
    if (delta > 0) {
      return <span className="font-semibold text-sm" style={{ color: '#F18F01' }}>+{delta}</span>
    }
    if (delta < 0) {
      return <span className="font-medium text-sm" style={{ color: '#909BA6' }}>{delta}</span>
    }
    return <span className="font-medium text-sm" style={{ color: '#81D24C' }}>0</span>
  }
  return <span className="font-semibold text-sm" style={{ color: '#CB4630' }}>{delta}</span>
}

export default function PostCaseReport({ navigate }) {
  const r = samplePostCaseReport

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate('todaysOR')}
        className="flex items-center gap-1 text-sm font-medium mb-6 transition-colors"
        style={{ color: '#006FDD' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#2D4CC7')}
        onMouseLeave={e => (e.currentTarget.style.color = '#006FDD')}
      >
        ← Back to Today's OR
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#daffd1' }}
            >
              <GitCompare size={20} style={{ color: '#42A800' }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#2F2D2E' }}>Post-Case Report</h1>
              <p className="text-sm mt-0.5" style={{ color: '#909BA6' }}>
                {r.procedure} · {r.surgeon} · {r.date} · {r.orRoom}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#909BA6' }}>
                Report generated at {r.reportGeneratedAt} (T+4h) · Preference card {r.preferenceCardVersion} · {r.totalLineItems} total line items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#FFFFD6', color: '#9D5D01' }}
            >
              <AlertTriangle size={14} />
              {r.variances} variances flagged
            </span>
            {/* Primary CTA — one per screen */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: '#81D24C', color: '#030303' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#42A800')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#81D24C')}
              onClick={() => {}}
            >
              <Download size={15} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Items matched */}
        <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={15} style={{ color: '#009999' }} />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#909BA6' }}
            >
              Items Matched
            </span>
          </div>
          <div className="text-4xl font-bold mb-1" style={{ color: '#009999' }}>
            {r.matched}
          </div>
          <p className="text-sm" style={{ color: '#909BA6' }}>
            of {r.totalLineItems} line items · on card + used ✓
          </p>
        </div>

        {/* Variances */}
        <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} style={{ color: '#F18F01' }} />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#909BA6' }}
            >
              Variances
            </span>
          </div>
          <div className="text-4xl font-bold mb-1" style={{ color: '#F18F01' }}>
            {r.variances}
          </div>
          <p className="text-sm" style={{ color: '#909BA6' }}>
            items with quantity delta or missing scan
          </p>
        </div>

        {/* Charge capture gap */}
        <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} style={{ color: '#CB4630' }} />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#909BA6' }}
            >
              Charge Capture Gap
            </span>
          </div>
          <div className="text-4xl font-bold mb-1" style={{ color: '#CB4630' }}>
            {r.chargeGaps}
          </div>
          <p className="text-sm" style={{ color: '#909BA6' }}>
            ${r.chargeCaptureSummary.estimatedRecoveryValue} recovery opportunity ·{' '}
            {r.chargeCaptureSummary.confidence.toLowerCase()} confidence
          </p>
        </div>
      </div>

      {/* Variance detail table */}
      <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E3E3E3] flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: '#2F2D2E' }}>
            Variance Detail
          </h2>
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: '#909BA6' }}
          >
            PoC scan reconciliation · {r.date}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F5F3EF' }}>
                {[
                  { label: 'Item', align: 'left',   px: 'px-6' },
                  { label: 'On Card',  align: 'center', px: 'px-4' },
                  { label: 'Scanned',  align: 'center', px: 'px-4' },
                  { label: 'Qty Card', align: 'center', px: 'px-4' },
                  { label: 'Qty Used', align: 'center', px: 'px-4' },
                  { label: 'Delta',    align: 'center', px: 'px-4' },
                  { label: 'Category', align: 'center', px: 'px-4' },
                  { label: 'Charge',   align: 'center', px: 'px-4' },
                ].map(col => (
                  <th
                    key={col.label}
                    className={`text-${col.align} ${col.px} py-3 text-xs font-semibold uppercase tracking-wider`}
                    style={{ color: '#909BA6' }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.varianceItems.map((item, idx) => {
                const isGap = item.chargeCaptured === 'GAP'
                return (
                  <tr
                    key={item.sku}
                    className="border-t border-[#E3E3E3]"
                    style={{ backgroundColor: isGap ? '#FEF6F5' : undefined }}
                  >
                    {/* Item */}
                    <td className="px-6 py-4">
                      <p className="font-medium" style={{ color: '#2F2D2E' }}>{item.description}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#909BA6' }}>{item.sku}</p>
                      {item.note && (
                        <p className="text-xs italic mt-1" style={{ color: '#909BA6' }}>{item.note}</p>
                      )}
                    </td>
                    {/* On card */}
                    <td className="px-4 py-4 text-center text-sm font-medium">
                      {item.onCard
                        ? <span style={{ color: '#81D24C' }}>Yes</span>
                        : <span style={{ color: '#CB4630' }}>No</span>
                      }
                    </td>
                    {/* Scanned */}
                    <td className="px-4 py-4 text-center text-sm font-medium">
                      {item.scannedAtPoC
                        ? <span style={{ color: '#81D24C' }}>Yes</span>
                        : <span style={{ color: '#909BA6' }}>No</span>
                      }
                    </td>
                    {/* Qty on card */}
                    <td className="px-4 py-4 text-center font-medium" style={{ color: '#2F2D2E' }}>
                      {item.qtyOnCard}
                    </td>
                    {/* Qty used */}
                    <td className="px-4 py-4 text-center font-medium" style={{ color: '#2F2D2E' }}>
                      {item.qtyUsed}
                    </td>
                    {/* Delta */}
                    <td className="px-4 py-4 text-center">
                      <DeltaCell delta={item.delta} />
                    </td>
                    {/* Category */}
                    <td className="px-4 py-4 text-center">
                      <CategoryBadge category={item.category} />
                    </td>
                    {/* Charge captured */}
                    <td className="px-4 py-4 text-center">
                      <ChargeBadge status={item.chargeCaptured} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer — matched count */}
        <div
          className="px-6 py-3 border-t border-[#E3E3E3]"
          style={{ backgroundColor: '#F5F3EF' }}
        >
          <p className="text-xs" style={{ color: '#909BA6' }}>
            <span style={{ color: '#81D24C' }}>✓</span>{' '}
            {r.matched} of {r.totalLineItems} items matched — on card, scanned, and correct quantity
          </p>
        </div>
      </div>

      {/* Preference card update recommendation */}
      {r.preferenceCardUpdateRecommendation.triggered && (
        <div
          className="rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: '#8BFFFF', backgroundColor: '#EEFFFF' }}
        >
          <div className="px-6 py-5">
            <div className="flex items-start gap-3">
              <ClipboardList size={18} style={{ color: '#009999' }} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-sm font-semibold" style={{ color: '#095256' }}>
                    Preference card update recommended
                  </h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{ backgroundColor: '#CCFFFF', color: '#009999' }}
                  >
                    Informational only — no auto-update action
                  </span>
                </div>
                <p className="text-sm mb-2 leading-relaxed" style={{ color: '#2F2D2E' }}>
                  {r.preferenceCardUpdateRecommendation.reason}
                </p>
                <p className="text-sm font-medium mb-2" style={{ color: '#095256' }}>
                  Suggested: {r.preferenceCardUpdateRecommendation.suggestedUpdate}
                </p>
                <p className="text-xs" style={{ color: '#545F66' }}>
                  {r.preferenceCardUpdateRecommendation.actionRequired}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
