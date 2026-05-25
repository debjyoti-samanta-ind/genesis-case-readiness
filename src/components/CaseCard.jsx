import StatusBadge from './StatusBadge'

function getScoreColor(score) {
  if (score >= 75) return '#81D24C'
  if (score >= 40) return '#F18F01'
  return '#CB4630'
}

export default function CaseCard({ caseData, isSelected, onClick, liveStatus }) {
  const { procedure, count, surgeons, scheduledTime, orRoom, readinessScore } = caseData
  const scoreColor = getScoreColor(readinessScore)

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 border-b border-[#E3E3E3] transition-colors"
      style={{
        backgroundColor: isSelected ? '#f0fafa' : '#ffffff',
        borderLeft: `3px solid ${isSelected ? '#095256' : 'transparent'}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-[#2F2D2E] leading-tight">
          {procedure}{count > 1 ? ` ×${count}` : ''}
        </p>
        <div className="flex-shrink-0">
          <StatusBadge status={liveStatus} />
        </div>
      </div>

      <p className="text-xs text-[#909BA6] mb-0.5">{surgeons.join(', ')}</p>
      <p className="text-xs text-[#909BA6] mb-3">{scheduledTime} · {orRoom}</p>

      {/* Readiness score bar */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-xs text-[#909BA6]">Readiness</span>
          <span className="text-xs font-semibold" style={{ color: scoreColor }}>
            {readinessScore}/100
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E3E3E3' }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${readinessScore}%`, backgroundColor: scoreColor }}
          />
        </div>
      </div>
    </button>
  )
}
