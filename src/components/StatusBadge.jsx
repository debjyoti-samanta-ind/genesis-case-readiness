const statusConfig = {
  'CLEAR':      { bg: 'bg-green-100',  text: 'text-green-800',  label: 'CLEAR' },
  'WATCH':      { bg: 'bg-amber-100',  text: 'text-amber-800',  label: 'WATCH' },
  'AT_RISK':    { bg: 'bg-red-100',    text: 'text-red-700',    label: 'AT RISK' },
  'AT RISK':    { bg: 'bg-red-100',    text: 'text-red-700',    label: 'AT RISK' },
  'NO-GO':      { bg: 'bg-red-900',    text: 'text-white',      label: 'NO-GO' },
  'AUTO':       { bg: 'bg-teal-100',   text: 'text-teal-800',   label: 'AUTO-HANDLED' },
  'ESCALATED':  { bg: 'bg-orange-100', text: 'text-orange-800', label: 'ESCALATED' },
  'PPI':        { bg: 'bg-red-100',    text: 'text-red-700',    label: 'PPI — ESCALATE' },
  'MVP':        { bg: 'bg-gray-100',   text: 'text-gray-500',   label: 'MVP PROXY' },
  'CONFIRMED':  { bg: 'bg-green-50',   text: 'text-green-700',  label: 'CONFIRMED' },
  'COMPLETED':  { bg: 'bg-teal-50',    text: 'text-teal-700',   label: 'COMPLETED' },
  'PENDING':    { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'PENDING' },
}

export default function StatusBadge({ status }) {
  const config = statusConfig[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: status }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
