// src/hooks/useEventStore.ts
import { create } from 'zustand';
import type { EventItem, EventCategory } from '../types';

const STORAGE_KEY = 'event-archive-v1';

function loadArchive(): EventItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as EventItem[]) : [];
  } catch {
    return [];
  }
}
function saveArchive(items: EventItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const samples: Array<{
  title: string;
  summary: string;
  severity: EventItem['severity'];
  category: EventCategory;
}> = [
  { title: 'ATC Slot Delay ZRH', summary: 'Departure bank +25 min wegen Traffic Regulation.', severity: 'medium', category: 'OPS' },
  { title: 'Cabin Crew Sick Call', summary: 'Letzte Minute Ausfall – Reserve wird aktiviert.', severity: 'low', category: 'HR' },
  { title: 'Tech Log Entry A350', summary: 'Hydraulic PTU Geräuschmeldungen – MEL ok, Monitoring aktiv.', severity: 'medium', category: 'SAFETY' },
  { title: 'Fuel Price Spike JFK', summary: '+8% gegenüber Vortag – Budgetanpassung nötig.', severity: 'high', category: 'FINANCE' },
  { title: 'DCS Outage (Partial)', summary: 'Boarding-Pässe intermittierend – Workaround aktiv.', severity: 'high', category: 'IT' },
  { title: 'Customer Tweet viral', summary: 'Beschwerde über verspätetes Gepäck – PR vorbereiten.', severity: 'low', category: 'CUSTOMER' },
  { title: 'Aircraft Swap Needed', summary: 'A321neo → A320 wegen Tech; Pax Re-seat erforderlich.', severity: 'high', category: 'OPS' },
  { title: 'Severe Wx over BOS', summary: 'Reroute empfohlen, EET +18 min.', severity: 'medium', category: 'SAFETY' },
];

export interface EventState {
  archive: EventItem[];         // alle bisherigen
  live: EventItem[];            // die letzten 4 (anzeige)
  timer?: number;               // interval id (im Browser)

  init: () => void;             // lädt Archiv und startet Ticker
  stop: () => void;             // stoppt Ticker
  addEvent: (e: EventItem) => void;
  clearAll: () => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  archive: [],
  live: [],
  timer: undefined,

  init: () => {
    const arch = loadArchive();
    // Beim Start: live = letzte 4 aus dem Archiv
    const last4 = arch.slice(-4);
    set({ archive: arch, live: last4 });

    // Ticker 90–120s
    const jitter = () => 90000 + Math.floor(Math.random() * 30000);
    const tick = () => {
      const s = samples[Math.floor(Math.random() * samples.length)];
      const ev: EventItem = {
        id: uid(),
        ts: Date.now(),
        title: s.title,
        summary: s.summary,
        severity: s.severity,
        category: s.category
      };
      get().addEvent(ev);
      // Nächsten Tick planen
      const id = window.setTimeout(tick, jitter());
      set({ timer: id });
    };

    const id = window.setTimeout(tick, jitter());
    set({ timer: id });
  },

  stop: () => {
    const id = get().timer;
    if (id) {
      clearTimeout(id);
      set({ timer: undefined });
    }
  },

  addEvent: (e: EventItem) => {
    const arch = [...get().archive, e];
    // live: neues oben; max 4
    const live = [e, ...get().live].slice(0, 4);
    saveArchive(arch);
    set({ archive: arch, live });
  },

  clearAll: () => {
    saveArchive([]);
    set({ archive: [], live: [] });
  }
}));
