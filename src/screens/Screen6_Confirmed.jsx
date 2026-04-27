import { ArrowLeft, CheckCircle } from 'lucide-react';
import { approvalResponse } from '../mockData/approvalResponse';

const weekStatusColors = {
  danger:  'bg-[#FEE2E2] text-[#991B1B]',
  success: 'bg-[#DCFCE7] text-[#166534]',
  info:    'bg-[#EFF6FF] text-[#1D4ED8]',
  warning: 'bg-[#FEF3C7] text-[#B45309]',
};

export default function Screen6_Confirmed({ navigate, approvalType }) {
  const isSubstitute = approvalType !== 'same-item';
  const r = approvalResponse;

  const agentRows = [
    ['PO Number', r.poNumber],
    ['Supplier', isSubstitute ? r.supplier : r.sameItemSupplier],
    ['Quantity', `${r.quantity} units`],
    ['Unit price', `$${(isSubstitute ? r.unitPrice : r.sameItemUnitPrice).toLocaleString()}`],
    ['ETA', r.eta],
    ['Surgeons notified', r.surgeonsNotified.join(', ')],
  ];

  const financialRows = isSubstitute ? [
    ['This week saving', `$${r.financials.thisWeekSaving.toLocaleString()}`, true],
    ['Annualised (est.)', `$${r.financials.annualisedSaving.toLocaleString()}`, true],
    ['PO total', `$${r.financials.poTotal.toLocaleString()}`, false],
    ['vs. same-item cost', `$${r.financials.sameItemCost.toLocaleString()}`, false],
    ['Variance captured', '✓', true],
  ] : [
    ['PO total', `$${(r.sameItemUnitPrice * r.quantity).toLocaleString()}`, false],
    ['vs. substitute option', `saving forfeited: $${r.financials.thisWeekSaving.toLocaleString()}`, false],
  ];

  return (
    <div>
      <button
        onClick={() => navigate(1)}
        className="flex items-center gap-1 text-sm text-[#1B6B6B] hover:text-[#155555] mb-6 font-medium"
        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
      >
        <ArrowLeft size={16} /> Back to dashboard
      </button>

      {/* Success banner */}
      <div className="bg-[#DCFCE7] border border-[#166534] border-opacity-30 rounded-xl p-6 mb-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-[#166534] flex items-center justify-center flex-shrink-0">
          <CheckCircle className="text-white" size={28} />
        </div>
        <div>
          <div className="text-lg font-bold text-[#166534]" style={{fontFamily:'Syne,sans-serif'}}>
            Approved by {r.approvedBy}, {r.approvedAt}
          </div>
          <div className="text-sm text-[#166534] opacity-80 mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
            {isSubstitute ? r.action : r.sameItemAction}
          </div>
        </div>
      </div>

      {/* Two-column summary */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">
          <div className="text-sm font-semibold text-[#1A2F4A] mb-4" style={{fontFamily:'Syne,sans-serif'}}>Agent actions taken</div>
          <dl className="space-y-2.5">
            {agentRows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-xs text-[#6B7280]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{label}</dt>
                <dd className="text-sm font-medium text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">
          <div className="text-sm font-semibold text-[#1A2F4A] mb-4" style={{fontFamily:'Syne,sans-serif'}}>Financial impact</div>
          <dl className="space-y-2.5">
            {financialRows.map(([label, value, green]) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-xs text-[#6B7280]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{label}</dt>
                <dd
                  className="text-sm font-medium"
                  style={{fontFamily:'IBM Plex Sans,sans-serif', color: green ? '#166534' : '#1A2F4A'}}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Week summary */}
      <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5 mb-6">
        <div className="text-sm font-semibold text-[#1A2F4A] mb-4" style={{fontFamily:'Syne,sans-serif'}}>
          This week — full resolution summary
        </div>
        <div className="space-y-2">
          {r.weekSummary.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#E8E4DC] last:border-0">
              <CheckCircle size={14} className="text-[#166534] flex-shrink-0" />
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${weekStatusColors[item.statusVariant]}`}>
                {item.status}
              </span>
              <div className="flex-1 min-w-0 text-sm" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                <span className="font-medium text-[#1A2F4A]">{item.item}</span>
                <span className="text-[#6B7280]"> — {item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stat bar */}
      <div className="bg-[#1A2F4A] rounded-xl p-5 mb-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { value: r.totalStats.totalActions, label: 'Total actions this week' },
            { value: r.totalStats.autoResolved, label: 'Auto-resolved' },
            { value: r.totalStats.humanDecisions, label: 'Human decisions' },
            { value: `$${r.totalStats.totalRecoverable.toLocaleString()}`, label: 'Total recoverable' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-white" style={{fontFamily:'Syne,sans-serif'}}>{s.value}</div>
              <div className="text-xs text-[#94A3B8] mt-1" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(1)}
          className="flex items-center gap-2 text-sm font-medium text-[#1A2F4A] hover:text-[#1B6B6B] transition-colors"
          style={{fontFamily:'IBM Plex Sans,sans-serif'}}
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>
        <div className="flex-1" />
        <button
          onClick={() => navigate(5)}
          className="bg-[#1B6B6B] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#155555] transition-colors"
          style={{fontFamily:'IBM Plex Sans,sans-serif'}}
        >
          View agent log →
        </button>
      </div>
    </div>
  );
}
