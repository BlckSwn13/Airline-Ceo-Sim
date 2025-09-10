import React, { useState, useEffect } from 'react';
import Auth from '@components/Auth';
import Layout from '@components/Layout';
import type { UserConfig } from '@types';

/**
 * App ist die Root-Komponente. Sie verwaltet den globalen User-Zustand
 * und schaltet zwischen Authentifizierungs-Flow und Haupt-Layout um.
 */
const App: React.FC = () => {
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);

  // User-Konfiguration beim ersten Mount aus dem LocalStorage laden
  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('ceo-config-'));
    if (keys.length > 0) {
      // In dieser Demo wird die erste gespeicherte Airline geladen
      // (später könnte man dem Nutzer eine Auswahl bieten).
      const config = localStorage.getItem(keys[0]);
      if (config) {
        const parsed: any = JSON.parse(config);
        // Passwort entfernen, bevor es im Zustand gespeichert wird
        delete parsed.password;
        setUserConfig(parsed);
      }
    }
  }, []);

  return (
    <div className="h-full">
      {!userConfig ? (
        <Auth onComplete={(cfg) => setUserConfig(cfg)} />
      ) : (
        <Layout userConfig={userConfig} onLogout={() => setUserConfig(null)} />
      )}
    </div>
  );
};

export default App;
