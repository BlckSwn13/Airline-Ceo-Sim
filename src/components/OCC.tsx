// src/components/OCC.tsx
import React, { useMemo, useState } from 'react';
import type { Flight } from '../types';
import FlightDetailsModal from './FlightDetailsModal';

// Demo-Daten; später durch echte Quelle/Store ersetzen
const demoFlights: Flight[] = [
  { id: 'CA101', callsign: 'CRW101', origin: 'ZRH', destination: 'LHR', std: '08:10', sta: '09:05', status: 'BOARDING', aircraftType: 'A321neo', registration: 'HB-CRW' },
  { id: 'CA204', callsign: 'CRW204', origin: 'LHR', destination: 'JFK', std: '10:15', sta: '13:10', status: 'ON TIME', aircraftType: 'A350-1000', registration: 'HB-AVA' },
  { id: 'CA307', callsign: 'CRW307', origin: 'JFK', destination: 'ZRH', std: '15:40', sta: '05:35', status: 'DELAYED', aircraftType: 'B777-300ER', registration: 'HB-EAG' },
  { id: 'CA411', callsign: 'CRW411', origin: 'CDG', destination: 'ZRH', std: '11:20', sta: '12:35', status: 'IN AIR', aircraftType: 'A220-300', registration: 'HB-LQD' },
];

const statusChip: Record<Flight['status'], string> = {
  'ON TIME': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'DELAYED': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'BOARDING': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'IN AIR': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'CANCELLED': 'bg-rose-500/20 text-rose-300 border-rose-500/30'
};

const OCC: React.FC = () => {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<Flight | null>(null);

  const flights = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return demoFlights;
    return demoFlights.filter(f =>
      [f.id, f.callsign, f.origin, f.destination, f.registration, f.aircraftType]
        .filter(Boolean)
        .some(s => String(s).toLowerCase().includes(t))
    );
  }, [q]);

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-3">
        <input
          className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
          placeholder="Suche (Callsign, Route, Reg, Typ)…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </header>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th>Flug</Th>
              <Th>Route</Th>
              <Th>STD</Th>
              <Th>STA</Th>
              <Th>Status</Th>
              <Th>Typ</Th>
              <Th>Reg.</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {flights.map(f => (
              <tr key={f.id} className="border-t border-white/10 hover:bg-white/5">
                <Td>{f.callsign}</Td>
                <Td>{f.origin} → {f.destination}</Td>
                <Td>{f.std}</Td>
                <Td>{f.sta}</Td>
                <Td>
                  <span className={`inline-block px-2 py-0.5 rounded border ${statusChip[f.status]}`}>{f.status}</span>
                </Td>
                <Td>{f.aircraftType}</Td>
                <Td>{f.registration || '—'}</Td>
                <Td className="text-right">
                  <button
                    onClick={() => setSel(f)}
                    className="px-3 py-1.5 rounded bg-[var(--brand-1)] hover:opacity-90"
                  >
                    Details
                  </button>
                </Td>
              </tr>
            ))}
            {flights.length === 0 && (
              <tr><Td colSpan={8} className="text-center opacity-70 py-6">Keine Flüge gefunden.</Td></tr>
            )}
          </tbody>
        </table>
      </div>

      {sel && <FlightDetailsModal flight={sel} onClose={() => setSel(null)} />}
    </div>
  );
};

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-3 py-2 font-medium">{children}</th>;
}
function Td({ children, colSpan }: { children: React.ReactNode; colSpan?: number }) {
  return <td className="px-3 py-2" colSpan={colSpan}>{children}</td>;
}

export default OCC;
