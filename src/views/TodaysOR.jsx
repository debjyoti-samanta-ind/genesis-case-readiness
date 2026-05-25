import { scheduledCases } from '../data/syntheticData'
import StatusBadge from '../components/StatusBadge'

export default function TodaysOR({ navigate }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2F2D2E]">Today's OR</h1>
        <p className="text-[#909BA6] mt-1">Thu 29 May 2026 · Valley Regional Medical Center · {scheduledCases.length} cases scheduled</p>
      </div>

      {/* Phase 2 will build the full split-panel view here */}
      <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#daffd1] text-[#42A800] text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-[#81D24C]" />
          Phase 2 — Case detail + checkpoint timeline coming next
        </div>
        <p className="text-[#909BA6] text-sm">
          {scheduledCases.length} cases loaded · {scheduledCases.filter(c => c.status === 'AT_RISK').length} AT RISK · {scheduledCases.filter(c => c.status === 'WATCH').length} WATCH · {scheduledCases.filter(c => c.status === 'CLEAR').length} CLEAR
        </p>
        <div className="mt-6 flex gap-3 justify-center flex-wrap">
          {scheduledCases.map(c => (
            <div key={c.id} className="flex items-center gap-2 bg-[#FCFCFC] border border-[#E3E3E3] rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-[#2F2D2E]">{c.procedure} {c.count > 1 ? `×${c.count}` : ''}</span>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
