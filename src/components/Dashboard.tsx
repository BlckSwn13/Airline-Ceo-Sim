// src/components/Dashboard.tsx
import React, { useEffect } from 'react';
import EventFeedPanel from './EventFeedPanel';
import { useEventStore } from '../hooks/useEventStore';

export default function Dashboard() {
  const init = useEventStore(s => s.init);
  useEffect(() => { init(); }, [init]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="font-semibold mb-2">KPI-Überblick (Demo)</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card title="PAX (TODAY)" value="12 430" />
            <Card title="On-Time D+15" value="82%" />
            <Card title="Yield" value="CHF 0.13" />
            <Card title="Complaints" value="−12%" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="font-semibold mb-2">Hinweis</div>
          <div className="opacity-80 text-sm">
            Rechts siehst du den Live-Event-Feed. Neue Meldungen werden automatisch
            erzeugt (alle ~90–120 Sek.). Über die Buttons kannst du sofort handeln.
          </div>
        </div>
      </div>

      <div className="md:col-span-1">
        <EventFeedPanel />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
      <div className="text-xs opacity-70">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
