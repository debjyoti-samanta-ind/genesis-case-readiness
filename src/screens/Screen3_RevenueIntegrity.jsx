import { useState } from 'react';
import { ArrowLeft, CheckCircle, ChevronDown } from 'lucide-react';
import { revenueStats, chargeGaps } from '../mockData/revenueIntegrity';

export default function Screen3_RevenueIntegrity({ navigate }) {
  const [expandedId, setExpandedId] = useState(1);
  const [recoveredIds, setRecoveredIds] = useState([]);

  const recover = (id) => setRecoveredIds(prev => [...prev, id]);

  return (
    <div>
      <button
        onClick={() => navigate(1)}
        className="flex items-center gap-1 text-sm text-[#1B6B6B] hover:text-[#155555] mb-6 font-medium"
        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
      >
        <ArrowLeft size={16} /> Back to dashboard
      </button>

      <h1 className="text-2xl font-bold text-[#1A2F4A] mb-1" style={{fontFamily:'Syne,sans-serif'}}>Revenue Integrity</h1>
      <p className="text-sm text-[#6B7280] mb-6" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
        Charge gaps identified by Sentinel — sorted by expected recovery value
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-[#1B6B6B]" style={{fontFamily:'Syne,sans-serif'}}>
            ${revenueStats.totalRecoverable.toLocaleString()}
          </div>
          <div className="text-xs text-[#6B7280] mt-1">Recoverable this week</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>
            {revenueStats.gapsIdentified}
          </div>
          <div className="text-xs text-[#6B7280] mt-1">Gaps identified</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>
            {revenueStats.avgConfidence}%
          </div>
          <div className="text-xs text-[#6B7280] mt-1">Avg recovery confidence</div>
        </div>
      </div>

      {/* Gap table */}
      <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm overflow-hidden">
        {/* Table header */}
        <div
          className="grid px-5 py-3 bg-[#F5F3EE] border-b border-[#E8E4DC] text-xs font-semibold text-[#6B7280] uppercase tracking-wide"
          style={{gridTemplateColumns:'2fr 1.5fr 1fr 1.2fr 0.8fr 1.2fr', fontFamily:'IBM Plex Sans,sans-serif'}}
        >
          <div>Case</div>
          <div>Gap Item</div>
          <div>Amount</div>
          <div>Exp. Recovery</div>
          <div>Conf.</div>
          <div>Action</div>
        </div>

        {chargeGaps.map(gap => {
          const isExpanded = expandedId === gap.id;
          const isRecovered = recoveredIds.includes(gap.id);
          const isAuto = gap.status === 'auto';

          return (
            <div key={gap.id} className={`border-b border-[#E8E4DC] last:border-0 ${isAuto ? 'opacity-50' : ''}`}>
              <div
                className="grid px-5 py-4 items-center hover:bg-[#F5F3EE] cursor-pointer"
                style={{gridTemplateColumns:'2fr 1.5fr 1fr 1.2fr 0.8fr 1.2fr'}}
                onClick={() => !isAuto && setExpandedId(isExpanded ? null : gap.id)}
              >
                <div>
                  <div className="text-sm font-medium text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{gap.case}</div>
                  <div className="text-xs text-[#6B7280]">{gap.payer} · {gap.daysSince}d ago</div>
                </div>
                <div className="text-sm text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{gap.item}</div>
                <div className="text-sm font-semibold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>
                  ${gap.amount.toLocaleString()}
                </div>
                <div className="text-sm font-semibold text-[#166534]" style={{fontFamily:'Syne,sans-serif'}}>
                  ${gap.expectedRecovery.toLocaleString()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-10 h-1.5 rounded-full bg-[#E8E4DC]">
                      <div className="h-1.5 rounded-full bg-[#166534]" style={{width:`${gap.confidence}%`}} />
                    </div>
                    <span className="text-xs text-[#6B7280]">{gap.confidence}%</span>
                  </div>
                </div>
                <div>
                  {isAuto ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      <CheckCircle size={10} /> Auto-resolved
                    </span>
                  ) : isRecovered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      <CheckCircle size={10} /> Submitted
                    </span>
                  ) : gap.status === 'inline' ? (
                    <button
                      onClick={e => { e.stopPropagation(); recover(gap.id); }}
                      className="text-xs font-semibold text-[#1B6B6B] bg-[#D4EEEE] px-2.5 py-1 rounded-full hover:bg-[#1B6B6B] hover:text-white transition-colors"
                    >
                      1-click recover
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-medium text-[#1B6B6B]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                      Review <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && gap.details && !isAuto && (
                <div className="px-5 pb-5 bg-[#F5F3EE] border-t border-[#E8E4DC]">
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                        Genesis POC — UDI Scan Record
                      </div>
                      <div className="text-sm text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                        {gap.details.scanned} implants scanned — UDI records confirmed
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                        Kermit — Billing Record
                      </div>
                      <div className="text-sm text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                        {gap.details.billed} implants billed
                      </div>
                      <div className="text-sm text-[#991B1B] font-medium mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                        Gap: {gap.details.missing} — ${gap.amount.toLocaleString()} list price
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white rounded-lg border border-[#E8E4DC]">
                    <div className="text-xs text-[#6B7280] mb-1" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                      Recovery model — Logistic Regression
                    </div>
                    <div className="text-sm text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                      Payer: {gap.payer} · Complexity: {gap.complexity} · {gap.daysSince} days elapsed →{' '}
                      <strong className="text-[#166534]">{gap.confidence}% recovery probability</strong>
                    </div>
                    <div className="text-sm font-semibold text-[#166534] mt-1" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                      Expected recovery: ${gap.expectedRecovery.toLocaleString()}
                    </div>
                  </div>
                  {!isRecovered ? (
                    <button
                      onClick={() => recover(gap.id)}
                      className="mt-4 bg-[#1B6B6B] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#155555] transition-colors text-sm"
                      style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                    >
                      Submit corrected claim
                    </button>
                  ) : (
                    <div className="mt-4 flex items-center gap-2 text-sm text-[#166534] font-medium" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                      <CheckCircle size={16} /> Corrected claim submitted — expected recovery: ${gap.expectedRecovery.toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-[#6B7280] text-right" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
        Recovery probability: logistic regression — features: payer type, procedure complexity, days since procedure, prior payer recovery rate
      </div>
    </div>
  );
}
