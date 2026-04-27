import { CheckCircle } from 'lucide-react';

export default function ConfirmedState({ message }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-[#DCFCE7] rounded-lg border border-[#166534] border-opacity-20">
      <CheckCircle className="text-[#166534] flex-shrink-0 mt-0.5" size={20} />
      <div>
        <div className="text-sm font-semibold text-[#166534]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>Confirmed</div>
        <div className="text-sm text-[#166534] opacity-80 mt-0.5" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>{message}</div>
      </div>
    </div>
  );
}
