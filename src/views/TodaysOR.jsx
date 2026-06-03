import { useState, useEffect } from 'react'
import { scheduledCases, checkpointStates, detectedGaps, vendorReps, preferenceCards, agentRun } from '../data/syntheticData'
import CaseCard from '../components/CaseCard'
import CheckpointTimeline from '../components/CheckpointTimeline'
import StatusBadge from '../components/StatusBadge'

function getLiveStatus(caseData, actionedEscalations) {
  if (caseData.status !== 'AT_RISK') return caseData.status
  const allCheckpoints = checkpointStates[caseData.id] || {}
  const actionableHighEscs = Object.values(allCheckpoints)
    .flatMap(cp => cp.escalations || [])
    .filter(esc => esc.riskLevel === 'HIGH' && esc.mvpNote !== undefined)
  if (actionableHighEscs.length > 0 && actionableHighEscs.every(e => actionedEscalations.has(e.id))) {
    return 'WATCH'
  }
  return 'AT_RISK'
}

export default function TodaysOR({ navigate, selectedCaseId: propCaseId }) {
  const [selectedCaseId, setSelectedCaseId] = useState(propCaseId || 'CASE-2026-0847')
  const [actionedEscalations, setActionedEscalations] = useState(new Set())
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    if (propCaseId) setSelectedCaseId(propCaseId)
  }, [propCaseId])

  const handleAction = (escId) => {
    setActionedEscalations(prev => new Set([...prev, escId]))
  }

  const filteredCases = statusFilter === 'ALL' ? scheduledCases : scheduledCases.filter(c => c.status === statusFilter)

  // Auto-select first visible case if current selection is filtered out
  useEffect(() => {
    if (filteredCases.length > 0 && !filteredCases.find(c => c.id === selectedCaseId)) {
      setSelectedCaseId(filteredCases[0].id)
    }
  }, [statusFilter])

  const selectedCase = filteredCases.find(c => c.id === selectedCaseId) || filteredCases[0]
  const checkpoints = checkpointStates[selectedCase?.id || selectedCaseId] || {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2F2D2E]">Today's OR</h1>
        <p className="text-[#909BA6] mt-1">{agentRun.date} · {scheduledCases.length} cases scheduled · Agent run: {agentRun.lastRun}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left panel: case list */}
        <div
          className="w-full lg:w-72 lg:flex-shrink-0 rounded-xl border border-[#E3E3E3] shadow-sm overflow-hidden lg:sticky top-0"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="px-4 py-3 border-b border-[#E3E3E3]">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#909BA6' }}>
              {scheduledCases.length} Cases Today
            </p>
            <p className="text-xs mb-2" style={{ color: '#C8CDD2' }}>
              Score: &lt;60 = AT RISK · 60–79 = WATCH · 80+ = CLEAR
            </p>
            {/* Status filter pills (P3.3) */}
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: 'AT_RISK', label: 'AT RISK', color: '#CB4630' },
                { id: 'WATCH',   label: 'WATCH',   color: '#F18F01' },
                { id: 'CLEAR',   label: 'CLEAR',   color: '#009999' },
              ].map(f => {
                const isActive = statusFilter === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(isActive ? 'ALL' : f.id)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors"
                    style={{
                      backgroundColor: isActive ? f.color : 'transparent',
                      color: isActive ? '#ffffff' : '#909BA6',
                      borderColor: isActive ? f.color : '#C8CDD2',
                    }}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>
          </div>
          {filteredCases.length === 0 && (
            <p className="px-4 py-3 text-xs italic text-[#909BA6]">No cases match this filter.</p>
          )}
          {filteredCases.map(c => (
            <CaseCard
              key={c.id}
              caseData={c}
              isSelected={c.id === (selectedCase?.id)}
              onClick={() => setSelectedCaseId(c.id)}
              liveStatus={getLiveStatus(c, actionedEscalations)}
            />
          ))}

          {/* Completed cases — access post-case report */}
          <div className="border-t border-[#E3E3E3]">
            <div className="px-4 py-2.5">
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#909BA6' }}
              >
                Recent · Completed
              </p>
            </div>
            <button
              onClick={() => navigate('postCase')}
              className="w-full px-4 py-3 text-left border-t border-[#E3E3E3] transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F3EF')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#2F2D2E' }}>
                    Total Knee Arthroplasty
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#909BA6' }}>
                    Dr. Michael Chen · Tue 26 May · OR-3
                  </p>
                </div>
                <div className="flex-shrink-0 mt-0.5">
                  <StatusBadge status="COMPLETED" />
                </div>
              </div>
              <p className="text-xs mt-1.5 font-medium" style={{ color: '#006FDD' }}>
                View post-case report →
              </p>
            </button>
          </div>
        </div>

        {/* Right panel: case detail */}
        <div className="flex-1 min-w-0">
          {selectedCase && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2F2D2E]">
                  {selectedCase.procedure}{selectedCase.count > 1 ? ` ×${selectedCase.count}` : ''}
                </h2>
                <p className="mt-1" style={{ color: '#909BA6' }}>
                  {selectedCase.surgeons.join(' · ')} · {selectedCase.scheduledTime} · {selectedCase.orRoom}
                </p>
              </div>

              <CheckpointTimeline
                caseId={selectedCase.id}
                checkpoints={checkpoints}
                actionedEscalations={actionedEscalations}
                onAction={handleAction}
                detectedGaps={detectedGaps}
                vendorReps={vendorReps}
                preferenceCards={preferenceCards}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
