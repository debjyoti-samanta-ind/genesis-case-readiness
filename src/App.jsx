import { useState } from 'react';
import {
  LayoutDashboard, Activity, TrendingUp, AlertTriangle, ScrollText,
  CheckCircle, ChevronRight, BarChart2
} from 'lucide-react';
import Screen1_Dashboard from './screens/Screen1_Dashboard';
import Screen2_ORReadiness from './screens/Screen2_ORReadiness';
import Screen3_RevenueIntegrity from './screens/Screen3_RevenueIntegrity';
import Screen4_RecallCommand from './screens/Screen4_RecallCommand';
import Screen5_AgentLog from './screens/Screen5_AgentLog';
import Screen6_Confirmed from './screens/Screen6_Confirmed';
import Outcomes from './views/Outcomes';

const navItems = [
  { id: 1, label: 'Dashboard', icon: LayoutDashboard },
  { id: 2, label: 'OR Readiness', icon: Activity },
  { id: 3, label: 'Revenue Integrity', icon: TrendingUp },
  { id: 4, label: 'Recall Command', icon: AlertTriangle },
  { id: 5, label: 'Agent Log', icon: ScrollText },
  { id: 7, label: 'Outcomes', icon: BarChart2 },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [approvalType, setApprovalType] = useState('substitute');

  const navigate = (screen) => setCurrentScreen(screen);
  const navigateWithApproval = (screen, type) => {
    setApprovalType(type);
    setCurrentScreen(screen);
  };

  const screens = {
    1: <Screen1_Dashboard navigate={navigate} />,
    2: <Screen2_ORReadiness navigate={navigate} navigateWithApproval={navigateWithApproval} />,
    3: <Screen3_RevenueIntegrity navigate={navigate} />,
    4: <Screen4_RecallCommand navigate={navigate} />,
    5: <Screen5_AgentLog navigate={navigate} />,
    6: <Screen6_Confirmed navigate={navigate} approvalType={approvalType} />,
    7: <Outcomes />,
  };

  return (
    <div className="flex min-h-screen bg-[#F5F3EE]">

      {/* Dark left sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-y-auto" style={{backgroundColor:'#0F1E2E'}}>
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{borderColor:'#1E3A5F'}}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] flex-shrink-0" />
            <span className="text-white font-bold text-base" style={{fontFamily:'Syne,sans-serif'}}>genesis</span>
          </div>
          <div className="text-xs mt-0.5 ml-4" style={{color:'#4A6B8A', fontFamily:'IBM Plex Sans,sans-serif'}}>Sentinel</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3 px-2" style={{color:'#4A6B8A', fontFamily:'IBM Plex Sans,sans-serif'}}>
            Command Center
          </div>
          <ul className="space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = currentScreen === item.id || (currentScreen === 6 && item.id === 2);
              return (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                      active
                        ? 'bg-[#1B6B6B] text-white'
                        : 'text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white'
                    }`}
                    style={{fontFamily:'IBM Plex Sans,sans-serif'}}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    {item.label}
                    {item.id === 4 && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-[#991B1B]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Sentinel status */}
          <div className="mt-6 mx-1 rounded-lg p-3" style={{backgroundColor:'#1E3A5F'}}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={12} className="text-[#2DD4BF]" />
              <span className="text-xs font-semibold text-[#2DD4BF]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>Last agent run</span>
            </div>
            <div className="text-xs text-[#94A3B8]" style={{fontFamily:'IBM Plex Mono,monospace'}}>Today, 02:00am</div>
            <div className="text-xs text-[#94A3B8] mt-0.5" style={{fontFamily:'IBM Plex Mono,monospace'}}>847 SKUs · 21s</div>
          </div>
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t" style={{borderColor:'#1E3A5F'}}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1B6B6B] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">SC</span>
            </div>
            <div>
              <div className="text-xs font-medium text-white" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>Sarah Chen</div>
              <div className="text-xs" style={{color:'#4A6B8A', fontFamily:'IBM Plex Sans,sans-serif'}}>VP Supply Chain</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E8E4DC] px-8 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <span className="text-sm font-semibold text-[#1A2F4A]" style={{fontFamily:'Syne,sans-serif'}}>
              {navItems.find(n => n.id === currentScreen || (currentScreen === 6 && n.id === 2))?.label ?? 'Decision Confirmed'}
            </span>
            <span className="text-xs text-[#6B7280] ml-3" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              Tue 29 Apr 2026
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6B7280]" style={{fontFamily:'IBM Plex Sans,sans-serif'}}>
              Last updated: 02:00am
            </span>
            <button
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1A2F4A] border border-[#E8E4DC] px-3 py-1.5 rounded-lg hover:border-[#1B6B6B] hover:text-[#1B6B6B] transition-colors bg-white"
              style={{fontFamily:'IBM Plex Sans,sans-serif'}}
            >
              <ChevronRight size={12} /> Export Report
            </button>
          </div>
        </header>

        {/* Screen content */}
        <main className="flex-1 px-8 py-6 overflow-auto">
          {screens[currentScreen]}
        </main>
      </div>
    </div>
  );
}
