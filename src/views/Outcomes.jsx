import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { weeklyOutcomes } from '../data/syntheticData';

const { summary, dailyBreakdown, surgeonVariance } = weeklyOutcomes;

/* ── Delta pill ─────────────────────────────────────────────── */
function DeltaPill({ delta, deltaDir }) {
  const isGood = deltaDir === 'up' || deltaDir === 'down-good';
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-2"
      style={{
        backgroundColor: isGood ? '#DCFCE7' : '#FEE2E2',
        color: isGood ? '#166534' : '#991B1B',
        fontFamily: 'IBM Plex Sans, sans-serif',
      }}
    >
      {delta}
    </span>
  );
}

/* ── Summary card ───────────────────────────────────────────── */
function SummaryCard({ label, value, sub, delta, deltaDir, color }) {
  return (
    <div
      className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5 flex flex-col"
    >
      <div
        className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-3"
        style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
      >
        {label}
      </div>
      <div
        className="text-3xl font-bold leading-none"
        style={{ fontFamily: 'Syne, sans-serif', color }}
      >
        {value}
      </div>
      <div
        className="text-xs text-[#6B7280] mt-1"
        style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
      >
        {sub}
      </div>
      <DeltaPill delta={delta} deltaDir={deltaDir} />
    </div>
  );
}

/* ── Recharts custom tooltip ────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white border border-[#E8E4DC] rounded-lg shadow-md px-4 py-3 text-sm"
      style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
    >
      <div className="font-semibold text-[#1A2F4A] mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
            style={{ backgroundColor: p.fill }}
          />
          <span className="text-[#6B7280]">{p.name}:</span>
          <span className="font-semibold text-[#1A2F4A]">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Trend icon ─────────────────────────────────────────────── */
function TrendIcon({ trend }) {
  if (trend === 'up')   return <TrendingUp  size={14} className="text-[#166534]" />;
  if (trend === 'down') return <TrendingDown size={14} className="text-[#991B1B]" />;
  return <Minus size={14} className="text-[#6B7280]" />;
}

/* ── Score pill ─────────────────────────────────────────────── */
function ScorePill({ score }) {
  const bg    = score >= 85 ? '#DCFCE7' : score >= 75 ? '#FEF3C7' : '#FEE2E2';
  const color = score >= 85 ? '#166534' : score >= 75 ? '#B45309' : '#991B1B';
  return (
    <span
      className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full"
      style={{ backgroundColor: bg, color, fontFamily: 'IBM Plex Mono, monospace' }}
    >
      {score}
    </span>
  );
}

/* ── Main view ──────────────────────────────────────────────── */
export default function Outcomes() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-[#1A2F4A]"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Weekly Outcomes
        </h1>
        <p
          className="text-sm text-[#6B7280] mt-1"
          style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
        >
          Week of 28 Apr – 2 May 2026 · 47 cases · Sentinel agent run nightly at 02:00am
        </p>
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {summary.map(card => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-6 mb-6">
        <div className="mb-5">
          <div
            className="text-base font-bold text-[#1A2F4A]"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Daily Case Breakdown
          </div>
          <div
            className="text-xs text-[#6B7280] mt-0.5"
            style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
          >
            Cases cleared vs at-risk per day — Mon 28 Apr to Fri 2 May
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={dailyBreakdown}
            barCategoryGap="32%"
            barGap={3}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DC" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F5F3EE' }} />
            <Legend
              wrapperStyle={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 12, paddingTop: 12 }}
              iconType="square"
              iconSize={10}
            />
            <Bar dataKey="cleared" name="Cleared" fill="#1B6B6B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="atRisk"  name="At-Risk"  fill="#991B1B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Surgeon variance table */}
      <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E4DC]">
          <div
            className="text-base font-bold text-[#1A2F4A]"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Surgeon Variance
          </div>
          <div
            className="text-xs text-[#6B7280] mt-0.5"
            style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
          >
            Readiness score, flagged items, and savings by surgeon this week
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E8E4DC]">
              {['Surgeon', 'Specialty', 'Cases', 'Avg Score', 'Flagged Items', 'Savings', 'Trend'].map(col => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#6B7280]"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {surgeonVariance.map((row, i) => (
              <tr
                key={row.name}
                className={`border-b border-[#E8E4DC] last:border-0 ${
                  i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'
                }`}
              >
                <td
                  className="px-6 py-4 font-semibold text-[#1A2F4A]"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  {row.name}
                </td>
                <td
                  className="px-6 py-4 text-[#6B7280]"
                  style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
                >
                  {row.specialty}
                </td>
                <td
                  className="px-6 py-4 font-mono text-[#1A2F4A]"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {row.cases}
                </td>
                <td className="px-6 py-4">
                  <ScorePill score={row.readinessAvg} />
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-semibold ${
                      row.flaggedItems === 0
                        ? 'text-[#166534]'
                        : row.flaggedItems <= 2
                        ? 'text-[#B45309]'
                        : 'text-[#991B1B]'
                    }`}
                    style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                  >
                    {row.flaggedItems}
                  </span>
                </td>
                <td
                  className="px-6 py-4 font-semibold text-[#166534]"
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {row.savingsCapture}
                </td>
                <td className="px-6 py-4">
                  <TrendIcon trend={row.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
