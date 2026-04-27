export default function Header() {
  return (
    <header className="bg-white border-b border-[#E8E4DC] px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B6B6B] inline-block" />
            <span className="text-[#1B6B6B] font-bold text-lg" style={{fontFamily:'Syne,sans-serif'}}>genesis</span>
          </div>
          <span className="text-[#E8E4DC] text-sm mx-1">|</span>
          <span className="text-xs text-[#6B7280]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>Sentinel · Valley Regional</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-[#1A2F4A]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>Sarah Chen</div>
            <div className="text-xs text-[#6B7280]">VP Supply Chain</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#1B6B6B] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">SC</span>
          </div>
        </div>
      </div>
    </header>
  );
}
