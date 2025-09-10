import React, { useState } from 'react';
import Dashboard from '@components/Dashboard';
import OCC from '@components/OCC';
import HRPage from '../pages/HRPage';
import ChatDock from '@components/ChatDock';
import { UserConfig } from '@types';

interface LayoutProps {
  userConfig: UserConfig;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ userConfig, onLogout }) => {
  const [tab, setTab] = useState<'dashboard' | 'occ' | 'hr'>('dashboard');

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] gap-4">
      {/* Header */}
      <header className="glass-panel rounded-2xl border border-white/10 p-3 flex items-center justify-between">
        <div className="font-semibold">{userConfig.airlineName || 'Airline'}</div>
        <nav className="flex items-center gap-2">
          <button onClick={() => setTab('dashboard')} className={`px-3 py-1 rounded-lg ${tab==='dashboard'?'bg-[var(--brand-1)] text-black':'bg-white/5 border border-white/10'}`}>Dashboard</button>
          <button onClick={() => setTab('occ')} className={`px-3 py-1 rounded-lg ${tab==='occ'?'bg-[var(--brand-1)] text-black':'bg-white/5 border border-white/10'}`}>OCC</button>
          <button onClick={() => setTab('hr')} className={`px-3 py-1 rounded-lg ${tab==='hr'?'bg-[var(--brand-1)] text-black':'bg-white/5 border border-white/10'}`}>HR</button>
        </nav>
        <button onClick={onLogout} className="px-3 py-1 rounded-lg bg-white/10 border border-white/10">Logout</button>
      </header>

      {/* Content */}
      <main className="glass-panel rounded-2xl border border-white/10 p-4 overflow-auto">
        {tab === 'dashboard' && <Dashboard user={userConfig} />}
        {tab === 'occ' && <OCC />}
        {tab === 'hr' && <HRPage />}
      </main>

      {/* Chat global */}
      <ChatDock />
    </div>
  );
};

export default Layout;
