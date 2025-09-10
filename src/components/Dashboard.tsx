import React from 'react';
import type { UserConfig } from '@types';
import ChatPanel from '@components/ChatPanel';

interface DashboardProps {
  user: UserConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
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
          <div className="h-72">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
