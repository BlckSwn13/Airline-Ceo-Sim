import React, { useState } from 'react';
import type { UserConfig } from '@types';

interface AuthProps {
  onComplete: (config: UserConfig) => void;
}

/**
 * Auth component handles both registration and login flows.  
 * Users can choose two colours and optionally upload or select a logo via the DALL·E wizard.  
 */
const Auth: React.FC<AuthProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [airlineName, setAirlineName] = useState('');
  const [ceoName, setCeoName] = useState('');
  const [password, setPassword] = useState('');
  const [primary, setPrimary] = useState('#4da3ff');
  const [secondary, setSecondary] = useState('#7cf3c0');
  const [logo, setLogo] = useState<string | undefined>(undefined);

  function handleModeChange(newMode: 'login' | 'signup') {
    setMode(newMode);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const key = `ceo-config-${airlineName.toLowerCase()}`;
    const stored = localStorage.getItem(key);
    if (!stored) {
      alert('Diese Airline existiert nicht. Bitte registriere dich.');
      return;
    }
    const config: UserConfig & { password: string } = JSON.parse(stored);
    if (config.colors.primary && config.password === password) {
      // Remove password before returning
      const { password: _, ...rest } = config as any;
      onComplete(rest);
    } else {
      alert('Passwort falsch.');
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!airlineName || !ceoName || !password) {
      alert('Bitte fülle alle Felder aus.');
      return;
    }
    const key = `ceo-config-${airlineName.toLowerCase()}`;
    const config: any = {
      airlineName,
      ceoName,
      colors: { primary, secondary },
      logo,
      password
    };
    localStorage.setItem(key, JSON.stringify(config));
    onComplete(config);
  }

  // Placeholder for DALL-E logo generation. In a real implementation this would
  // call a Netlify function to generate and return images.  
  function generateLogos() {
    // For now we just simulate with placeholder URLs.
    const dummy = [
      'https://placehold.co/120x120/png?text=Logo+1',
      'https://placehold.co/120x120/png?text=Logo+2',
      'https://placehold.co/120x120/png?text=Logo+3'
    ];
    setLogo(dummy[0]);
  }

  return (
    <div className="flex items-center justify-center h-screen p-4">
      <div className="w-full max-w-md p-6 glass-panel">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {mode === 'login' ? 'Anmelden' : 'Registrieren'}
        </h2>
        <div className="mb-4 flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              mode === 'login' ? 'bg-brand1 text-white' : 'bg-panel'
            }`}
            onClick={() => handleModeChange('login')}
          >
            Log&nbsp;In
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              mode === 'signup' ? 'bg-brand1 text-white' : 'bg-panel'
            }`}
            onClick={() => handleModeChange('signup')}
          >
            Sign&nbsp;Up
          </button>
        </div>
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-airline-name" className="block mb-1 text-sm">Airline-Name</label>
              <input
                id="login-airline-name"
                type="text"
                value={airlineName}
                onChange={(e) => setAirlineName(e.target.value)}
                className="w-full p-2 rounded bg-panel"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block mb-1 text-sm">Passwort</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-panel"
                required
              />
            </div>
            <button type="submit" className="w-full py-2 mt-4 bg-brand1 text-white rounded">
              Anmelden
            </button>
          </form>
        )}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="signup-airline-name" className="block mb-1 text-sm">Airline-Name</label>
              <input
                id="signup-airline-name"
                type="text"
                value={airlineName}
                onChange={(e) => setAirlineName(e.target.value)}
                className="w-full p-2 rounded bg-panel"
                required
              />
            </div>
            <div>
              <label htmlFor="signup-ceo-name" className="block mb-1 text-sm">CEO-Name</label>
              <input
                id="signup-ceo-name"
                type="text"
                value={ceoName}
                onChange={(e) => setCeoName(e.target.value)}
                className="w-full p-2 rounded bg-panel"
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="color-primary" className="block mb-1 text-sm">Primärfarbe</label>
                <input
                  id="color-primary"
                  type="color"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="w-full h-10 rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="color-secondary" className="block mb-1 text-sm">Akzentfarbe</label>
                <input
                  id="color-secondary"
                  type="color"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                  className="w-full h-10 rounded"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm">Logo</label>
              {logo ? (
                <div className="flex items-center gap-2">
                  <img src={logo} alt="Logo" className="w-12 h-12 rounded" />
                  <button
                    type="button"
                    className="py-1 px-3 bg-brand2 text-black rounded"
                    onClick={() => setLogo(undefined)}
                  >
                    Entfernen
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full py-2 bg-brand2 text-black rounded"
                  onClick={generateLogos}
                >
                  Logos generieren
                </button>
              )}
            </div>
            <div>
              <label htmlFor="signup-password" className="block mb-1 text-sm">Passwort</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-panel"
                required
              />
            </div>
            <button type="submit" className="w-full py-2 mt-4 bg-brand1 text-white rounded">
              Registrieren
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;