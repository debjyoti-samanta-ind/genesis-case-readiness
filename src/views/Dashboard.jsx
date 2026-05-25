import { currentUser, agentRun, scheduledCases } from '../data/syntheticData'
import StatusBadge from '../components/StatusBadge'
import { Zap } from 'lucide-react'

const statusLabel = { AT_RISK: 'AT RISK', WATCH: 'WATCH', CLEAR: 'CLEAR' }

export default function Dashboard({ navigate }) {
  const atRisk  = scheduledCases.filter(c => c.status === 'AT_RISK').length
  const watch   = scheduledCases.filter(c => c.status === 'WATCH').length
  const clear   = scheduledCases.filter(c => c.status === 'CLEAR').length

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2F2D2E]">
          Good morning, {currentUser.name}
        </h1>
        <p className="text-[#909BA6] mt-1">
          {currentUser.role} · {currentUser.hospital} · {currentUser.date}
        </p>
      </div>

      {/* Agent status pill */}
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#E3E3E3] shadow-sm mb-8">
        <Zap size={14} className="text-[#81D24C]" />
        <span className="text-sm text-[#2F2D2E]">
          Agent ran at {agentRun.lastRun} · {scheduledCases.length} cases monitored · {agentRun.autoHandledOvernight} auto-handled
        </span>
        <span className="ml-2 text-xs font-medium text-[#009999] bg-[#EEFFFF] px-2 py-0.5 rounded">
          {agentRun.status}
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">Cases Today</p>
          <p className="text-4xl font-bold text-[#2F2D2E] mb-3">{scheduledCases.length}</p>
          <div className="flex gap-2 flex-wrap">
            <StatusBadge status="AT_RISK" />
            <span className="text-xs text-[#2F2D2E]">×{atRisk}</span>
            <StatusBadge status="WATCH" />
            <span className="text-xs text-[#2F2D2E]">×{watch}</span>
            <StatusBadge status="CLEAR" />
            <span className="text-xs text-[#2F2D2E]">×{clear}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">Agent Actions</p>
          <p className="text-4xl font-bold text-[#009999] mb-1">{agentRun.autoHandledOvernight}</p>
          <p className="text-sm text-[#909BA6]">Auto-resolved overnight</p>
          <p className="text-sm text-[#F18F01] font-medium mt-2">{agentRun.decisionsRequiringHuman} pending human decisions</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">OR Readiness</p>
          <p className="text-base font-semibold text-[#CB4630] mb-1">TKA ×2 — AT RISK</p>
          <p className="text-sm text-[#909BA6]">T-48h checkpoint · PPI gap open</p>
          <p className="text-xs text-[#909BA6] mt-1">Tibial Component XR-7 — vendor rep no response (26h)</p>
        </div>
      </div>

      {/* Escalation queue preview */}
      <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm">
        <div className="px-6 py-4 border-b border-[#E3E3E3]">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6]">Escalated Decisions</p>
          <p className="text-sm text-[#909BA6] mt-0.5">{agentRun.decisionsRequiringHuman} items require your action</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FCFCFC] border-b border-[#E3E3E3]">
                {['Case', 'Checkpoint', 'Item', 'Gap', 'Risk', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#909BA6] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E3E3E3] hover:bg-[#FCFCFC]">
                <td className="px-5 py-4 text-sm font-medium text-[#2F2D2E]">TKA ×2 — Dr. Chen</td>
                <td className="px-5 py-4 text-sm text-[#909BA6]">T-48h</td>
                <td className="px-5 py-4 text-sm text-[#2F2D2E]">Tibial Component XR-7</td>
                <td className="px-5 py-4"><StatusBadge status="PPI" /></td>
                <td className="px-5 py-4"><StatusBadge status="AT_RISK" /></td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => navigate('todaysOR')}
                    className="text-xs font-medium text-white bg-[#095256] hover:bg-[#009999] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Review →
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[#FCFCFC]">
                <td className="px-5 py-4 text-sm font-medium text-[#2F2D2E]">Hip Arthroplasty — Dr. Rodriguez</td>
                <td className="px-5 py-4 text-sm text-[#909BA6]">T-48h</td>
                <td className="px-5 py-4 text-sm text-[#2F2D2E]">Femoral Head 36mm</td>
                <td className="px-5 py-4 text-sm text-[#909BA6]">Card change detected</td>
                <td className="px-5 py-4"><StatusBadge status="WATCH" /></td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => navigate('todaysOR')}
                    className="text-xs font-medium text-white bg-[#095256] hover:bg-[#009999] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Review →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
