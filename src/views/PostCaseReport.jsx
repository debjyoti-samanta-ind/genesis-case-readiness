import { samplePostCaseReport } from '../data/syntheticData'

export default function PostCaseReport({ navigate }) {
  const r = samplePostCaseReport

  return (
    <div>
      <button
        onClick={() => navigate('todaysOR')}
        className="flex items-center gap-1 text-sm font-medium text-[#006FDD] hover:text-[#2D4CC7] mb-6"
      >
        ← Back to Today's OR
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2F2D2E]">Post-Case Report</h1>
        <p className="text-[#909BA6] mt-1">
          {r.procedure} · {r.surgeon} · {r.date} · {r.orRoom}
        </p>
        <p className="text-xs text-[#909BA6] mt-0.5">
          Report generated at {r.reportGeneratedAt} (T+4h) · Preference card {r.preferenceCardVersion}
        </p>
      </div>

      {/* Phase 5 will build the full variance table here */}
      <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#daffd1] text-[#42A800] text-xs font-semibold mb-4">
          <span className="w-2 h-2 rounded-full bg-[#81D24C]" />
          Phase 5 — Full variance report coming next
        </div>
        <p className="text-[#909BA6] text-sm">
          Data loaded · {r.matched} matched · {r.variances} variances · {r.chargeGaps} charge capture gap · ${r.chargeCaptureSummary.estimatedRecoveryValue} recovery opportunity
        </p>
      </div>
    </div>
  )
}
