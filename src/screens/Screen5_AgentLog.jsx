import { ArrowLeft } from 'lucide-react';
import { agentLogLines, governanceTable } from '../mockData/agentLog';

const lineColors = {
  header:   '#2DD4BF',
  system:   '#94A3B8',
  item:     '#E2E8F0',
  indent:   '#64748B',
  decision: '#FCD34D',
  success:  '#86EFAC',
};

export default function Screen5_AgentLog({ navigate }) {
  return (
    <div>
      <button
        onClick={() => navigate(1)}
        className="flex items-center gap-1 text-sm text-[#1B6B6B] hover:text-[#155555] mb-6 font-medium"
        style={{fontFamily:'IBM Plex Sans,sans-serif'}}
      >
        <ArrowLeft size={16} /> Back to dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>Agent Reasoning Log</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#6B7280]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
            Run: Tuesday 29 April 2026, 02:00am
          </span>
          <span className="bg-[#DCFCE7] text-[#166534] text-xs font-semibold px-3 py-1 rounded-full">
            COMPLETED — 21 seconds
          </span>
        </div>
      </div>

      {/* Terminal log */}
      <div className="rounded-xl overflow-hidden mb-8" style={{backgroundColor:'#0A1628'}}>
        <div className="px-4 py-3 border-b flex items-center gap-2" style={{borderColor:'#1E3A5F'}}>
          <div className="w-3 h-3 rounded-full bg-[#991B1B]" />
          <div className="w-3 h-3 rounded-full bg-[#B45309]" />
          <div className="w-3 h-3 rounded-full bg-[#166534]" />
          <span className="text-xs ml-2" style={{fontFamily:'IBM Plex Mono,monospace', color:'#4A6B8A'}}>
            sentinel-run-2026-04-29-0200.log
          </span>
        </div>
        <div className="p-5 overflow-x-auto">
          {agentLogLines.map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-3 mb-0.5"
              style={{fontFamily:'IBM Plex Mono,monospace', fontSize:'0.72rem', lineHeight:'1.7'}}
            >
              <span className="flex-shrink-0 w-20" style={{color:'#2DD4BF'}}>
                {line.time ? `[${line.time}]` : ''}
              </span>
              <span style={{color: lineColors[line.type] || '#94A3B8'}}>{line.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Governance table */}
      <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E8E4DC]">
          <div className="text-sm font-semibold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>
            Why each decision was made
          </div>
          <div className="text-xs text-[#6B7280] mt-1" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
            Governance rules applied to each of the 7 priority items
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F3EE] border-b border-[#E8E4DC]">
                {['Level', 'Item', 'Governance Rule Applied', 'Decision'].map(h => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide"
                    style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {governanceTable.map((row, i) => (
                <tr key={i} className="border-b border-[#E8E4DC] last:border-0 hover:bg-[#F5F3EE]">
                  <td className="px-5 py-4 text-sm whitespace-nowrap">
                    {row.icon} <span className="text-[#1A2F4A] font-medium" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{row.level}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{row.item}</td>
                  <td className="px-5 py-4 text-sm text-[#6B7280]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{row.rule}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#1B6B6B]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{row.decision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
