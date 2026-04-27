import { useState } from 'react';
import {
  CheckCircle, AlertTriangle, Activity, TrendingUp, ArrowRight,
  LayoutDashboard, X, ShoppingCart, FileText,
} from 'lucide-react';
import { sentinelRun } from '../mockData/sentinelRun';
import { priorityQueue } from '../mockData/priorityQueue';
import { autoHandledItems } from '../mockData/autoHandledItems';

/* ── Donut SVG ──────────────────────────────────────────────── */
function DonutChart({ segments, size = 100 }) {
  const r = 36, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const gap  = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={12}
            strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset}
            style={{transform:'rotate(-90deg)', transformOrigin:`${cx}px ${cy}px`}}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy - 6}  textAnchor="middle" fill="#1A2F4A" fontSize="16" fontWeight="700" fontFamily="Syne,sans-serif">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#6B7280" fontSize="9"  fontFamily="IBM Plex Sans,sans-serif">ITEMS</text>
    </svg>
  );
}

/* ── Auto-handled items modal ───────────────────────────────── */
function AutoHandledModal({ onClose }) {
  const reorders   = autoHandledItems.filter(i => i.type === 'REORDER');
  const chargeGaps = autoHandledItems.filter(i => i.type === 'CHARGE_GAP');
  const reorderTotal = reorders.reduce((s, i) => s + i.total, 0);
  const gapTotal     = chargeGaps.reduce((s, i) => s + i.total, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{backgroundColor:'rgba(10,18,40,0.6)'}}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 flex flex-col" style={{maxHeight:'88vh'}}>

        {/* Modal header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#E8E4DC] flex-shrink-0">
          <div>
            <div className="text-base font-bold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>
              10 Items Auto-Handled Overnight
            </div>
            <div className="text-xs text-[#6B7280] mt-1" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              Tue 29 Apr 2026, 02:00am · Actions submitted autonomously per governance rules
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F5F3EE] text-[#6B7280] hover:text-[#1A2F4A] transition-colors flex-shrink-0 ml-4"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* Integration note */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3.5 mb-6 flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] mt-1.5 flex-shrink-0" />
            <p className="text-xs text-[#1D4ED8]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              Purchase orders are submitted directly to <strong>Genesis Core</strong> via API integration — no manual entry required. Charge gap corrections route automatically to the respective payer's clearinghouse.
            </p>
          </div>

          {/* Purchase orders */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart size={13} className="text-[#1B6B6B]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#1B6B6B]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                Purchase Orders ({reorders.length})
              </span>
              <span className="text-xs text-[#6B7280] ml-auto" style={{fontFamily:'IBM Plex Mono,monospace'}}>
                Total: ${reorderTotal.toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              {reorders.map(item => (
                <div key={item.id} className="border border-[#E8E4DC] rounded-xl p-4 hover:bg-[#FAFAF8] transition-colors">
                  <div className="flex items-start gap-3">
                    <span
                      className="text-xs font-bold text-[#1B6B6B] bg-[#D4EEEE] px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                      style={{fontFamily:'IBM Plex Mono,monospace'}}
                    >
                      {item.po}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{item.item}</div>
                          <div className="text-xs text-[#6B7280] mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                            {item.dept} · {item.supplier}
                          </div>
                          <div className="text-xs text-[#6B7280] mt-0.5 italic" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{item.reason}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>
                            {item.qty} × ${item.unitPrice.toFixed(2)}
                          </div>
                          <div className="text-xs font-semibold text-[#1B6B6B]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                            = ${item.total.toLocaleString()}
                          </div>
                          <div className="text-xs text-[#6B7280] mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>ETA {item.eta}</div>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2.5 border-t border-[#E8E4DC] flex items-center gap-1.5">
                        <CheckCircle size={11} className="text-[#166534] flex-shrink-0" />
                        <span className="text-xs text-[#166534] font-medium" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{item.genesisStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charge gaps */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={13} className="text-[#166534]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#166534]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                Charge Gap Auto-Recoveries ({chargeGaps.length})
              </span>
              <span className="text-xs text-[#6B7280] ml-auto" style={{fontFamily:'IBM Plex Mono,monospace'}}>
                Est. recovery: ${gapTotal.toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              {chargeGaps.map(item => (
                <div key={item.id} className="border border-[#E8E4DC] rounded-xl p-4 hover:bg-[#FAFAF8] transition-colors">
                  <div className="flex items-start gap-3">
                    <span
                      className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                      style={{fontFamily:'IBM Plex Mono,monospace'}}
                    >
                      {item.po}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{item.item}</div>
                          <div className="text-xs text-[#6B7280] mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                            {item.dept} · {item.supplier}
                          </div>
                          <div className="text-xs text-[#6B7280] mt-0.5 italic" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{item.reason}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-[#166534]" style={{fontFamily:'Syne,sans-serif'}}>
                            ${item.total.toLocaleString()}
                          </div>
                          <div className="text-xs text-[#6B7280] mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{item.eta}</div>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2.5 border-t border-[#E8E4DC] flex items-center gap-1.5">
                        <CheckCircle size={11} className="text-[#166534] flex-shrink-0" />
                        <span className="text-xs text-[#166534] font-medium" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{item.genesisStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 border-t border-[#E8E4DC] flex items-center justify-between flex-shrink-0 bg-[#FAFAF8] rounded-b-2xl">
          <div className="text-xs text-[#6B7280]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
            Total PO value submitted to Genesis Core:{' '}
            <span className="font-semibold text-[#1A2F4A]">${reorderTotal.toLocaleString()}</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-white bg-[#1B6B6B] px-5 py-2 rounded-full hover:bg-[#155555] transition-colors"
            style={{fontFamily:'IBM Plex Sans,sans-serif'}}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Badge maps ─────────────────────────────────────────────── */
const modTag = {
  'RECALL':            { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]', short: 'RECALL' },
  'OR READINESS':      { bg: 'bg-[#D4EEEE]', text: 'text-[#1B6B6B]', short: 'OR' },
  'REVENUE INTEGRITY': { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]', short: 'REVENUE' },
};

const riskBadge = {
  danger:  { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
  warning: { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]' },
  success: { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]' },
  info:    { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]' },
};

/* ── Module health side-cards ───────────────────────────────── */
const moduleCards = [
  {
    icon: <AlertTriangle size={14} className="text-[#991B1B]" />,
    label: 'Recall Command',
    status: 'ACTIVE',
    statusColor: '#991B1B', statusBg: '#FEE2E2',
    lines: ['1 active recall · Class II', '3 patients potentially exposed', '2 units quarantined ✓'],
    screen: 4, borderColor: '#991B1B',
  },
  {
    icon: <Activity size={14} className="text-[#B45309]" />,
    label: 'OR Readiness',
    status: '2 AT RISK',
    statusColor: '#B45309', statusBg: '#FEF3C7',
    lines: ['XR-7 deficit 2 units Thursday', 'Pressure Kit — census +40%', 'Bone Graft — expiry Friday'],
    screen: 2, borderColor: '#B45309',
  },
  {
    icon: <TrendingUp size={14} className="text-[#166534]" />,
    label: 'Revenue Integrity',
    status: '$12,500',
    statusColor: '#166534', statusBg: '#DCFCE7',
    lines: ['8 charge gaps identified', '$3,528 top opportunity', '74% avg recovery confidence'],
    screen: 3, borderColor: '#166534',
  },
];

/* ── Dashboard ──────────────────────────────────────────────── */
export default function Screen1_Dashboard({ navigate }) {
  const [confirmed, setConfirmed]       = useState({});
  const [showAutoHandled, setShowPanel] = useState(false);
  const confirm = (id, msg) => setConfirmed(prev => ({ ...prev, [id]: msg }));

  const donutSegments = [
    { label: 'Recall',  value: 1, color: '#991B1B' },
    { label: 'OR Risk', value: 4, color: '#1B6B6B' },
    { label: 'Revenue', value: 2, color: '#166534' },
  ];

  const kpis = [
    {
      label: 'ITEMS MONITORED',
      value: sentinelRun.totalSKUs.toLocaleString(),
      sub: `${sentinelRun.autoHandled} auto-handled overnight`,
      subIsLink: true,
      icon: <LayoutDashboard size={20} className="text-[#1B6B6B]" />,
      iconBg: 'bg-[#D4EEEE]',
    },
    {
      label: 'DECISIONS PENDING',
      value: sentinelRun.decisionsForSarah,
      sub: 'Require your action today',
      icon: <AlertTriangle size={20} className="text-[#991B1B]" />,
      iconBg: 'bg-[#FEE2E2]',
    },
    {
      label: 'RECOVERABLE',
      value: `$${sentinelRun.recoverableThisWeek.toLocaleString()}`,
      sub: '8 charge gaps · 74% confidence',
      icon: <TrendingUp size={20} className="text-[#166534]" />,
      iconBg: 'bg-[#DCFCE7]',
    },
    {
      label: 'ACTIVE RECALLS',
      value: sentinelRun.activeRecalls,
      sub: '3 patients potentially exposed',
      icon: <Activity size={20} className="text-[#B45309]" />,
      iconBg: 'bg-[#FEF3C7]',
    },
  ];

  const actionItems = priorityQueue.filter(i => !i.autoResolved);

  return (
    <>
      {showAutoHandled && <AutoHandledModal onClose={() => setShowPanel(false)} />}

      <div>
        {/* Greeting header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{color:'#4A6B8A', fontFamily:'IBM Plex Sans,sans-serif'}}
            >
              Good morning
            </div>
            <h1 className="text-2xl font-bold text-[#1A2F4A] leading-tight" style={{fontFamily:'Syne,sans-serif'}}>
              Sarah Chen
              <span className="text-base font-normal text-[#6B7280] ml-2">VP Supply Chain</span>
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              Valley Regional Medical Center · Tue 29 Apr 2026
            </p>
          </div>
          <div
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-shrink-0"
            style={{backgroundColor:'#DCFCE7', border:'1px solid rgba(22,101,52,0.2)'}}
          >
            <CheckCircle size={15} className="text-[#166534] flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-[#166534]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                Agent ran at 02:00am
              </div>
              <div className="text-xs mt-0.5" style={{color:'rgba(22,101,52,0.7)', fontFamily:'IBM Plex Sans,sans-serif'}}>
                847 SKUs · 21s · 10 auto-handled
              </div>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-4 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div
                  className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-2 leading-snug"
                  style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                >
                  {k.label}
                </div>
                <div className="text-3xl font-bold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>
                  {k.value}
                </div>
                {k.subIsLink ? (
                  <button
                    onClick={() => setShowPanel(true)}
                    className="text-xs text-[#1B6B6B] mt-1 hover:underline text-left leading-snug"
                    style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                  >
                    {k.sub} →
                  </button>
                ) : (
                  <div className="text-xs text-[#6B7280] mt-1 leading-snug" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                    {k.sub}
                  </div>
                )}
              </div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${k.iconBg}`}>
                {k.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Main 3-col grid */}
        <div className="grid grid-cols-3 gap-5">

          {/* Left col */}
          <div className="col-span-1 flex flex-col gap-4">

            {/* Donut */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">
              <div
                className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-4"
                style={{fontFamily:'IBM Plex Sans,sans-serif'}}
              >
                ITEMS BY MODULE
              </div>
              <div className="flex items-center gap-5">
                <DonutChart segments={donutSegments} size={100} />
                <div className="space-y-2 flex-1 min-w-0">
                  {donutSegments.map(s => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:s.color}} />
                      <span className="text-xs text-[#6B7280] truncate" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{s.label}</span>
                      <span className="text-xs font-bold text-[#1A2F4A] ml-auto flex-shrink-0" style={{fontFamily:'Syne,sans-serif'}}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module health cards */}
            {moduleCards.map(m => (
              <button
                key={m.label}
                onClick={() => navigate(m.screen)}
                className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-4 text-left hover:shadow-md transition-all group w-full"
                style={{borderLeftWidth:'3px', borderLeftColor:m.borderColor}}
              >
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0">{m.icon}</span>
                    <span
                      className="text-xs font-semibold text-[#1A2F4A] uppercase tracking-wide truncate"
                      style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                    >
                      {m.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{color:m.statusColor, backgroundColor:m.statusBg, fontFamily:'IBM Plex Sans,sans-serif'}}
                    >
                      {m.status}
                    </span>
                    <ArrowRight size={11} className="text-[#6B7280] group-hover:text-[#1B6B6B] transition-colors flex-shrink-0" />
                  </div>
                </div>
                <ul className="space-y-1">
                  {m.lines.map((line, i) => (
                    <li key={i} className="text-xs text-[#6B7280] flex items-start gap-1.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
                      <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{backgroundColor:m.borderColor, opacity:0.5}} />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {/* Right col */}
          <div className="col-span-2 flex flex-col gap-4">

            {/* Action table */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8E4DC]">
                <div
                  className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]"
                  style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                >
                  IMMEDIATE ACTION REQUIRED
                </div>
                <span className="text-xs font-bold text-[#991B1B] bg-[#FEE2E2] px-2.5 py-0.5 rounded-full">
                  {actionItems.filter(i => !confirmed[i.id]).length} pending
                </span>
              </div>

              {/* Column headers */}
              <div
                className="grid px-5 py-2 border-b border-[#E8E4DC] bg-[#FAFAF8] text-xs font-semibold text-[#6B7280] uppercase tracking-wide"
                style={{gridTemplateColumns:'70px 1fr 100px 148px', fontFamily:'IBM Plex Sans,sans-serif'}}
              >
                <div>Module</div>
                <div>Item · Summary</div>
                <div>Risk</div>
                <div>Action</div>
              </div>

              {actionItems.map(item => {
                const isConfirmed = !!confirmed[item.id];
                const mt = modTag[item.module] || modTag['OR READINESS'];
                const rb = riskBadge[item.badgeVariant] || riskBadge.warning;

                return (
                  <div
                    key={item.id}
                    className={`grid px-5 py-3.5 border-b border-[#E8E4DC] last:border-0 items-center transition-colors ${isConfirmed ? 'bg-[#F9FFF9]' : 'hover:bg-[#FAFAF8]'}`}
                    style={{gridTemplateColumns:'70px 1fr 100px 148px'}}
                  >
                    {/* Module badge */}
                    <div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mt.bg} ${mt.text}`}
                        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                      >
                        {mt.short}
                      </span>
                    </div>

                    {/* Title + summary */}
                    <div className="pr-3 min-w-0">
                      <div
                        className="text-sm font-semibold text-[#1A2F4A] truncate"
                        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                      >
                        {item.title}
                      </div>
                      <div
                        className="text-xs text-[#6B7280] truncate mt-0.5"
                        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                      >
                        {item.department} · {item.summary}
                      </div>
                      {isConfirmed && (
                        <div
                          className="text-xs text-[#166534] mt-0.5 flex items-center gap-1"
                          style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                        >
                          <CheckCircle size={10} className="flex-shrink-0" /> {confirmed[item.id]}
                        </div>
                      )}
                    </div>

                    {/* Risk badge */}
                    <div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${rb.bg} ${rb.text}`}
                        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                      >
                        {item.badge}
                      </span>
                    </div>

                    {/* Action button */}
                    <div>
                      {isConfirmed ? (
                        <div
                          className="flex items-center gap-1.5 text-xs text-[#166534] font-medium"
                          style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                        >
                          <CheckCircle size={12} className="flex-shrink-0" /> Done
                        </div>
                      ) : item.isInline ? (
                        <button
                          onClick={() => confirm(item.id, item.confirmMessage)}
                          className="text-xs font-semibold text-[#1B6B6B] border-2 border-[#1B6B6B] px-3.5 py-1.5 rounded-full hover:bg-[#1B6B6B] hover:text-white transition-colors whitespace-nowrap"
                          style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                        >
                          {item.cta}
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(item.ctaScreen)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1B6B6B] px-3.5 py-1.5 rounded-full hover:bg-[#155555] transition-colors whitespace-nowrap"
                          style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                        >
                          {item.cta} <ArrowRight size={10} className="flex-shrink-0" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overnight pipeline */}
            <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]"
                  style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                >
                  OVERNIGHT AUTOMATION PIPELINE
                </div>
                <button
                  onClick={() => navigate(5)}
                  className="text-xs font-semibold text-[#1B6B6B] hover:text-[#155555] transition-colors"
                  style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                >
                  View agent log →
                </button>
              </div>

              {/* Pipeline stages */}
              <div className="flex items-center gap-1 mb-4">
                {[
                  { count: 847, label: 'SKUs scanned',   color: '#1A2F4A', bg: '#E8E4DC' },
                  { count: 10,  label: 'Auto-resolved',  color: '#166534', bg: '#DCFCE7' },
                  { count: 8,   label: 'POs placed',     color: '#1B6B6B', bg: '#D4EEEE' },
                  { count: 2,   label: 'Gaps recovered', color: '#166534', bg: '#DCFCE7' },
                  { count: 7,   label: 'Escalated',      color: '#B45309', bg: '#FEF3C7' },
                ].map((stage, i, arr) => (
                  <div key={stage.label} className="flex items-center gap-1 flex-1 min-w-0">
                    <div className="flex-1 text-center min-w-0">
                      <div
                        className="text-sm font-bold mx-auto w-9 h-9 rounded-full flex items-center justify-center mb-1"
                        style={{fontFamily:'Syne,sans-serif', color:stage.color, backgroundColor:stage.bg}}
                      >
                        {stage.count}
                      </div>
                      <div
                        className="text-[10px] text-[#6B7280] leading-tight"
                        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                      >
                        {stage.label}
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <ArrowRight size={10} className="text-[#D0D0D0] flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {/* View items link */}
              <div className="border-t border-[#E8E4DC] pt-3 flex items-center justify-between gap-3">
                <div
                  className="text-xs text-[#6B7280] min-w-0"
                  style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                >
                  8 purchase orders · 2 charge gap recoveries · Total PO value: $3,902
                </div>
                <button
                  onClick={() => setShowPanel(true)}
                  className="text-xs font-semibold text-[#1B6B6B] border-2 border-[#1B6B6B] px-3.5 py-1.5 rounded-full hover:bg-[#1B6B6B] hover:text-white transition-colors flex-shrink-0"
                  style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                >
                  View 10 items →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
