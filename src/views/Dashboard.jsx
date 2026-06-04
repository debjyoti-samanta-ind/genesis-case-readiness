import { useState } from 'react'
import { currentUser, perioperativeLeader, agentRun, scheduledCases, weeklyOutcomes, hospitalContext } from '../data/syntheticData'
import StatusBadge from '../components/StatusBadge'
import { Zap, TrendingUp, TrendingDown, X, ShoppingCart, Mail, AlertTriangle, CheckCircle } from 'lucide-react'

function AgentActionsModal({ onClose }) {
  const iconMap = {
    reorder: <ShoppingCart size={14} style={{ color: '#009999' }} />,
    email:   <Mail size={14} style={{ color: '#009999' }} />,
    drift:   <AlertTriangle size={14} style={{ color: '#F18F01' }} />,
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[#E3E3E3]">
          <div>
            <p className="text-base font-bold text-[#2F2D2E]">Agent Auto-Handled Overnight</p>
            <p className="text-xs text-[#909BA6] mt-0.5">Completed at 02:00:21am · {agentRun.autoHandledOvernight} actions · no human input required</p>
          </div>
          <button onClick={onClose} className="text-[#909BA6] hover:text-[#2F2D2E] transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-3">
          {agentRun.overnightAutoHandled.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-[#E3E3E3] p-4">
              <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#EEFFFF' }}>
                {iconMap[item.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2F2D2E]">{item.title}</p>
                <p className="text-xs text-[#545F66] mt-0.5">{item.detail}</p>
                <p className="text-xs text-[#909BA6] mt-1">{item.meta}</p>
                <p className="text-xs mt-1.5 font-medium" style={{ color: '#909BA6' }}>Case: {item.case}</p>
              </div>
              <CheckCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#81D24C' }} />
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-[#E3E3E3] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#095256' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const { summary } = weeklyOutcomes
const weeklyAutoResolved = weeklyOutcomes.dailyBreakdown.reduce((s, d) => s + d.autoResolved, 0)

export default function Dashboard({ navigate, role = 'periop' }) {
  const [showSetup, setShowSetup] = useState(true)
  const [showAgentActions, setShowAgentActions] = useState(false)
  const atRisk = scheduledCases.filter(c => c.status === 'AT_RISK').length
  const watch  = scheduledCases.filter(c => c.status === 'WATCH').length
  const clear  = scheduledCases.filter(c => c.status === 'CLEAR').length

  const isPeriop = role === 'periop'
  const activeUser = isPeriop ? perioperativeLeader : currentUser

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#2F2D2E]">
            Good morning, {activeUser.name}
          </h1>
          <p className="text-xs mt-1" style={{ color: '#909BA6' }}>
            {isPeriop ? 'OR Manager view' : 'Supply Chain view'} · {activeUser.hospital} · {activeUser.date}
          </p>
        </div>
        <button
          onClick={() => navigate(isPeriop ? 'todaysOR' : 'outcomes')}
          className="flex-shrink-0 mt-1 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#095256' }}
        >
          {isPeriop ? "Go to Today's OR →" : 'Go to Outcomes →'}
        </button>
      </div>

      {/* Setup Checklist (P4.2) */}
      {showSetup && (
        <div className="mb-6 bg-white rounded-xl border-l-4 border border-[#E3E3E3] shadow-sm" style={{ borderLeftColor: '#009999' }}>
          <div className="px-6 py-4">
            <div className="flex items-start justify-between gap-4 mb-1">
              <p className="text-sm font-bold text-[#2F2D2E]">Genesis Case Readiness — Setup Checklist</p>
              <button
                onClick={() => setShowSetup(false)}
                className="text-xs text-[#909BA6] hover:text-[#2F2D2E] flex-shrink-0 transition-colors"
              >
                Dismiss ✕
              </button>
            </div>
            <p className="text-xs text-[#909BA6] mb-4">
              {hospitalContext.name} · Instance {hospitalContext.genesisInstance} · Connected 25 May 2026
            </p>
            <div className="space-y-2">
              {[
                'Epic/Cloverleaf OR schedule feed — Active',
                'Surgeon preference cards imported — 12 surgeons · 847 SKUs indexed',
                'Genesis Inventory module connected — real-time stock levels',
                'Genesis PoC scan data — last 30 days ingested',
                'Agent schedule configured — daily 02:00am · alerting enabled',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-xs">
                  <span style={{ color: '#42A800' }}>✅</span>
                  <span className="text-[#2F2D2E]">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: '#909BA6' }}>
              All 5 connections active. Agent is fully operational. This checklist is shown to new users and can be re-accessed from Settings.
            </p>
          </div>
        </div>
      )}

      {/* Agent status pill */}
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#E3E3E3] shadow-sm mb-8">
        <Zap size={14} style={{ color: '#81D24C' }} />
        <span className="text-sm text-[#2F2D2E]">
          Agent ran at {agentRun.lastRun} · {scheduledCases.length} cases monitored · {agentRun.autoHandledOvernight} auto-handled
        </span>
        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded" style={{ color: '#009999', backgroundColor: '#EEFFFF' }}>
          {agentRun.status}
        </span>
      </div>

      {showAgentActions && <AgentActionsModal onClose={() => setShowAgentActions(false)} />}

      {isPeriop ? (
        <>
          {/* Periop: 3 summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">Cases Today</p>
              <p className="text-4xl font-bold text-[#2F2D2E] mb-3">{scheduledCases.length}</p>
              <div className="flex gap-2 flex-wrap items-center">
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
              <p className="text-4xl font-bold mb-1" style={{ color: '#009999' }}>{agentRun.autoHandledOvernight}</p>
              <p className="text-sm text-[#909BA6]">Auto-resolved overnight</p>
              <p className="text-sm font-medium mt-2" style={{ color: '#F18F01' }}>{agentRun.decisionsRequiringHuman} pending human decisions</p>
              <button
                onClick={() => setShowAgentActions(true)}
                className="text-xs mt-3 hover:underline"
                style={{ color: '#006FDD' }}
              >
                View actions →
              </button>
            </div>

            <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">OR Readiness</p>
              <p className="text-base font-semibold mb-1" style={{ color: '#CB4630' }}>TKA ×2 — AT RISK</p>
              <p className="text-sm text-[#909BA6]">T-48h checkpoint · PPI gap open</p>
              <p className="text-xs text-[#909BA6] mt-1">Tibial Component XR-7 — vendor rep no response (26h)</p>
            </div>
          </div>

          {/* Periop: escalation queue */}
          <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm">
            <div className="px-6 py-4 border-b border-[#E3E3E3]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6]">Escalated Decisions</p>
              <p className="text-sm text-[#909BA6] mt-0.5">1 for you to action · 1 pending SC Director</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FCFCFC] border-b border-[#E3E3E3]">
                    {['Case', 'Checkpoint', 'Item', 'Gap', 'Risk', 'Owner', 'Action'].map(h => (
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
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FDF2F0', color: '#CB4630' }}>
                        SC Director
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate('todaysOR', 'CASE-2026-0847')}
                        className="text-xs font-medium text-white px-3 py-1.5 rounded-lg transition-colors"
                        style={{ backgroundColor: '#095256' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#009999'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#095256'}
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
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#EEFFFF', color: '#095256' }}>
                        OR Manager
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => navigate('todaysOR', 'CASE-2026-0848')}
                        className="text-xs font-medium text-white px-3 py-1.5 rounded-lg transition-colors"
                        style={{ backgroundColor: '#095256' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#009999'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#095256'}
                      >
                        Review →
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* VP Supply Chain: hero insight banner */}
          <div
            className="rounded-xl border p-4 mb-6 flex items-start gap-3"
            style={{ backgroundColor: '#EEFFFF', borderColor: '#8BFFFF' }}
          >
            <Zap size={20} style={{ color: '#009999' }} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#095256' }}>
                <span className="text-lg font-bold" style={{ color: '#009999' }}>{weeklyAutoResolved}</span> autonomous agent actions this week — supply checks, gap resolutions, and vendor coordination without your team lifting a finger
              </p>
              <p className="text-xs mt-1" style={{ color: '#545F66' }}>
                {summary.autoResolutionRate}% auto-resolution rate · {summary.escalationsRaised} escalation{summary.escalationsRaised !== 1 ? 's' : ''} raised to your team · Apply your per-gap resolution time to calculate FTE hours recovered
              </p>
            </div>
          </div>

          {/* VP Supply Chain: 4 metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">Cases Cleared</p>
              <p className="text-4xl font-bold text-[#2F2D2E] mb-1">{summary.casesCleared}/{summary.totalCasesScheduled}</p>
              <p className="text-sm font-medium mb-3" style={{ color: '#81D24C' }}>{summary.casesClearedPct}% cleared this week</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#daffd1', color: '#42A800' }}>
                <TrendingUp size={11} />↑ +8pp vs prior week
              </span>
            </div>

            <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">Auto-Resolution</p>
              <p className="text-4xl font-bold mb-1" style={{ color: '#009999' }}>{summary.autoResolutionRate}%</p>
              <p className="text-sm text-[#909BA6] mb-3">from {summary.autoResolutionRatePriorWeek}% prior week</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#daffd1', color: '#42A800' }}>
                <TrendingUp size={11} />↑ +{summary.autoResolutionRate - summary.autoResolutionRatePriorWeek}pp vs prior week
              </span>
            </div>

            <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">Escalations Raised</p>
              <p className="text-4xl font-bold mb-1" style={{ color: '#F18F01' }}>{summary.escalationsRaised}</p>
              <p className="text-sm text-[#909BA6] mb-3">gaps requiring human decision this week</p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#daffd1', color: '#42A800' }}>
                <TrendingDown size={11} />↓ −{summary.escalationsRaisedPriorWeek - summary.escalationsRaised} vs prior week
              </span>
            </div>

            <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#909BA6] mb-3">Variance Items</p>
              <p className="text-4xl font-bold mb-1" style={{ color: '#F18F01' }}>{summary.varianceItemsFlagged}</p>
              <p className="text-sm text-[#909BA6] mb-3">flagged this week</p>
              <span className="text-xs text-[#909BA6]">Week 1 of 5 tracked</span>
            </div>
          </div>

          {/* VP Supply Chain: outcomes CTA panel */}
          <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6 flex items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-[#2F2D2E] mb-1">Weekly Outcomes · {weeklyOutcomes.period}</p>
              <p className="text-sm text-[#909BA6]">
                {weeklyAutoResolved} actions auto-resolved · {summary.varianceItemsFlagged} variance items flagged this week
              </p>
            </div>
            <button
              onClick={() => navigate('outcomes')}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#095256' }}
            >
              View full report →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
