import React from 'react';
import { useHRStore } from '../hooks/useHRStore';

export default function HRPage() {
  const { employees, programs, budget, hire, launchProgram, setBudget } = useHRStore();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Belegschaft</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {employees.map(e => (
            <div key={e.id} className="rounded-xl bg-white/5 p-3 border border-white/10">
              <div className="font-medium">{e.name} — {e.role}</div>
              <div className="text-sm opacity-80">Seniorität: {e.level} • Kosten: {e.cost}/Monat</div>
            </div>
          ))}
        </div>
        <button onClick={() => hire()} className="mt-3 rounded-xl px-3 py-2 bg-[var(--brand-1)] hover:opacity-90">
          + Einstellen
        </button>
      </section>

      <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Programme &amp; Förderungen</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => launchProgram('Training Cabin Crew')} className="rounded-xl px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10">
            Training Cabin Crew
          </button>
          <button onClick={() => launchProgram('Fuel Efficiency Incentive')} className="rounded-xl px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10">
            Fuel Efficiency
          </button>
          <button onClick={() => launchProgram('Leadership Academy')} className="rounded-xl px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10">
            Leadership Academy
          </button>
        </div>
        <ul className="mt-3 text-sm opacity-90 list-disc pl-5">
          {programs.map(p => (
            <li key={p.id}>{p.name} — Status: {p.status}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Budget</h2>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2"
          />
          <span className="opacity-80 text-sm">/ Monat</span>
        </div>
      </section>
    </div>
  );
}
