import { ArrowLeft } from 'lucide-react';
import { procedures, selectedCase } from '../mockData/orReadiness';
import RiskScore from '../components/RiskScore';
import Sparkline from '../components/Sparkline';

const statusColors = {
  'AT RISK': 'bg-[#FEE2E2] text-[#991B1B]',
  'WATCH':   'bg-[#FEF3C7] text-[#B45309]',
  'CLEAR':   'bg-[#DCFCE7] text-[#166534]',
};

export default function Screen2_ORReadiness({ navigate, navigateWithApproval }) {
  const c = selectedCase;

  return (
    <div>
      <button
        onClick={() => navigate(1)}
        className="flex items-center gap-1 text-sm text-[#1B6B6B] hover:text-[#155555] mb-6 font-medium"
        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
      >
        <ArrowLeft size={16} /> Back to dashboard
      </button>

      <h1 className="text-2xl font-bold text-[#1A2F4A] mb-6" style={{fontFamily:'Syne,sans-serif'}}>OR Readiness</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Left — Procedure list */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#E8E4DC]">
              <div className="text-sm font-semibold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>
                Upcoming procedures (next 7 days)
              </div>
            </div>
            {procedures.map((proc, i) => (
              <div
                key={proc.id}
                className={`p-4 border-b border-[#E8E4DC] last:border-0 ${i === 0 ? 'bg-[#FEF3C7]' : 'hover:bg-[#F5F3EE]'} cursor-pointer`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{proc.name}</div>
                    <div className="text-xs text-[#6B7280] mt-0.5">{proc.date} · {proc.surgeon}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[proc.status]}`}>
                    {proc.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-[#E8E4DC]">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${proc.score}%`,
                        backgroundColor: proc.score >= 75 ? '#991B1B' : proc.score >= 50 ? '#B45309' : '#166534',
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[#6B7280]">{proc.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Case detail */}
        <div className="col-span-2 flex flex-col gap-5">
          {/* Item header with risk score */}
          <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-[#1B6B6B] mb-1" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                  OR READINESS
                </div>
                <h2 className="text-xl font-bold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>{c.item}</h2>
                <div className="text-sm text-[#6B7280] mt-0.5">{c.department} · {c.classification}</div>
              </div>
              <div className="flex items-center gap-4">
                <RiskScore score={c.riskScore} />
                <span className="bg-[#FEE2E2] text-[#991B1B] text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  {c.statusBadge}
                </span>
              </div>
            </div>
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-[#E8E4DC]">
              {[
                { label: 'Stock on hand', value: `${c.stats.stockOnHand} units`, alert: false },
                { label: 'Procedures Thu', value: `${c.stats.proceduresThursday} cases`, alert: true },
                { label: 'Required', value: `${c.stats.required} units`, alert: true },
                { label: 'Deficit', value: `${c.stats.deficit} units`, alert: true },
                { label: 'Supplier lead', value: `${c.stats.supplierLead} days`, alert: false },
                { label: 'Confidence', value: c.stats.confidence, alert: false },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-xs text-[#6B7280] mb-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{s.label}</div>
                  <div className="text-lg font-bold" style={{fontFamily:'Syne,sans-serif', color: s.alert ? '#991B1B' : '#1A2F4A'}}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sparkline */}
          <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">
            <div className="text-sm font-semibold text-[#1A2F4A] mb-3" style={{fontFamily:'Syne,sans-serif'}}>
              14-day demand forecast
            </div>
            <Sparkline data={c.sparklineData} highlightIndices={[4, 5]} />
            <div className="text-xs text-[#6B7280] mt-2" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              Avg usage: 1.8/day · Thu–Fri spike = 6 scheduled procedures · Confidence: High
            </div>
            <div className="mt-1 text-xs text-[#B45309] font-medium" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              ↑ Thu–Fri bars highlighted in amber — 6 procedures scheduled
            </div>
          </div>

          {/* Risk score explanation */}
          <div className="bg-[#D4EEEE] rounded-xl p-5">
            <div className="text-sm font-semibold text-[#1B6B6B] mb-2" style={{fontFamily:'Syne,sans-serif'}}>
              Score: {c.riskScore}/100 — top contributing factors
            </div>
            <ul className="space-y-1.5">
              {c.riskFactors.map((f, i) => (
                <li key={i} className="text-sm text-[#1A2F4A] flex gap-2" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                  <span className="text-[#1B6B6B] font-bold flex-shrink-0">{i + 1}.</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="text-xs text-[#6B7280] mt-3" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              Model: XGBoost OR Readiness Classifier — trained on 18 months Genesis supply + Epic OR schedule data
            </div>
          </div>

          {/* Governance note */}
          <div className="bg-[#FEF3C7] rounded-xl border border-[#B45309] border-opacity-20 p-4">
            <div className="text-sm font-semibold text-[#B45309] mb-1" style={{fontFamily:'Syne,sans-serif'}}>
              Why the agent cannot auto-reorder
            </div>
            <div className="text-sm text-[#92400E]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{c.governanceNote}</div>
          </div>

          {/* Substitute recommendation */}
          <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#1B6B6B] mb-3" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              Contracted substitute — via {c.substitute.source}
            </div>
            <div className="text-xl font-bold text-[#1A2F4A] mb-4" style={{fontFamily:'Syne,sans-serif'}}>{c.substitute.name}</div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Contract price', value: `$${c.substitute.contractPrice.toLocaleString()}`, color: '#166534' },
                { label: 'Original (XR-7)', value: `$${c.substitute.originalPrice.toLocaleString()}`, color: '#1A2F4A', strike: true },
                { label: 'Saving per case', value: `$${c.substitute.savingPerCase.toLocaleString()}`, color: '#166534' },
                { label: '6 cases this week', value: `$${c.substitute.totalSaving.toLocaleString()}`, color: '#166534' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-xs text-[#6B7280] mb-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{s.label}</div>
                  <div
                    className={`text-xl font-bold ${s.strike ? 'line-through' : ''}`}
                    style={{fontFamily:'Syne,sans-serif', color: s.color}}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-sm text-[#6B7280] mb-4" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              Annualised saving (est.): <strong className="text-[#166534]">${c.substitute.annualisedSaving.toLocaleString()}</strong>
              {' '}· Surgeons notified: {c.substitute.surgeons.join(', ')}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigateWithApproval(6, 'substitute')}
                className="flex-1 bg-[#1B6B6B] text-white font-semibold py-3 rounded-lg hover:bg-[#155555] transition-colors text-sm"
                style={{fontFamily:'IBM Plex Sans,sans-serif'}}
              >
                ✓ Approve substitute — save ${c.substitute.totalSaving.toLocaleString()}
              </button>
              <button
                onClick={() => navigateWithApproval(6, 'same-item')}
                className="flex-1 bg-white text-[#1A2F4A] font-semibold py-3 rounded-lg border border-[#E8E4DC] hover:border-[#1B6B6B] hover:text-[#1B6B6B] transition-colors text-sm"
                style={{fontFamily:'IBM Plex Sans,sans-serif'}}
              >
                Reorder XR-7 (same item)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
