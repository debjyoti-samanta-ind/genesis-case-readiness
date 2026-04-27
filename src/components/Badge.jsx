const variants = {
  'success':     { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]' },
  'warning':     { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]' },
  'danger':      { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
  'info':        { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]' },
  'teal':        { bg: 'bg-[#D4EEEE]', text: 'text-[#1B6B6B]' },
  'neutral':     { bg: 'bg-[#F5F3EE]', text: 'text-[#6B7280]' },
  'module-or':   { bg: 'bg-[#D4EEEE]', text: 'text-[#1B6B6B]' },
  'module-rev':  { bg: 'bg-[#DCFCE7]', text: 'text-[#166534]' },
  'module-rec':  { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
};

export default function Badge({ label, variant = 'neutral' }) {
  const { bg, text } = variants[variant] || variants.neutral;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${bg} ${text}`}
      style={{fontFamily:'IBM Plex Sans,sans-serif'}}
    >
      {label}
    </span>
  );
}
