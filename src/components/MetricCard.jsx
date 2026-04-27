export default function MetricCard({ value, label, sublabel, valueColor = '#1A2F4A' }) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E4DC] shadow-sm p-5">
      <div className="text-3xl font-bold mb-1" style={{fontFamily:'Syne,sans-serif', color: valueColor}}>
        {value}
      </div>
      <div className="text-sm font-medium text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{label}</div>
      {sublabel && <div className="text-xs text-[#6B7280] mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{sublabel}</div>}
    </div>
  );
}
