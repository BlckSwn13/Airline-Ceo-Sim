import React, { useState } from 'react';
import type { UserConfig } from '@types';

interface AuthProps {
  onComplete: (config: UserConfig) => void;
}

const Auth: React.FC<AuthProps> = ({ onComplete }) => {
  const [airlineName, setAirlineName] = useState('');
  const [ceoName, setCeoName] = useState('');
  const [password, setPassword] = useState('');
  const [primary, setPrimary] = useState('#4da3ff');
  const [secondary, setSecondary] = useState('#7cf3c0');
  const [logo, setLogo] = useState<string | undefined>(undefined);

  // Flottenvorgabe
  const [fleetPreset, setFleetPreset] = useState<'none'|'small'|'medium'|'large'|'custom'>('small');
  const [customFleet, setCustomFleet] = useState<Array<{type:string; count:number}>>([
    { type: 'A320', count: 6 },
    { type: 'B737', count: 4 },
  ]);

  function resolveFleet() {
    if (fleetPreset === 'none') return [];
    if (fleetPreset === 'custom') return customFleet;
    if (fleetPreset === 'small')  return [{type:'A320',count:10},{type:'B737',count:4}];
    if (fleetPreset === 'medium') return [{type:'A320',count:15},{type:'B737',count:10},{type:'A330',count:5}];
    if (fleetPreset === 'large')  return [{type:'A320',count:60},{type:'B737',count:40},{type:'A330',count:30},{type:'B777',count:10}];
    return [];
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const resolvedFleet = resolveFleet();

    const config: any = {
      airlineName,
      ceoName,
      colors: { primary, secondary },
      logo,
      password,
      financeMode: 'standard',
      timeMode: 'real',
      timeScale: 1,
      fleetPreset,
      customFleet: resolvedFleet,
    };

    localStorage.setItem('userConfig', JSON.stringify(config));
    onComplete(config);
  }

  return (
    <div className="glass-panel rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-semibold mb-4">Registrierung</h2>
      <form onSubmit={handleSignup} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="rounded-lg p-2 bg-white/5 border border-white/10" placeholder="Airline-Name"
                 value={airlineName} onChange={e=>setAirlineName(e.target.value)} required />
          <input className="rounded-lg p-2 bg-white/5 border border-white/10" placeholder="CEO-Name"
                 value={ceoName} onChange={e=>setCeoName(e.target.value)} required />
          <input type="password" className="rounded-lg p-2 bg-white/5 border border-white/10" placeholder="Passwort"
                 value={password} onChange={e=>setPassword(e.target.value)} required />
          <div className="flex items-center gap-3">
            <label className="text-sm opacity-80">Farbe 1</label>
            <input type="color" value={primary} onChange={e=>setPrimary(e.target.value)} />
            <label className="text-sm opacity-80">Farbe 2</label>
            <input type="color" value={secondary} onChange={e=>setSecondary(e.target.value)} />
          </div>
        </div>

        {/* Flottengröße */}
        <div className="space-y-2">
          <div className="text-sm opacity-80">Startflotte</div>
          <div className="flex flex-wrap gap-2">
            {(['none','small','medium','large','custom'] as const).map(k => (
              <button
                type="button"
                key={k}
                onClick={() => setFleetPreset(k)}
                className={`px-3 py-1 rounded-lg border ${fleetPreset===k ? 'bg-[var(--brand-1)] text-black' : 'bg-white/5 border-white/10'}`}
              >
                {k === 'none' ? 'Keine' : k === 'small' ? 'Klein' : k === 'medium' ? 'Mittel' : k === 'large' ? 'Groß' : 'Eigene Liste'}
              </button>
            ))}
          </div>

          {fleetPreset === 'custom' && (
            <div className="space-y-2">
              {customFleet.map((row, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className="rounded-lg p-2 bg-white/5 border border-white/10 flex-1" placeholder="Typ (z. B. A320)"
                         value={row.type} onChange={e=>{
                           const next=[...customFleet]; next[idx].type=e.target.value; setCustomFleet(next);
                         }} />
                  <input type="number" className="rounded-lg p-2 bg-white/5 border border-white/10 w-28" placeholder="Anzahl"
                         value={row.count} onChange={e=>{
                           const next=[...customFleet]; next[idx].count=parseInt(e.target.value||'0',10); setCustomFleet(next);
                         }} />
                </div>
              ))}
              <button type="button" className="px-3 py-1 rounded-lg bg-white/10 border border-white/10"
                      onClick={()=>setCustomFleet([...customFleet,{type:'A320',count:1}])}>
                Zeile hinzufügen
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="px-4 py-2 rounded-lg bg-[var(--brand-1)] text-black font-semibold">
          Konto anlegen
        </button>
      </form>
    </div>
  );
};

export default Auth;
