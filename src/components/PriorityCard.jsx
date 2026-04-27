import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const moduleStyles = {
  'RECALL':            { tag: 'bg-[#FEE2E2] text-[#991B1B]', border: 'border-l-[#991B1B]' },
  'OR READINESS':      { tag: 'bg-[#D4EEEE] text-[#1B6B6B]', border: 'border-l-[#1B6B6B]' },
  'REVENUE INTEGRITY': { tag: 'bg-[#DCFCE7] text-[#166534]', border: 'border-l-[#166534]' },
};

const badgeStyles = {
  danger:  'bg-[#FEE2E2] text-[#991B1B]',
  warning: 'bg-[#FEF3C7] text-[#B45309]',
  success: 'bg-[#DCFCE7] text-[#166534]',
  info:    'bg-[#EFF6FF] text-[#1D4ED8]',
};

export default function PriorityCard({ item, navigate }) {
  const [confirmed, setConfirmed] = useState(false);
  const ms = moduleStyles[item.module] || moduleStyles['OR READINESS'];

  if (item.autoResolved) {
    return (
      <div className={`bg-white rounded-xl border border-[#E8E4DC] border-l-4 ${ms.border} shadow-sm p-4 flex items-start gap-4 opacity-70`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${ms.tag}`}>{item.module}</span>
          </div>
          <div className="text-sm font-semibold text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
            {item.title} <span className="text-[#6B7280] font-normal">· {item.department}</span>
          </div>
          <div className="text-xs text-[#6B7280] mt-1 italic">{item.agentAction}</div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1.5">
          <CheckCircle size={14} className="text-[#166534]" />
          <span className="text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full uppercase">Auto-handled</span>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className={`bg-white rounded-xl border border-[#E8E4DC] border-l-4 border-l-[#166534] shadow-sm p-4`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${ms.tag}`}>{item.module}</span>
        </div>
        <div className="text-sm font-semibold text-[#1A2F4A] mb-3" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
          {item.title} <span className="text-[#6B7280] font-normal">· {item.department}</span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-[#DCFCE7] rounded-lg">
          <CheckCircle size={16} className="text-[#166534]" />
          <span className="text-sm text-[#166534] font-medium" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{item.confirmMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-[#E8E4DC] border-l-4 ${ms.border} shadow-sm p-4`}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${ms.tag}`}>{item.module}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeStyles[item.badgeVariant] || badgeStyles.warning}`}>{item.badge}</span>
          </div>
          <div className="text-sm font-semibold text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
            {item.title} <span className="text-[#6B7280] font-normal">· {item.department}</span>
          </div>
          <div className="text-sm text-[#1A2F4A] mt-1" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{item.summary}</div>
          <div className="text-xs text-[#6B7280] mt-1 italic" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{item.agentAction}</div>
        </div>
        <div className="flex-shrink-0">
          {item.isInline ? (
            <button
              onClick={() => setConfirmed(true)}
              className="bg-[#1B6B6B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#155555] transition-colors whitespace-nowrap"
              style={{fontFamily:'IBM Plex Sans,sans-serif'}}
            >
              {item.cta}
            </button>
          ) : (
            <button
              onClick={() => navigate(item.ctaScreen)}
              className="bg-[#1B6B6B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#155555] transition-colors whitespace-nowrap"
              style={{fontFamily:'IBM Plex Sans,sans-serif'}}
            >
              {item.cta}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
