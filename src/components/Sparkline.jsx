export default function Sparkline({ data, highlightIndices = [4, 5] }) {
  const width = 280;
  const height = 80;
  const barWidth = 14;
  const gap = 6;
  const maxVal = Math.max(...data);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((val, i) => {
        const barHeight = (val / maxVal) * (height - 10);
        const x = i * (barWidth + gap) + 4;
        const y = height - barHeight;
        const isHighlight = highlightIndices.includes(i);
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill={isHighlight ? '#B45309' : '#1B6B6B'}
            opacity={isHighlight ? 1 : 0.45}
          />
        );
      })}
    </svg>
  );
}
