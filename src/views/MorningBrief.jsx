import { scheduledCases, agentRun, hospitalContext } from '../data/syntheticData'
import StatusBadge from '../components/StatusBadge'

export default function MorningBrief({ navigate }) {
  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2F2D2E]">Morning Brief</h1>
        <p className="text-sm text-[#909BA6] mt-1">
          What you would receive in your inbox at 6:00am
        </p>
      </div>

      {/* Email card */}
      <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm overflow-hidden mb-6">

        {/* Email header bar */}
        <div className="border-b border-[#E3E3E3] px-6 py-5 bg-[#FCFCFC]">
          <table className="text-sm w-full">
            <tbody>
              {[
                { label: 'From',    value: 'genesis-agent@vrmc-genesis.com' },
                { label: 'To',      value: 'maria.santos@vrmc.org; sarah.chen@vrmc.org' },
                { label: 'Subject', value: '🔴 Genesis Case Readiness — Fri 29 May · 3 cases · 2 decisions needed' },
                { label: 'Date',    value: 'Fri 29 May 2026, 06:00am' },
              ].map(row => (
                <tr key={row.label} className="border-b border-[#F0F0F0] last:border-0">
                  <td className="py-2 pr-4 text-xs font-semibold uppercase tracking-widest text-[#909BA6] w-20 align-top">
                    {row.label}
                  </td>
                  <td className="py-2 text-[#2F2D2E]">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Email body */}
        <div className="px-8 py-7 space-y-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

          <div>
            <p className="text-base text-[#2F2D2E] mb-1">Good morning,</p>
            <p className="text-sm text-[#545F66]">
              Here's your overnight case readiness summary for {hospitalContext.name}.
            </p>
          </div>

          {/* Section: Today's OR */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3 pb-1.5 border-b border-[#E3E3E3]"
              style={{ color: '#095256' }}
            >
              Today's OR — {scheduledCases.length} Cases
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[#909BA6] border-b border-[#E3E3E3]">
                  <th className="py-2 text-left font-semibold">Case</th>
                  <th className="py-2 text-left font-semibold">Time</th>
                  <th className="py-2 text-left font-semibold">Surgeon</th>
                  <th className="py-2 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {scheduledCases.map(c => (
                  <tr key={c.id} className="border-b border-[#F0F0F0] last:border-0">
                    <td className="py-2.5 font-medium text-[#2F2D2E]">
                      {c.procedure}{c.count > 1 ? ` ×${c.count}` : ''}
                    </td>
                    <td className="py-2.5 text-[#909BA6]">{c.scheduledTime}</td>
                    <td className="py-2.5 text-[#909BA6]">{c.surgeons[0]}</td>
                    <td className="py-2.5"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section: Decisions needed */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3 pb-1.5 border-b border-[#E3E3E3]"
              style={{ color: '#CB4630' }}
            >
              2 Decisions Needed by 7:30am
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-[#FDF2F0] rounded-lg px-4 py-3">
                <span className="text-sm mt-0.5 flex-shrink-0">🔴</span>
                <div>
                  <p className="text-sm font-semibold text-[#2F2D2E]">Tibial Component XR-7 — DePuy Synthes</p>
                  <p className="text-xs text-[#909BA6] mt-0.5">PPI item, no auto-action allowed per governance. Vendor rep (Sarah Mitchell) unresponsive for 26h.</p>
                  <p className="text-xs mt-1"><span className="font-semibold text-[#F18F01]">Recommended: </span><span className="text-[#2F2D2E]">Call Sarah Mitchell directly — 704-555-0147</span></p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-[#FFFBF2] rounded-lg px-4 py-3">
                <span className="text-sm mt-0.5 flex-shrink-0">🟡</span>
                <div>
                  <p className="text-sm font-semibold text-[#2F2D2E]">Femoral Head 36mm — preference card change detected</p>
                  <p className="text-xs text-[#909BA6] mt-0.5">Dr. Rodriguez switched to 36mm in 3 recent cases, card still shows 32mm. Confirm before case starts.</p>
                  <p className="text-xs mt-1"><span className="font-semibold text-[#F18F01]">Recommended: </span><span className="text-[#2F2D2E]">Confirm with Dr. Rodriguez's office and update preference card</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Auto-handled */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3 pb-1.5 border-b border-[#E3E3E3]"
              style={{ color: '#009999' }}
            >
              Agent Auto-Handled Overnight
            </p>
            <div className="space-y-2">
              {[
                'Auto-reordered BoneFix-2 Bone Cement (×1 unit, $180) — PO-2026-4422 raised at 02:00am',
                'Loan kit request sent to Sarah Mitchell at DePuy Synthes for Tibial Component XR-7 (2 sizes, 4 units)',
                'Dr. Chen preference card drift flagged: Tibial 44mm used in 8/15 recent cases — 42mm still on card',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span style={{ color: '#009999', fontSize: 14, lineHeight: '20px' }}>✓</span>
                  <p className="text-sm text-[#545F66]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Email footer */}
          <div className="border-t border-[#E3E3E3] pt-4">
            <p className="text-xs text-[#909BA6]">
              Reply to this email to contact the Genesis team · Unsubscribe · genesis.genesisahc.com
            </p>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div
        className="rounded-xl border px-6 py-4"
        style={{ backgroundColor: '#EEFFFF', borderColor: '#8BFFFF' }}
      >
        <p className="text-sm text-[#095256]">
          This email mockup shows what Maria Santos and Sarah Chen would receive each morning at 6am after the overnight agent run. The agent completes its run by ~02:00:21am — the email is scheduled for 6:00am delivery so it lands in the inbox at the start of the clinical day, not in the middle of the night. In production, delivery time and recipients are configurable.
        </p>
      </div>
    </div>
  )
}
