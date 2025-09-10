import React, { useState, useEffect } from 'react';
import Auth from '@components/Auth';
import Layout from '@components/Layout';
import type { UserConfig } from '@types';

/**
 * App is the root component. It manages global user state and toggles between
 * the authentication flow and the main application layout.
 */
const App: React.FC = () => {
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);

  // Load user config from local storage on first mount.
  useEffect(() => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('ceo-config-'));
    if (keys.length > 0) {
      // Load the first saved airline as default. In a full implementation, you could
      // show a list for the user to pick from.
      const config = localStorage.getItem(keys[0]);
      if (config) {
        const parsed: any = JSON.parse(config);
        // Remove password before using.
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