import { weeklyOutcomes } from '../data/syntheticData'

export default function Outcomes() {
  const { summary } = weeklyOutcomes

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2F2D2E]">Outcomes</h1>
        <p className="text-[#909BA6] mt-1">{weeklyOutcomes.period} · Valley Regional Medical Center</p>
      </div>

      {/* Phase 3 will build full metrics, charts, surgeon variance table here */}
      <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#daffd1] text-[#42A800] text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-[#81D24C]" />
          Phase 3 — Weekly metrics, charts, and surgeon variance table coming next
        </div>
        <p className="text-[#909BA6] text-sm">
          Data loaded · {summary.casesCleared}/{summary.totalCasesScheduled} cases cleared · {summary.autoResolutionRate}% auto-resolution · ${summary.estimatedAnnualisedSavings.toLocaleString()} annualised savings
        </p>
      </div>
    </div>
  )
}
