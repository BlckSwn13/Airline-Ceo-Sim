import React from 'react';
import { useOnboardingStore } from '../../hooks/useOnboardingStore';

export default function StepFinance() {
  const { financeMode, setFinanceMode } = useOnboardingStore();
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4 space-y-2">
      <h3 className="text-lg font-semibold">Finanzen</h3>
      <div className="flex gap-3">
        <button
          onClick={() => setFinanceMode('real')}
          className={`px-3 py-2 rounded-xl border ${
            financeMode === 'real' ? 'bg-[var(--brand-1)]' : 'bg-white/5'
          } border-white/10`}
        >
          Real (Verschuldung/Bankrott möglich)
        </button>
        <button
          onClick={() => setFinanceMode('sandbox')}
          className={`px-3 py-2 rounded-xl border ${
            financeMode === 'sandbox' ? 'bg-[var(--brand-1)]' : 'bg-white/5'
          } border-white/10`}
        >
          Sandkasten (∞ Budget)
        </button>
      </div>
      <p className="text-sm opacity-80">
        Reports und Budgetzuweisungen bleiben trotzdem relevant.
      </p>
    </div>
  );
}
