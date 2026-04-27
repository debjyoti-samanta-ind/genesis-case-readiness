export default function RiskScore({ score }) {
  const scoreColor = score >= 75 ? '#991B1B' : score >= 50 ? '#B45309' : '#166534';

  return (
    <div className="flex flex-col items-center">
      <span className="font-bold leading-none" style={{fontFamily:'Syne,sans-serif', fontSize:'3.5rem', color: scoreColor}}>
        {score}
      </span>
      <svg width="80" height="22" viewBox="0 0 80 22" className="mt-1">
        <path d="M 8 20 A 32 32 0 0 1 72 20" fill="none" stroke="#E8E4DC" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M 8 20 A 32 32 0 0 1 72 20"
          fill="none"
          stroke={scoreColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${score} 100`}
          pathLength="100"
        />
      </svg>
      <span className="text-xs text-[#6B7280] mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>/100</span>
    </div>
  );
}
