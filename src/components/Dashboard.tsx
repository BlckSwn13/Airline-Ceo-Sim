import React, { useState } from 'react';
import type { UserConfig } from '@types';
import { useChat } from '@hooks/useChat';

interface DashboardProps {
  user: UserConfig;
}

/**
 * Dashboard displays key metrics, recent events and a chat interface to interact with the AI.  
 */
const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { messages, send, reset } = useChat();
  const [input, setInput] = useState('');

  const kpis = [
    { id: 'balance', label: 'Balance', value: '2.4M' },
    { id: 'satisfaction', label: 'Zufriedenheit', value: '82%' },
    { id: 'otp', label: 'On-Time', value: '95%' },
    { id: 'reputation', label: 'Reputation', value: '78' }
  ];

  const events = [
    { type: 'info', text: 'De-Icing startet in ORD' },
    { type: 'urgent', text: 'Slot-Engpass am LHR' }
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input) return;
    send(input);
    setInput('');
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.id} className="glass-panel p-4">
            <div className="text-sm text-gray-300">{k.label}</div>
            <div className="text-2xl font-bold text-brand1">{k.value}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 glass-panel p-4 overflow-auto">
          <h3 className="text-lg font-semibold mb-2">Event Feed</h3>
          <ul className="space-y-1">
            {events.map((event, idx) => (
              <li key={idx} className={event.type === 'urgent' ? 'text-red-400' : 'text-green-400'}>
                {event.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 glass-panel p-4">
          <h3 className="text-lg font-semibold mb-2">AI Chat</h3>
          <div className="h-48 overflow-auto border border-panel mb-2 p-2 rounded">
            {messages.map((m, i) => (
              <div key={i} className={`mb-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={m.role === 'user' ? 'bg-brand2 text-black' : 'bg-panel text-white'} style={{ padding: '4px 8px', borderRadius: '8px', display: 'inline-block' }}>
                  {m.content}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 rounded bg-panel"
              placeholder="Nachricht an GPT..."
            />
            <button type="submit" className="px-4 py-2 bg-brand1 rounded">Senden</button>
            <button type="button" onClick={reset} className="px-2 py-2 bg-brand2 text-black rounded">
              Neu
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;