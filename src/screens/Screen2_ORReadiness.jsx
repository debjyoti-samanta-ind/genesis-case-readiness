import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, Activity, CheckCircle } from 'lucide-react';
import { procedures, cases } from '../mockData/orReadiness';
import RiskScore from '../components/RiskScore';
import Sparkline from '../components/Sparkline';

const statusColors = {
  'AT RISK': 'bg-[#FEE2E2] text-[#991B1B]',
  'WATCH':   'bg-[#FEF3C7] text-[#B45309]',
  'CLEAR':   'bg-[#DCFCE7] text-[#166534]',
};

export default function Screen2_ORReadiness({ navigate, navigateWithApproval }) {
  const [selectedId, setSelectedId]       = useState(1);
  const [actionConfirmed, setActionConfirmed] = useState(null);

  useEffect(() => { setActionConfirmed(null); }, [selectedId]);

  const c            = cases[selectedId];
  const selectedProc = procedures.find(p => p.id === selectedId);
  const badgeCls     = c.riskScore >= 75 ? 'bg-[#FEE2E2] text-[#991B1B]'
                     : c.riskScore >= 50 ? 'bg-[#FEF3C7] text-[#B45309]'
                     :                     'bg-[#DCFCE7] text-[#166534]';

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
              <div className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                UPCOMING PROCEDURES — NEXT 7 DAYS
              </div>
            </div>
            {procedures.map(proc => {
              const isSelected = proc.id === selectedId;
              return (
                <div
                  key={proc.id}
                  onClick={() => setSelectedId(proc.id)}
                  className={`p-4 border-b border-[#E8E4DC] last:border-0 cursor-pointer transition-all ${
                    isSelected ? 'bg-[#F0FAFA]' : 'hover:bg-[#F5F3EE]'
                  }`}
                  style={isSelected
                    ? {borderLeftWidth:'3px', borderLeftColor:'#1B6B6B'}
                    : {borderLeftWidth:'3px', borderLeftColor:'transparent'}}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-semibold truncate ${isSelected ? 'text-[#1B6B6B]' : 'text-[#1A2F4A]'}`}
                        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                      >
                        {proc.name}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                        {proc.date} · {proc.surgeon}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[proc.status]}`}>
                        {proc.status}
                      </span>
                      <ChevronRight
                        size={14}
                        className={`transition-colors flex-shrink-0 ${isSelected ? 'text-[#1B6B6B]' : 'text-[#D0D0D0]'}`}
                      />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-[#E8E4DC]">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${proc.score}%`,
                          backgroundColor: proc.score >= 75 ? '#991B1B' : proc.score >= 50 ? '#B45309' : '#166534',
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#6B7280]">{proc.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — Case detail */}
        <div className="col-span-2 flex flex-col gap-5">

          {/* Item header — procedure context + supply risk */}
          <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">

            {/* Procedure breadcrumb */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#E8E4DC]">
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                <Activity size={15} className="text-[#B45309]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                  Selected procedure
                </div>
                <div className="text-sm font-bold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>
                  {selectedProc.name}
                </div>
                <div className="text-xs text-[#6B7280]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                  {selectedProc.date} · {selectedProc.surgeon}
                </div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${statusColors[selectedProc.status]}`}>
                {selectedProc.status}
              </span>
            </div>

            {/* Supply item */}
            <div className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-3" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              Supply item flagged by Sentinel
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>{c.item}</h2>
                <div className="text-sm text-[#6B7280] mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                  {c.department} · {c.classification}
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <RiskScore score={c.riskScore} />
                <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase whitespace-nowrap ${badgeCls}`}>
                  {c.statusBadge}
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-[#E8E4DC]">
              {c.stats.map(s => (
                <div key={s.label}>
                  <div className="text-xs text-[#6B7280] mb-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{s.label}</div>
                  <div className="text-lg font-bold" style={{fontFamily:'Syne,sans-serif', color: s.color}}>
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
            <Sparkline data={c.sparklineData} highlightIndices={c.sparklineHighlight} />
            <div className="text-xs text-[#6B7280] mt-2" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              {c.sparklineCaption}
            </div>
            {c.sparklineNote && (
              <div className="mt-1 text-xs text-[#B45309] font-medium" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                {c.sparklineNote}
              </div>
            )}
          </div>

          {/* Risk factors — or clear state */}
          {c.riskFactors.length > 0 ? (
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
          ) : (
            <div className="bg-[#DCFCE7] rounded-xl p-5 flex items-center gap-4">
              <CheckCircle size={22} className="text-[#166534] flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#166534]" style={{fontFamily:'Syne,sans-serif'}}>
                  No risk factors identified
                </div>
                <div className="text-xs text-[#166534] mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif', opacity:0.8}}>
                  XGBoost score: {c.riskScore}/100 — all signals within normal thresholds
                </div>
              </div>
            </div>
          )}

          {/* Governance / agent note */}
          <div className="bg-[#FEF3C7] rounded-xl p-4" style={{border:'1px solid rgba(180,83,9,0.2)'}}>
            <div className="text-sm font-semibold text-[#B45309] mb-1" style={{fontFamily:'Syne,sans-serif'}}>
              {c.governanceLabel}
            </div>
            <div className="text-sm text-[#92400E]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{c.governanceNote}</div>
          </div>

          {/* Recommendation */}
          {c.recommendation.type === 'none' ? (
            <div className="bg-[#DCFCE7] rounded-xl p-5 flex items-center gap-4">
              <CheckCircle size={22} className="text-[#166534] flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-[#166534]" style={{fontFamily:'Syne,sans-serif'}}>
                  No action required
                </div>
                <div className="text-xs text-[#166534] mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif', opacity:0.8}}>
                  Agent confirmed adequate stock at 02:00am. This procedure is fully covered.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#1B6B6B] mb-3" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                {c.recommendation.sectionLabel}
              </div>
              <div className="text-xl font-bold text-[#1A2F4A] mb-4" style={{fontFamily:'Syne,sans-serif'}}>
                {c.recommendation.name}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {c.recommendation.metrics.map(m => (
                  <div key={m.label}>
                    <div className="text-xs text-[#6B7280] mb-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{m.label}</div>
                    <div
                      className={`text-xl font-bold ${m.strike ? 'line-through' : ''}`}
                      style={{fontFamily:'Syne,sans-serif', color: m.color}}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-[#6B7280] mb-4" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                {c.recommendation.note}
              </div>

              {/* Action buttons */}
              {c.recommendation.type === 'substitute' ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => navigateWithApproval(6, 'substitute')}
                    className="flex-1 bg-[#1B6B6B] text-white font-semibold py-3 rounded-lg hover:bg-[#155555] transition-colors text-sm"
                    style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                  >
                    {c.recommendation.primaryLabel}
                  </button>
                  <button
                    onClick={() => navigateWithApproval(6, 'same-item')}
                    className="flex-1 bg-white text-[#1A2F4A] font-semibold py-3 rounded-lg border border-[#E8E4DC] hover:border-[#1B6B6B] hover:text-[#1B6B6B] transition-colors text-sm"
                    style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                  >
                    {c.recommendation.secondaryLabel}
                  </button>
                </div>
              ) : actionConfirmed ? (
                <div className="flex items-center gap-2.5 text-sm text-[#166534] font-medium py-2" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                  <CheckCircle size={16} className="flex-shrink-0" />
                  {actionConfirmed}
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setActionConfirmed(c.recommendation.primaryConfirmMessage)}
                    className="flex-1 bg-[#1B6B6B] text-white font-semibold py-3 rounded-lg hover:bg-[#155555] transition-colors text-sm"
                    style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                  >
                    {c.recommendation.primaryLabel}
                  </button>
                  <button
                    onClick={() => setActionConfirmed(c.recommendation.secondaryConfirmMessage)}
                    className="flex-1 bg-white text-[#1A2F4A] font-semibold py-3 rounded-lg border border-[#E8E4DC] hover:border-[#1B6B6B] hover:text-[#1B6B6B] transition-colors text-sm"
                    style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                  >
                    {c.recommendation.secondaryLabel}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
