import { useState } from 'react'
import { ChevronDown, ChevronRight, CheckCircle, Phone } from 'lucide-react'
import StatusBadge from './StatusBadge'

const CHECKPOINT_ORDER = ['T72h', 'T48h', 'T24h', 'T4h', 'PostCase']
const CHECKPOINT_LABELS = {
  T72h:     'T-72h',
  T48h:     'T-48h',
  T24h:     'T-24h',
  T4h:      'T-4h',
  PostCase: 'Post-case',
}

function formatSentAt(isoString) {
  const d = new Date(isoString)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  return `${days[d.getUTCDay()]} ${d.getUTCDate()} ${months[d.getUTCMonth()]} ${hh}:${mm}`
}

function formatLastUpdated(dateStr) {
  const [year, month, day] = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
}

export default function CheckpointTimeline({
  caseId, checkpoints, actionedEscalations, onAction,
  detectedGaps, vendorReps, preferenceCards,
}) {
  const [expandedAccordions, setExpandedAccordions] = useState(new Set())

  const toggleAccordion = (key) => {
    setExpandedAccordions(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const caseGaps = detectedGaps.filter(g => g.caseId === caseId && g.ppiFlag)
  const primaryGap = caseGaps[0]
  const vendorRep = vendorReps.find(r => r.loanKitRequest !== null)
  const prefCard = preferenceCards[caseId]

  return (
    <div>
      {CHECKPOINT_ORDER.map((key, idx) => {
        const cp = checkpoints[key]
        if (!cp) return null
        const isLast = idx === CHECKPOINT_ORDER.length - 1
        const expanded = expandedAccordions.has(key)

        let nodeBg, nodeBorder
        if (cp.status === 'COMPLETED') {
          nodeBg = '#009999'; nodeBorder = '#009999'
        } else if (cp.status === 'ACTIVE') {
          nodeBg = '#F18F01'; nodeBorder = '#F18F01'
        } else {
          nodeBg = 'transparent'; nodeBorder = '#C8CDD2'
        }

        return (
          <div key={key} className="flex gap-5">
            {/* Timeline node + connector */}
            <div className="flex flex-col items-center w-4 flex-shrink-0">
              <div
                className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0"
                style={{ backgroundColor: nodeBg, border: `2px solid ${nodeBorder}` }}
              />
              {!isLast && (
                <div className="w-px flex-1 min-h-8 mt-1" style={{ backgroundColor: '#E3E3E3' }} />
              )}
            </div>

            {/* Checkpoint content */}
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2 mb-3 mt-0.5">
                <span className="text-sm font-bold text-[#2F2D2E]">{CHECKPOINT_LABELS[key]}</span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor:
                      cp.status === 'COMPLETED' ? '#E0F7F7' :
                      cp.status === 'ACTIVE'    ? '#FFF3E0' : '#F5F5F5',
                    color:
                      cp.status === 'COMPLETED' ? '#009999' :
                      cp.status === 'ACTIVE'    ? '#F18F01' : '#909BA6',
                  }}
                >
                  {cp.status}
                </span>
              </div>

              {/* Auto-resolved accordion */}
              {cp.autoResolved.length > 0 && (
                <div className="mb-3">
                  <button
                    onClick={() => toggleAccordion(key)}
                    className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                    style={{ color: '#009999' }}
                  >
                    {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    <CheckCircle size={12} />
                    <span>{cp.autoResolved.length} action{cp.autoResolved.length !== 1 ? 's' : ''} auto-resolved</span>
                  </button>
                  {expanded && (
                    <div
                      className="mt-2 ml-5 space-y-2 pl-3 border-l-2"
                      style={{ borderColor: '#E3E3E3' }}
                    >
                      {cp.autoResolved.map((item, i) => (
                        <div key={i} className="text-xs">
                          <span className="font-medium text-[#2F2D2E]">{item.action}</span>
                          <span className="text-[#909BA6]"> — {item.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Escalation cards */}
              {cp.escalations.map(esc => {
                const isActioned = actionedEscalations.has(esc.id)
                const hasVendorDetail = esc.mvpNote !== undefined
                const badgeStatus = hasVendorDetail ? 'ESCALATED' : 'PPI'

                return (
                  <div
                    key={esc.id}
                    className="rounded-lg border mb-3"
                    style={{
                      borderColor: hasVendorDetail ? '#F18F01' : '#CB4630',
                      backgroundColor: hasVendorDetail ? '#FFFBF2' : '#FDF2F0',
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-semibold text-[#2F2D2E] leading-snug">{esc.item}</p>
                        <div className="flex-shrink-0">
                          <StatusBadge status={badgeStatus} />
                        </div>
                      </div>

                      <p className="text-xs text-[#909BA6] mb-2 leading-relaxed">{esc.reason}</p>

                      <p className="text-xs mb-4">
                        <span className="font-semibold" style={{ color: '#F18F01' }}>Recommended: </span>
                        <span className="text-[#2F2D2E]">{esc.recommendedAction}</span>
                      </p>

                      {/* Supply item detail — ESC-002 only */}
                      {hasVendorDetail && primaryGap && vendorRep && (
                        <div
                          className="rounded-md p-3 mb-4 space-y-2.5"
                          style={{ backgroundColor: '#F5F3EF' }}
                        >
                          {/* Vendor rep contact — top of card for quick action */}
                          <div
                            className="flex items-center gap-2 pb-2.5 mb-0.5"
                            style={{ borderBottom: '1px solid #E3E3E3' }}
                          >
                            <Phone size={13} style={{ color: '#009999' }} />
                            <span className="text-xs font-semibold text-[#2F2D2E]">
                              {vendorRep.name} · {vendorRep.company}
                            </span>
                            <span className="text-xs font-medium" style={{ color: '#009999' }}>
                              {vendorRep.phone}
                            </span>
                            <span className="text-xs" style={{ color: '#006FDD' }}>
                              {vendorRep.email}
                            </span>
                          </div>

                          <div className="text-xs">
                            <span className="font-medium text-[#2F2D2E]">{primaryGap.description}</span>
                            <span className="text-[#909BA6]">
                              {' '}— {primaryGap.onHand} on hand · {primaryGap.required} required · Deficit {primaryGap.deficit}
                            </span>
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs text-[#909BA6]">
                              Loan kit request sent: {formatSentAt(vendorRep.loanKitRequest.sentAt)} · {vendorRep.loanKitRequest.hoursElapsed}h since sent — no response detected
                            </span>
                            <div className="flex-shrink-0">
                              <StatusBadge status="MVP" />
                            </div>
                          </div>

                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs text-[#909BA6]">
                              PO status: {vendorRep.poOutstandingOrders.status} · {vendorRep.poOutstandingOrders.poNumber}
                            </span>
                            <div className="flex-shrink-0">
                              <StatusBadge status="MVP" />
                            </div>
                          </div>

                          {prefCard && (
                            <div className="text-xs text-[#909BA6]">
                              Preference card: {prefCard.cardId} {prefCard.version} · Updated {formatLastUpdated(prefCard.lastUpdated)}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action button or status indicator */}
                      {hasVendorDetail ? (
                        isActioned ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle size={15} style={{ color: '#81D24C' }} />
                            <span className="text-sm font-semibold" style={{ color: '#42A800' }}>Actioned ✓</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onAction(esc.id)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                            style={{ backgroundColor: '#81D24C', color: '#030303' }}
                          >
                            Mark as actioned
                          </button>
                        )
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#CB4630' }} />
                          <span className="text-xs font-medium" style={{ color: '#CB4630' }}>
                            Pending SC Director review — auto-reorder blocked per clinical governance
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {cp.status === 'PENDING' && cp.autoResolved.length === 0 && cp.escalations.length === 0 && (
                <p className="text-xs italic" style={{ color: '#C8CDD2' }}>Not yet reached</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
