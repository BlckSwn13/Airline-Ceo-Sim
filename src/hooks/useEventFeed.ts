import { useEffect, useRef, useState } from 'react';

export type Severity = 'info' | 'warning' | 'urgent';

export type EventItem = {
  id: string;
  title: string;
  body: string;
  severity: Severity;
  time?: string;
  airport?: string;
  flightNum?: string;
  lat?: number;
  lng?: number;
};

export function useEventFeed(autoStart = true) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const timerRef = useRef<number | null>(null);

  function addEvent(e: Omit<EventItem, 'id' | 'time'>) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const time = new Date().toLocaleString();
    setEvents(prev => [{ ...e, id, time }, ...prev].slice(0, 50));
  }

  function scheduleNext() {
    // 5–8 Minuten Intervall (Jitter)
    const delay = 5 * 60_000 + Math.floor(Math.random() * (3 * 60_000));
    timerRef.current = window.setTimeout(() => {
      const samples: Omit<EventItem, 'id' | 'time'>[] = [
        { title: 'Slot-Engpass', body: 'Engpass am Flughafen LHR. Mögliche ATC-Holdings.', severity: 'urgent', airport: 'LHR', lat: 51.47, lng: -0.4543 },
        { title: 'De-Icing aktiviert', body: 'De-Icing in ORD aktiv. Turnaround +20 Min.', severity: 'warning', airport: 'ORD', lat: 41.9742, lng: -87.9073 },
        { title: 'Crew-Transfer verspätet', body: 'Shuttle verspätet, Crew meldet +15 Min. Delay.', severity: 'info' },
      ];
      addEvent(samples[Math.floor(Math.random() * samples.length)]);
      scheduleNext();
    }, delay) as unknown as number;
  }

  useEffect(() => {
    if (!autoStart) return;
    scheduleNext();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [autoStart]);

  return { events, addEvent };
}
