import { useState } from 'react'
import { LayoutDashboard, Activity, TrendingUp, ScrollText, CheckCircle } from 'lucide-react'
import { currentUser, agentRun } from './data/syntheticData'
import Dashboard from './views/Dashboard'
import TodaysOR from './views/TodaysOR'
import Outcomes from './views/Outcomes'
import AgentLog from './views/AgentLog'
import PostCaseReport from './views/PostCaseReport'

const navItems = [
  { id: 'dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'todaysOR',  label: "Today's OR",  icon: Activity },
  { id: 'outcomes',  label: 'Outcomes',    icon: TrendingUp },
  { id: 'agentLog',  label: 'Agent Log',   icon: ScrollText },
]

export default function App() {
  const [currentView, setCurrentView]       = useState('dashboard')
  const [selectedCaseId, setSelectedCaseId] = useState(null)

  const navigate = (view, caseId = null) => {
    setCurrentView(view)
    setSelectedCaseId(caseId)
  }

  const activeNavId = currentView === 'postCase' ? 'todaysOR' : currentView

  const viewMap = {
    dashboard: <Dashboard    navigate={navigate} />,
    todaysOR:  <TodaysOR     navigate={navigate} selectedCaseId={selectedCaseId} />,
    outcomes:  <Outcomes     navigate={navigate} />,
    agentLog:  <AgentLog     navigate={navigate} />,
    postCase:  <PostCaseReport navigate={navigate} caseId={selectedCaseId} />,
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F5F3EF' }}>

      {/* Dark navy sidebar */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col sticky top-0 h-screen overflow-y-auto"
        style={{ backgroundColor: '#1a1f2e' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: '#2a3045' }}>
          <div className="flex items-center gap-2">
            {/* Genesis Primary Green — required on every screen */}
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#81D24C' }} />
            <span className="text-white font-bold text-base">genesis</span>
          </div>
          <div className="text-xs mt-0.5 pl-4" style={{ color: '#909BA6' }}>Case Readiness</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3 px-2" style={{ color: '#909BA6' }}>
            Navigation
          </div>
          <ul className="space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon
              const active = activeNavId === item.id
              return (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left"
                    style={{
                      backgroundColor: active ? '#095256' : 'transparent',
                      color: active ? '#ffffff' : '#909BA6',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = '#2a3045'
                        e.currentTarget.style.color = '#ffffff'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#909BA6'
                      }
                    }}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Last agent run status box */}
          <div className="mt-6 mx-1 rounded-lg p-3" style={{ backgroundColor: '#2a3045' }}>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={12} style={{ color: '#009999' }} />
              <span className="text-xs font-semibold" style={{ color: '#009999' }}>Last agent run</span>
            </div>
            <div className="text-xs" style={{ color: '#909BA6', fontFamily: 'IBM Plex Mono, monospace' }}>
              {agentRun.date}, {agentRun.lastRun}
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#909BA6', fontFamily: 'IBM Plex Mono, monospace' }}>
              {agentRun.totalSKUsMonitored} SKUs · {agentRun.runDurationSeconds}s
            </div>
            <div className="text-xs mt-1" style={{ color: '#81D24C' }}>
              {agentRun.autoHandledOvernight} auto-handled · {agentRun.decisionsRequiringHuman} pending
            </div>
          </div>
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t" style={{ borderColor: '#2a3045' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#095256' }}
            >
              <span className="text-white text-xs font-bold">{currentUser.initials}</span>
            </div>
            <div>
              <div className="text-xs font-medium text-white">{currentUser.name}</div>
              <div className="text-xs" style={{ color: '#909BA6' }}>{currentUser.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 min-w-0 px-8 py-8 overflow-auto">
        {viewMap[currentView] ?? viewMap['dashboard']}
      </main>
    </div>
  )
}
