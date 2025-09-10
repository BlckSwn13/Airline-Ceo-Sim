import React from 'react';
import { useOnboardingStore } from '../../hooks/useOnboardingStore';

export default function StepMode() {
  const { timeMode, setTimeMode, timeScale, setTimeScale } = useOnboardingStore();

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4 space-y-3">
      <h3 className="text-lg font-semibold">Spielmodus</h3>
      <div className="flex gap-2">
        <button
          onClick={() => setTimeMode('real')}
          className={`px-3 py-2 rounded-xl border ${
            timeMode === 'real' ? 'bg-[var(--brand-1)]' : 'bg-white/5'
          } border-white/10`}
        >
          Real (1:1)
        </button>
        <button
          onClick={() => setTimeMode('sandbox')}
          className={`px-3 py-2 rounded-xl border ${
            timeMode === 'sandbox' ? 'bg-[var(--brand-1)]' : 'bg-white/5'
          } border-white/10`}
        >
          Sandkasten (beschleunigt)
        </button>
      </div>
      {timeMode === 'sandbox' && (
        <div className="flex gap-2">
          <button
            onClick={() => setTimeScale('normal')}
            className={`px-3 py-2 rounded-xl border ${
              timeScale === 'normal' ? 'bg-[var(--brand-1)]' : 'bg-white/5'
            } border-white/10`}
          >
            Normal (1m/60s)
          </button>
          <button
            onClick={() => setTimeScale('fast')}
            className={`px-3 py-2 rounded-xl border ${
              timeScale === 'fast' ? 'bg-[var(--brand-1)]' : 'bg-white/5'
            } border-white/10`}
          >
            Schnell (1m/30s)
          </button>
          <button
            onClick={() => setTimeScale('top')}
            className={`px-3 py-2 rounded-xl border ${
              timeScale === 'top' ? 'bg-[var(--brand-1)]' : 'bg-white/5'
            } border-white/10`}
          >
            Top‑Speed (1m/5s)
          </button>
        </div>
      )}
    </div>
  );
}
