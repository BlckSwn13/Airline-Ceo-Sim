// src/App.tsx
import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import OCC from './components/OCC';
import EventFeedPage from './pages/EventFeedPage';

type Tab = 'dashboard' | 'occ' | 'events';

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard');

  useEffect(() => {
    // Branding-Variablen (Fallbacks)
    const root = document.documentElement;
    if (!getComputedStyle(root).getPropertyValue('--brand-1')) {
      root.style.setProperty('--brand-1', '#38bdf8'); // cyan-400
    }
    if (!getComputedStyle(root).getPropertyValue('--brand-2')) {
      root.style.setProperty('--brand-2', '#a78bfa'); // violet-400
    }
  }, []);

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-[#0b0f1a] to-[#0e0b1a]">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="font-semibold tracking-wide">Crown Aviation – CEO Simulator</div>
          <nav className="ml-auto flex gap-2">
            <NavButton active={tab==='dashboard'} onClick={() => setTab('dashboard')}>Dashboard</NavButton>
            <NavButton active={tab==='occ'} onClick={() => setTab('occ')}>OCC</NavButton>
            <NavButton active={tab==='events'} onClick={() => setTab('events')}>Event-Feed</NavButton>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'occ' && <OCC />}
        {tab === 'events' && <EventFeedPage />}
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-8 text-xs opacity-60">
        Liquid-Glass UI • modern • rounded • Ava ready
      </footer>
    </div>
  );
}

function NavButton({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl border transition ${
        active ? 'border-white/30 bg-white/10' : 'border-white/10 hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}
