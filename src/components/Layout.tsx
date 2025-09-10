import React, { useState, useEffect } from 'react';
import Dashboard from '@components/Dashboard';
import OCC from '@components/OCC';
import HRPage from '../pages/HRPage';
import { UserConfig } from '@types';

interface LayoutProps {
  userConfig: UserConfig;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ userConfig, onLogout }) => {
  const [tab, setTab] = useState<'dashboard' | 'occ' | 'fleet' | 'finance' | 'settings' | 'hr'>('dashboard');

  function renderTab() {
    switch (tab) {
      case 'dashboard':
        return <Dashboard user={userConfig} />;
      case 'occ':
        return <OCC />;
      case 'fleet':
        return <div className="p-4">Flotte (noch nicht implementiert)</div>;
      case 'finance':
        return <div className="p-4">Finanzen (noch nicht implementiert)</div>;
      case 'hr':
        return <HRPage />;
      case 'settings':
        return (
          <div className="p-4">
            <h3 className="text-xl mb-2">Einstellungen</h3>
            <button
              className="px-4 py-2 bg-brand1 rounded"
              onClick={() => {
                localStorage.removeItem(`ceo-config-${userConfig.airlineName.toLowerCase()}`);
                onLogout();
              }}
            >
              Ausloggen
            </button>
          </div>
        );
      default:
        return null;
    }
  }

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-1', userConfig.colors.primary);
    root.style.setProperty('--brand-2', userConfig.colors.secondary);
  }, [userConfig]);

  return (
    <div className="flex h-screen">
      <nav className="w-56 bg-panel p-4 flex flex-col gap-2">
        <div className="text-2xl font-bold mb-4 truncate" title={userConfig.airlineName}>
          {userConfig.airlineName}
        </div>
        <button className={`text-left px-3 py-2 rounded ${tab === 'dashboard' ? 'bg-brand1' : ''}`} onClick={() => setTab('dashboard')}>
          Dashboard
        </button>
        <button className={`text-left px-3 py-2 rounded ${tab === 'occ' ? 'bg-brand1' : ''}`} onClick={() => setTab('occ')}>
          OCC
        </button>
        <button className={`text-left px-3 py-2 rounded ${tab === 'fleet' ? 'bg-brand1' : ''}`} onClick={() => setTab('fleet')}>
          Flotte
        </button>
        <button className={`text-left px-3 py-2 rounded ${tab === 'finance' ? 'bg-brand1' : ''}`} onClick={() => setTab('finance')}>
          Finanzen
        </button>
        <button className={`text-left px-3 py-2 rounded ${tab === 'hr' ? 'bg-brand1' : ''}`} onClick={() => setTab('hr')}>
          Personal &amp; Programme
        </button>
        <button className={`text-left px-3 py-2 rounded ${tab === 'settings' ? 'bg-brand1' : ''}`} onClick={() => setTab('settings')}>
          Einstellungen
        </button>
      </nav>
      <main className="flex-1 overflow-auto p-4">{renderTab()}</main>
    </div>
  );
};

export default Layout;
