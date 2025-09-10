import React from 'react';
import { useHRStore } from '@hooks/useHRStore';

export default function HRPage() {
  const { employees, programs, budget, hire, addPerson, launchProgram, setBudget } = useHRStore();
  const [newName, setNewName] = React.useState('');
  const [newRole, setNewRole] = React.useState('');
  const [newAge, setNewAge] = React.useState<number | ''>('');
  const [newPosition, setNewPosition] = React.useState('');

  return (
    <div className="space-y-6">
      {/* Budget */}
      <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4">
        <h2 className="text-lg font-semibold mb-2">Budget</h2>
        <div className="flex items-center gap-2">
          <input
            className="rounded-lg p-2 bg-white/5 border border-white/10"
            type="number"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value || '0', 10))}
          />
          <span className="text-sm opacity-80">/ Monat</span>
        </div>
      </section>

      {/* Belegschaft */}
      <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Belegschaft</h2>
        <div className="grid gap-3">
          {employees.map((e) => (
            <div key={e.id} className="rounded-xl p-3 border border-white/10 bg-white/5">
              <div className="font-medium">
                {e.name} — {e.role}
              </div>
              <div className="text-sm opacity-80">
                Seniorität: {e.level} • Kosten: {e.cost}/Monat
                {typeof e.age === 'number' ? ` • Alter: ${e.age}` : ''}
                {e.position ? ` • Position: ${e.position}` : ''}
              </div>
            </div>
          ))}
          {employees.length === 0 && (
            <div className="rounded-xl p-3 border border-white/10 bg-white/5">Noch keine Einträge vorhanden.</div>
          )}
        </div>
      </section>

      {/* Neue Person */}
      <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Neue Person</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="rounded-lg p-2 bg-white/5 border border-white/10" placeholder="Name"
                 value={newName} onChange={(e)=>setNewName(e.target.value)} />
          <input className="rounded-lg p-2 bg-white/5 border border-white/10" placeholder="Rolle (z. B. CFO)"
                 value={newRole} onChange={(e)=>setNewRole(e.target.value)} />
          <input className="rounded-lg p-2 bg-white/5 border border-white/10" placeholder="Alter" type="number"
                 value={newAge} onChange={(e)=>setNewAge(e.target.value === '' ? '' : parseInt(e.target.value,10))} />
          <input className="rounded-lg p-2 bg-white/5 border border-white/10" placeholder="Position (z. B. Chief Financial Officer)"
                 value={newPosition} onChange={(e)=>setNewPosition(e.target.value)} />
        </div>
        <div className="pt-3">
          <button
            className="px-3 py-2 rounded-lg bg-[var(--brand-1)] text-black font-semibold"
            onClick={() => {
              if (!newName || !newRole) return;
              addPerson(newName, newRole, typeof newAge === 'number' ? newAge : undefined, newPosition || undefined);
              setNewName(''); setNewRole(''); setNewAge(''); setNewPosition('');
            }}
          >
            Person hinzufügen
          </button>
        </div>
      </section>

      {/* Programme */}
      <section className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Programme & Förderungen</h2>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-white/10 border border-white/10"
            onClick={() => launchProgram({ name: 'Leadership Academy', budget: 100_000 })}
          >
            Leadership Academy starten
          </button>
        </div>
        <ul className="mt-3 space-y-2">
          {programs.map(p => (
            <li key={p.id} className="rounded-xl p-3 border border-white/10 bg-white/5">
              {p.name} — {p.budget} ({p.active ? 'aktiv' : 'inaktiv'})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
