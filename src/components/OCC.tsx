import React, { useState } from 'react';
import type { Flight, ActionProposal } from '@types';

// Dummy flight data for demonstration. In a full implementation, this could be fetched or generated dynamically.
const sampleFlights: Flight[] = [
  { num: 'CA1347', route: 'JFK-LAX', dep: '10:00', arr: '13:00', status: 'ON_TIME', type: 'Passagier' },
  { num: 'CA220', route: 'LAX-SFO', dep: '11:30', arr: '12:45', status: 'DELAYED', type: 'Passagier' },
  { num: 'CA805', route: 'SFO-ORD', dep: '14:00', arr: '19:00', status: 'ON_TIME', type: 'Passagier' }
];

const OCC: React.FC = () => {
  const [selected, setSelected] = useState<Flight | null>(null);
  const [approvals, setApprovals] = useState<ActionProposal[]>([]);

  function proposeAction(action: string, impact: 'LOW' | 'MEDIUM' | 'HIGH') {
    if (!selected) return;
    if (impact === 'LOW') {
      // For low impact actions, immediately apply and show a toast (not implemented yet)
      console.log(`Action ${action} executed on ${selected.num}`);
      return;
    }
    const id = `${action}-${Date.now()}`;
    setApprovals((prev) => [
      ...prev,
      {
        id,
        flight: selected.num,
        action,
        details: {},
        impact
      }
    ]);
  }

  function approve(id: string) {
    setApprovals((prev) => prev.filter((p) => p.id !== id));
    console.log(`Approval ${id} approved`);
    // Real implementation would call a game state update here.
  }

  function reject(id: string) {
    setApprovals((prev) => prev.filter((p) => p.id !== id));
    console.log(`Approval ${id} rejected`);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Operation Control Center</h2>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 glass-panel p-4 overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-1">Flug</th>
                <th className="py-1">Route</th>
                <th className="py-1">Abflug</th>
                <th className="py-1">Ankunft</th>
                <th className="py-1">Status</th>
                <th className="py-1">Typ</th>
                <th className="py-1">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {sampleFlights.map((f) => (
                <tr key={f.num} className="border-b border-panel hover:bg-panel/50">
                  <td className="py-1 px-2">{f.num}</td>
                  <td className="py-1 px-2">{f.route}</td>
                  <td className="py-1 px-2">{f.dep}</td>
                  <td className="py-1 px-2">{f.arr}</td>
                  <td className="py-1 px-2">{f.status}</td>
                  <td className="py-1 px-2">{f.type}</td>
                  <td className="py-1 px-2">
                    <button className="bg-brand2 text-black px-2 py-1 rounded" onClick={() => setSelected(f)}>
                      Auswählen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex-1 glass-panel p-4">
          <h3 className="text-lg font-semibold mb-2">Flugdetails</h3>
          {!selected && <p>Wähle einen Flug aus der Liste.</p>}
          {selected && (
            <div>
              <p><strong>Flug:</strong> {selected.num}</p>
              <p><strong>Route:</strong> {selected.route}</p>
              <p><strong>Abflug:</strong> {selected.dep}</p>
              <p><strong>Ankunft:</strong> {selected.arr}</p>
              <p><strong>Status:</strong> {selected.status}</p>
              <p><strong>Typ:</strong> {selected.type}</p>
              <div className="mt-2 flex gap-2">
                <button className="bg-brand1 px-3 py-1 rounded" onClick={() => proposeAction('DELAY_15', 'LOW')}>+15&nbsp;min</button>
                <button className="bg-brand1 px-3 py-1 rounded" onClick={() => proposeAction('DELAY_30', 'MEDIUM')}>+30&nbsp;min</button>
                <button className="bg-brand1 px-3 py-1 rounded" onClick={() => proposeAction('SWAP_AIRCRAFT', 'HIGH')}>Tail wechseln</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="glass-panel p-4">
        <h3 className="text-lg font-semibold mb-2">Genehmigungswarteschlange</h3>
        {approvals.length === 0 && <p>Keine offenen Anträge.</p>}
        {approvals.length > 0 && (
          <ul className="space-y-2">
            {approvals.map((p) => (
              <li key={p.id} className="flex justify-between items-center border-b border-panel pb-1">
                <div>
                  Aktion <strong>{p.action}</strong> für Flug <strong>{p.flight}</strong> (<span className={p.impact === 'HIGH' ? 'text-red-400' : p.impact === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}>{p.impact}</span>)
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 bg-brand1 rounded" onClick={() => approve(p.id)}>Approve</button>
                  <button className="px-2 py-1 bg-red-600 rounded" onClick={() => reject(p.id)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OCC;