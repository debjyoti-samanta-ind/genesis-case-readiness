import { useState } from 'react'
import { scheduledCases, checkpointStates, detectedGaps, vendorReps, preferenceCards } from '../data/syntheticData'
import CaseCard from '../components/CaseCard'
import CheckpointTimeline from '../components/CheckpointTimeline'

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

  const handleAction = (escId) => {
    setActionedEscalations(prev => new Set([...prev, escId]))
  }

  const selectedCase = scheduledCases.find(c => c.id === selectedCaseId)
  const checkpoints = checkpointStates[selectedCaseId] || {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2F2D2E]">Today's OR</h1>
        <p className="text-[#909BA6] mt-1">Thu 29 May 2026 · 3 cases scheduled · Agent run: 02:00am</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left panel: case list */}
        <div
          className="w-72 flex-shrink-0 rounded-xl border border-[#E3E3E3] shadow-sm overflow-hidden sticky top-0"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="px-4 py-3 border-b border-[#E3E3E3]">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#909BA6' }}>
              3 Cases Today
            </p>
          </div>
          {scheduledCases.map(c => (
            <CaseCard
              key={c.id}
              caseData={c}
              isSelected={c.id === selectedCaseId}
              onClick={() => setSelectedCaseId(c.id)}
              liveStatus={getLiveStatus(c, actionedEscalations)}
            />
          ))}
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
                caseId={selectedCaseId}
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
