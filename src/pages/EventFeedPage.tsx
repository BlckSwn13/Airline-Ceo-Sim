// src/pages/EventFeedPage.tsx
import React from 'react';
import { useEventStore } from '../hooks/useEventStore';
import type { EventItem, EventCategory } from '../types';

const catHue: Record<EventCategory, string> = {
  OPS: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  SAFETY: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  FINANCE: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  HR: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  IT: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  CUSTOMER: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
};

export default function EventFeedPage() {
  const { archive, clearAll } = useEventStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Event-Feed – Archiv</h2>
        <button className="text-sm opacity-80 hover:opacity-100" onClick={clearAll}>
          Archiv leeren
        </button>
      </div>

      <div className="space-y-3">
        {archive.length === 0 && (
          <div className="opacity-70">Noch keine Meldungen im Archiv.</div>
        )}
        {[...archive].reverse().map(ev => (
          <div key={ev.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-start gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded border ${catHue[ev.category]}`}>{ev.category}</span>
              <div className="font-medium">{ev.title}</div>
              <div className="text-xs opacity-70 ml-auto">{new Date(ev.ts).toLocaleString()}</div>
            </div>
            <div className="text-sm opacity-85 mt-1">{ev.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
