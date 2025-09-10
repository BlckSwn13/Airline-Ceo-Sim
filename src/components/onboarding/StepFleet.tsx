import React from 'react';
import { useOnboardingStore } from '../../hooks/useOnboardingStore';

export default function StepFleet() {
  const { fleetPreset, setFleetPreset, customFleet, setCustomFleet } = useOnboardingStore();

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4 space-y-3">
      <h3 className="text-lg font-semibold">Flotte</h3>
      <div className="flex flex-wrap gap-2">
        {(['none', 'small', 'medium', 'large', 'custom'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setFleetPreset(p)}
            className={`px-3 py-2 rounded-xl border ${
              fleetPreset === p ? 'bg-[var(--brand-1)]' : 'bg-white/5'
            } border-white/10 capitalize`}
          >
            {p === 'none'
              ? 'Keine Flotte'
              : p === 'small'
              ? 'Klein'
              : p === 'medium'
              ? 'Mittel'
              : p === 'large'
              ? 'Gross'
              : 'Selbst wählbar'}
          </button>
        ))}
      </div>
      {fleetPreset !== 'custom' ? (
        <div className="text-sm opacity-80">
          {fleetPreset === 'none' && 'Du startest ohne Flugzeuge.'}
          {fleetPreset === 'small' && '10 Kurzstrecken & 4 Mittelstrecken.'}
          {fleetPreset === 'medium' && '25 Kurzstrecken, 10 Mittelstrecken & 5 Langstrecken.'}
          {fleetPreset === 'large' && '100 Kurzstrecken, 60 Mittelstrecken & 40 Langstrecken.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-2 py-1"
                placeholder="Hersteller & Modell"
                value={customFleet[i]?.makerModel ?? ''}
                onChange={(e) => {
                  const rows = [...customFleet];
                  rows[i] = { makerModel: e.target.value, count: rows[i]?.count ?? 0 };
                  setCustomFleet(rows);
                }}
              />
              <input
                type="number"
                className="w-20 bg-white/5 border border-white/10 rounded-xl px-2 py-1"
                placeholder="Anz."
                value={customFleet[i]?.count ?? 0}
                onChange={(e) => {
                  const rows = [...customFleet];
                  rows[i] = { makerModel: rows[i]?.makerModel ?? '', count: Number(e.target.value) };
                  setCustomFleet(rows);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
