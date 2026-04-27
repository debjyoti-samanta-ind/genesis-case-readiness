const tabs = [
  { id: 1, label: 'Dashboard' },
  { id: 2, label: 'OR Readiness' },
  { id: 3, label: 'Revenue Integrity' },
  { id: 4, label: 'Recall' },
  { id: 5, label: 'Agent Log' },
];

export default function NavBar({ currentScreen, navigate }) {
  return (
    <nav className="bg-white border-b border-[#E8E4DC] px-6 sticky top-[57px] z-40">
      <div className="max-w-7xl mx-auto flex items-center gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              currentScreen === tab.id
                ? 'border-[#1B6B6B] text-[#1B6B6B]'
                : 'border-transparent text-[#1A2F4A] hover:text-[#1B6B6B] hover:border-[#D4EEEE]'
            }`}
            style={{fontFamily:'IBM Plex Sans,sans-serif'}}
          >
            {tab.id} · {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
