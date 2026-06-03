import { useState } from 'react'
import { agentLogEntries, agentRun, hospitalContext, scheduledCases } from '../data/syntheticData'
import { Zap, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react'

/* ── Colour + style per entry type ─────────────────────────── */
const typeStyle = {
  SUCCESS:  { color: '#009999', indent: false },
  WARNING:  { color: '#F18F01', indent: false },
  DECISION: { color: '#F18F01', indent: false, bold: true },
  CASE:     { color: '#FFFFFF', indent: false, section: true },
  INFO:     { color: '#909BA6', indent: false },
}

function isSubEntry(text) {
  return text.trimStart().startsWith('→')
}

/* ── Single log line ────────────────────────────────────────── */
function LogLine({ entry }) {
  const style  = typeStyle[entry.type] ?? typeStyle.INFO
  const isSub  = isSubEntry(entry.text)
  const isDecision = entry.type === 'DECISION'

  if (style.section) {
    return (
      <div className="flex gap-4 py-2 mt-2 border-t border-b" style={{ borderColor: '#1e2530' }}>
        <span
          className="flex-shrink-0 font-mono text-sm select-none"
          style={{ color: '#009999', minWidth: '70px' }}
        >
          [{entry.time}]
        </span>
        <span
          className="font-mono text-sm font-bold tracking-wide"
          style={{ color: '#FFFFFF' }}
        >
          {entry.text}
        </span>
      </div>
    )
  }

  return (
    <div
      className="flex gap-4 py-0.5"
      style={isDecision ? { backgroundColor: 'rgba(241,143,1,0.08)', borderRadius: '4px' } : {}}
    >
      <span
        className="flex-shrink-0 font-mono text-sm select-none"
        style={{ color: '#009999', minWidth: '70px' }}
      >
        {isSub ? '' : `[${entry.time}]`}
      </span>
      <span
        className="font-mono text-sm"
        style={{
          color:      style.color,
          fontWeight: isDecision ? 600 : 400,
          paddingLeft: isSub ? '16px' : '0',
        }}
      >
        {entry.text}
      </span>
    </div>
  )
}

/* ── Summary stat pill ──────────────────────────────────────── */
function StatPill({ label, value, color }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E3E3E3] bg-white">
      <span className="text-lg font-bold" style={{ color, fontFamily: 'inherit' }}>{value}</span>
      <span className="text-xs text-[#909BA6]">{label}</span>
    </div>
  )
}

/* ── Main view ──────────────────────────────────────────────── */
export default function AgentLog() {
  const fileName = `case-readiness-run-2026-05-29-0200.log`
  const [activeTab, setActiveTab] = useState('terminal')

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#2F2D2E]">Agent Log</h1>
          <p className="text-sm text-[#909BA6] mt-1">
            {hospitalContext.name} · Nightly run Fri 29 May 2026 · 02:00am
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#E3E3E3] shadow-sm flex-shrink-0 mt-1">
          <Zap size={14} style={{ color: '#81D24C' }} />
          <span className="text-sm font-medium text-[#2F2D2E]">
            {agentRun.status}
          </span>
          <span className="text-xs text-[#909BA6] ml-1">
            · {agentRun.runDurationSeconds}s
          </span>
        </div>
      </div>

      {/* Run summary strip */}
      <div className="flex items-center gap-3 mb-6">
        <StatPill
          label="SKUs monitored"
          value={agentRun.totalSKUsMonitored.toLocaleString()}
          color="#2F2D2E"
        />
        <StatPill
          label="auto-handled overnight"
          value={agentRun.autoHandledOvernight}
          color="#009999"
        />
        <StatPill
          label="decisions pending"
          value={agentRun.decisionsRequiringHuman}
          color="#F18F01"
        />
        <StatPill
          label="log entries"
          value={agentLogEntries.length}
          color="#909BA6"
        />
      </div>

      {/* Tab buttons */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'summary',  label: 'Plain-English Summary' },
          { id: 'terminal', label: 'Full Terminal Log' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
            style={{
              backgroundColor: activeTab === tab.id ? '#095256' : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : '#909BA6',
              borderColor: activeTab === tab.id ? '#095256' : '#E3E3E3',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary tab */}
      {activeTab === 'summary' && (
        <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6">
          <p className="text-lg font-bold text-[#2F2D2E] mb-5">What the agent did last night</p>
          <ul className="space-y-3 mb-5">
            {[
              `Checked ${agentRun.totalSKUsMonitored} SKUs across ${scheduledCases.length} cases scheduled for ${agentRun.date}`,
              `Found 3 supply gaps — 1 auto-reordered (BoneFix-2 Bone Cement, $180), 2 escalated to your team (PPI items)`,
              `Sent loan kit request to Sarah Mitchell at DePuy Synthes for Tibial Component XR-7 (2 sizes, 4 units total)`,
              `All ${scheduledCases.length} cases re-scored: 1 AT RISK (readiness 42), 1 WATCH (readiness 68), 1 CLEAR (readiness 91)`,
              `Detected preference card drift: Dr. Chen has used Tibial 44mm in 8/15 recent cases — 42mm still on card`,
            ].map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#009999' }} />
                <span className="text-sm text-[#2F2D2E] leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#909BA6] border-t border-[#E3E3E3] pt-4">
            Run completed in {agentRun.runDurationSeconds}s at {agentRun.lastRun} · {agentRun.decisionsRequiringHuman} decisions waiting for your team
          </p>
        </div>
      )}

      {/* Terminal window */}
      {activeTab === 'terminal' && (
      <>
      <div className="rounded-xl overflow-hidden shadow-lg border border-[#0e1117]">

        {/* macOS-style header bar */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ backgroundColor: '#1a1f2a' }}
        >
          {/* Traffic light circles */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#CB4630' }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F18F01' }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#81D24C' }} />
          </div>
          {/* File name */}
          <span
            className="text-xs font-mono mx-auto"
            style={{ color: '#909BA6' }}
          >
            {fileName}
          </span>
          {/* Run duration right-aligned */}
          <span className="text-xs font-mono" style={{ color: '#009999' }}>
            COMPLETED · {agentRun.runDurationSeconds}s
          </span>
        </div>

        {/* Log body */}
        <div
          className="px-6 py-5 overflow-y-auto"
          style={{ backgroundColor: '#0e1117', maxHeight: '600px' }}
        >
          {/* Cursor blink intro line */}
          <div className="flex gap-4 mb-3">
            <span className="font-mono text-sm" style={{ color: '#545F66' }}>
              genesis-case-readiness v1.0 · {hospitalContext.genesisInstance}
            </span>
          </div>

          <div className="space-y-0.5">
            {agentLogEntries.map((entry, i) => (
              <LogLine key={i} entry={entry} />
            ))}
          </div>

          {/* Terminal cursor */}
          <div className="flex gap-4 mt-4">
            <span className="font-mono text-sm" style={{ color: '#909BA6' }}>
              {'>'}&nbsp;
              <span
                className="inline-block w-2 h-4 align-middle animate-pulse"
                style={{ backgroundColor: '#009999' }}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 px-1">
        {[
          { color: '#009999', label: 'Auto-resolved / data connected' },
          { color: '#F18F01', label: 'Warning / escalation decision' },
          { color: '#FFFFFF', label: 'Case section header' },
          { color: '#909BA6', label: 'Informational' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #545F66' : 'none' }} />
            <span className="text-xs text-[#909BA6]">{label}</span>
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  )
}
