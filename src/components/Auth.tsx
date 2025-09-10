// src/components/Auth.tsx
import React, { useMemo, useState } from 'react';
import type { UserConfig } from '../types';

interface AuthProps {
  onComplete: (cfg: UserConfig) => void;
}

type FinanceMode = 'real' | 'sandbox';
type FleetPreset = 'none' | 'small' | 'medium' | 'large' | 'custom';
type GameSpeed = 'real' | 'normal' | 'fast' | 'top';

const DEFAULT_PRIMARY = '#6E56CF';
const DEFAULT_SECONDARY = '#22D3EE';

const presets: Record<FleetPreset, string> = {
  none: 'Keine Flotte (0)',
  small: 'Klein (10 Kurz, 4 Mittel)',
  medium: 'Mittel (25 Kurz, 10 Mittel, 5 Lang)',
  large: 'Groß (100 Kurz, 60 Mittel, 40 Lang)',
  custom: 'Selbst wählbar',
};

const Auth: React.FC<AuthProps> = ({ onComplete }) => {
  const [airlineName, setAirlineName] = useState('');
  const [ceoName, setCeoName] = useState('');
  const [primary, setPrimary] = useState(DEFAULT_PRIMARY);
  const [secondary, setSecondary] = useState(DEFAULT_SECONDARY);

  // Registrierung – neue Felder
  const [financeMode, setFinanceMode] = useState<FinanceMode>('real');
  const [fleetPreset, setFleetPreset] = useState<FleetPreset>('none');
  const [gameSpeed, setGameSpeed] = useState<GameSpeed>('real');

  // Custom Fleet
  const [customFleet, setCustomFleet] = useState<
    { makerModel: string; count: number }[]
  >([
    { makerModel: '', count: 0 },
    { makerModel: '', count: 0 },
    { makerModel: '', count: 0 },
    { makerModel: '', count: 0 },
    { makerModel: '', count: 0 },
  ]);

  const canSubmit = useMemo(() => {
    if (!airlineName.trim() || !ceoName.trim()) return false;
    if (fleetPreset === 'custom') {
      // Mindestens eine valide Zeile
      return customFleet.some((r) => r.makerModel.trim() && r.count > 0);
    }
    return true;
  }, [airlineName, ceoName, fleetPreset, customFleet]);

  function buildInitialFleet() {
    if (fleetPreset === 'custom') return customFleet.filter(f => f.makerModel && f.count > 0);
    switch (fleetPreset) {
      case 'none':
        return [];
      case 'small':
        return [
          { makerModel: 'A320neo', count: 10 },
          { makerModel: 'B737-8', count: 4 },
        ];
      case 'medium':
        return [
          { makerModel: 'A320neo', count: 25 },
          { makerModel: 'A321neo', count: 10 },
          { makerModel: 'B787-9', count: 5 },
        ];
      case 'large':
        return [
          { makerModel: 'A320neo', count: 100 },
          { makerModel: 'A321neo', count: 60 },
          { makerModel: 'A350-1000', count: 40 },
        ];
      default:
        return [];
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const config: UserConfig = {
      airlineName: airlineName.trim(),
      ceoName: ceoName.trim(),
      colors: { primary, secondary },
      settings: {
        financeMode,
        gameSpeed,
      },
      fleet: buildInitialFleet(),
    };

    // persistieren
    const key = `ceo-config-${config.airlineName.toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify(config));

    // CSS Custom Properties für Theme
    const root = document.documentElement;
    root.style.setProperty('--brand-1', primary);
    root.style.setProperty('--brand-2', secondary);

    onComplete(config);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl glass-panel rounded-2xl border border-white/10 p-6 space-y-6"
      >
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Crown Aviation — CEO Simulator</h1>
          <p className="opacity-80">Registriere deine Airline und wähle Start-Parameter.</p>
        </header>

        {/* Basisdaten */}
        <section className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Airline-Name</label>
            <input
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
              value={airlineName}
              onChange={(e) => setAirlineName(e.target.value)}
              placeholder="z. B. Crown Aviation"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">CEO</label>
            <input
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
              value={ceoName}
              onChange={(e) => setCeoName(e.target.value)}
              placeholder="Dein Name"
              required
            />
          </div>
        </section>

        {/* Farben */}
        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="text-sm mb-2">Primärfarbe</div>
            <input
              type="color"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="w-full h-10 rounded"
            />
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="text-sm mb-2">Sekundärfarbe</div>
            <input
              type="color"
              value={secondary}
              // ⬇⬇⬇ HIER ist der Fix: e.target.value (mit Punkt)
              onChange={(e) => setSecondary(e.target.value)}
              className="w-full h-10 rounded"
            />
          </div>
        </section>

        {/* Finanzen */}
        <section className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="text-sm mb-2">Finanzen</div>
          <div className="flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="finance"
                checked={financeMode === 'real'}
                onChange={() => setFinanceMode('real')}
              />
              Real (Verschuldung/Bankrott möglich)
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="finance"
                checked={financeMode === 'sandbox'}
                onChange={() => setFinanceMode('sandbox')}
              />
              Sandkasten (∞ Geld, Reports trotzdem relevant)
            </label>
          </div>
        </section>

        {/* Flotte */}
        <section className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
          <div className="text-sm">Start-Flotte</div>
          <select
            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
            value={fleetPreset}
            onChange={(e) => setFleetPreset(e.target.value as FleetPreset)}
          >
            {Object.entries(presets).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>

          {fleetPreset === 'custom' && (
            <div className="space-y-2">
              {customFleet.map((row, i) => (
                <div key={i} className="grid grid-cols-7 gap-2">
                  <input
                    className="col-span-5 rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
                    placeholder="Hersteller & Modell (z. B. A350-1000)"
                    value={row.makerModel}
                    onChange={(e) => {
                      const next = [...customFleet];
                      next[i].makerModel = e.target.value;
                      setCustomFleet(next);
                    }}
                  />
                  <input
                    type="number"
                    min={0}
                    className="col-span-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
                    placeholder="Stückzahl"
                    value={row.count}
                    onChange={(e) => {
                      const next = [...customFleet];
                      next[i].count = Number(e.target.value || 0);
                      setCustomFleet(next);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Spielmodus / Zeit */}
        <section className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="text-sm mb-2">Spielmodus / Zeit</div>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="speed"
                checked={gameSpeed === 'real'}
                onChange={() => setGameSpeed('real')}
              />
              Real: 1:1 (8h Flug dauert 8h)
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="speed"
                checked={gameSpeed === 'normal'}
                onChange={() => setGameSpeed('normal')}
              />
              Normal: 1 min = 60 sek
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="speed"
                checked={gameSpeed === 'fast'}
                onChange={() => setGameSpeed('fast')}
              />
              Schnell: 1 min = 30 sek
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="speed"
                checked={gameSpeed === 'top'}
                onChange={() => setGameSpeed('top')}
              />
              Top-Speed: 1 min = 5 sek
            </label>
          </div>
        </section>

        <footer className="flex items-center justify-between">
          <div className="text-xs opacity-70">
            Theme-Vorschau • Primär: <span style={{ color: primary }}>{primary}</span> • Sekundär:{' '}
            <span style={{ color: secondary }}>{secondary}</span>
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`rounded-xl px-4 py-2 ${canSubmit ? 'bg-[var(--brand-1)] hover:opacity-90' : 'bg-white/10 cursor-not-allowed'}`}
          >
            Registrierung abschließen
          </button>
        </footer>
      </form>
    </div>
  );
};

export default Auth;
