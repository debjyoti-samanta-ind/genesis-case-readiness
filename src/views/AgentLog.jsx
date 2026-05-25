import { agentLogEntries, agentRun } from '../data/syntheticData'

export default function AgentLog() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2F2D2E]">Agent Log</h1>
        <p className="text-[#909BA6] mt-1">
          case-readiness-run-2026-05-29-0200.log · {agentRun.runDurationSeconds}s · {agentLogEntries.length} entries
        </p>
      </div>

      {/* Phase 4 will build the full terminal view here */}
      <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#daffd1] text-[#42A800] text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-[#81D24C]" />
          Phase 4 — Full terminal reasoning view coming next
        </div>
        <p className="text-[#909BA6] text-sm">
          {agentLogEntries.length} log entries loaded · Run completed in {agentRun.runDurationSeconds}s
        </p>
      </div>
    </div>
  )
}
