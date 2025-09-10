import React, { useState } from 'react';
import type { UserConfig } from '@types';
import EventDetails from '@components/EventDetails';
import { useEventFeed } from '@hooks/useEventFeed';

interface DashboardProps {
  user: UserConfig;
}

/**
 * Dashboard – zeigt KPIs, Event-Feed und Einstieg in den Chat (über ChatDock).
 */
const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { events } = useEventFeed(true);
  const [selected, setSelected] = useState<string | null>(null);
  const selectedEvent = events.find(e => e.id === selected) ?? null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass-panel rounded-2xl p-4 border border-white/10">
          <div className="text-sm opacity-80">Balance</div>
          <div className="text-2xl font-semibold">$ 124.8M</div>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-white/10">
          <div className="text-sm opacity-80">On-Time</div>
          <div className="text-2xl font-semibold">87%</div>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-white/10">
          <div className="text-sm opacity-80">Satisfaction</div>
          <div className="text-2xl font-semibold">4.3 ★</div>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-white/10">
          <div className="text-sm opacity-80">Reputation</div>
          <div className="text-2xl font-semibold">A-</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Event Feed */}
        <div className="md:col-span-2 glass-panel rounded-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Event-Feed</h3>
            <div className="text-xs text-white/60">automatisch alle 5–8 Min</div>
          </div>

          <ul className="space-y-2">
            {events.map(ev => (
              <li
                key={ev.id}
                className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer"
                onClick={() => setSelected(ev.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-xs text-white/60">{ev.time}</div>
                </div>
                <div className="text-sm opacity-85">{ev.body}</div>
                <div className="text-xs text-white/65 mt-1">
                  {ev.airport ? `Airport: ${ev.airport}` : ''}{ev.flightNum ? ` • Flug: ${ev.flightNum}` : ''}
                </div>
              </li>
            ))}
            {events.length === 0 && (
              <li className="p-3 rounded-xl border border-white/10 bg-white/5">Noch keine Ereignisse – der Feed startet automatisch.</li>
            )}
          </ul>
        </div>

        {/* Quick Help */}
        <div className="glass-panel rounded-2xl border border-white/10 p-4">
          <h3 className="text-lg font-semibold mb-2">Schnellaktionen</h3>
          <p className="text-sm text-white/80 mb-2">
            Für Krisensitzungen oder Vorschläge klicke im Event auf „Krisensitzung starten“ oder „Eigene Lösung vorschlagen“ –
            das Chat-Fenster öffnet sich automatisch.
          </p>
          <button
            className="w-full px-3 py-2 rounded-lg bg-[var(--brand-1)] text-black font-semibold"
            onClick={() => (window as any).openChatDock?.()}
          >
            Chat öffnen
          </button>
        </div>
      </div>

      {/* Overlay */}
      <EventDetails open={!!selectedEvent} event={selectedEvent} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Dashboard;
