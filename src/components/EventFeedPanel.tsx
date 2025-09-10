// src/components/EventFeedPanel.tsx
import React, { useMemo, useState } from 'react';
import { useEventStore } from '../hooks/useEventStore';
import type { EventItem, EventCategory } from '../types';
import { callAI } from '../services/openai';
import { buildMeetingPrompt } from '../lib/prompts';

const catHue: Record<EventCategory, string> = {
  OPS: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  SAFETY: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  FINANCE: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  HR: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  IT: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  CUSTOMER: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
};

function participantsFor(category: EventCategory): string[] {
  switch (category) {
    case 'OPS': return ['COO', 'OCC', 'Safety'];
    case 'SAFETY': return ['Safety', 'COO', 'OCC'];
    case 'FINANCE': return ['CFO', 'COO'];
    case 'HR': return ['HR', 'COO'];
    case 'IT': return ['IT', 'OCC', 'COO'];
    case 'CUSTOMER': return ['Comms', 'COO', 'HR'];
    default: return ['COO', 'OCC'];
  }
}

export default function EventFeedPanel() {
  const { live } = useEventStore();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5">
      <div className="p-3 border-b border-white/10 font-semibold">Event-Feed</div>
      <div className="p-3 space-y-3">
        {live.length === 0 && (
          <div className="text-sm opacity-70">Noch keine Ereignisse.</div>
        )}
        {live.map(e => <Item key={e.id} ev={e} />)}
      </div>
      <div className="p-3 border-t border-white/10 text-right">
        <a href="#/events" className="text-sm opacity-80 hover:opacity-100">Alle Ereignisse ansehen →</a>
      </div>
    </div>
  );
}

function Item({ ev }: { ev: EventItem }) {
  const [busy, setBusy] = useState<'crisis'|'propose'|'delegate'|null>(null);
  const [text, setText] = useState('');

  const ts = useMemo(() => new Date(ev.ts).toLocaleTimeString(), [ev.ts]);
  const cats = participantsFor(ev.category).join(', ');

  async function crisis() {
    setBusy('crisis');
    const topic = `${ev.title} – ${ev.summary}`;
    const systemPrompt = buildMeetingPrompt(undefined, topic) +
      `\nBetroffene Rollen laut Lagebild: ${cats}.\nGib ein kurzes, strukturiertes Sofort-Vorgehen (<=10 Zeilen).`;
    const res = await callAI({
      prompt: 'Leite sofort die Krisensitzung. Beginne mit Agenda und klaren Verantwortlichkeiten.',
      systemPrompt,
      role: 'Crisis Coordinator',
      name: 'Ava'
    });
    alert(res.reply || res.error || '—');
    setBusy(null);
  }

  async function propose() {
    if (!text.trim()) return;
    setBusy('propose');
    const system = `Du bist Ava, Executive Assistant. Beurteile den folgenden Lösungsvorschlag zum Ereignis "${ev.title}". 
Bewerte Risiken, Aufwand, Zeit, benötigte Rollen. Antworte in 6–10 Zeilen und nenne einen klaren Next Step.`;
    const res = await callAI({
      prompt: text,
      systemPrompt: system,
      role: 'Assistant',
      name: 'Ava'
    });
    alert(res.reply || res.error || '—');
    setText('');
    setBusy(null);
  }

  async function delegate() {
    setBusy('delegate');
    const system = `Du bist Ava. Bestimme passende Personen/Rollen zur Delegation für "${ev.title}" (${ev.category}). 
Berücksichtige Position/Erfahrung/Status/Kompetenzen. Liefere 3–5 Kandidaten mit kurzer Begründung + sofortigem Action Item.`;
    const res = await callAI({
      prompt: 'Wen sollen wir beauftragen? Bitte konkrete Namen/Rollen + Begründung.',
      systemPrompt: system,
      role: 'Assistant',
      name: 'Ava'
    });
    alert(res.reply || res.error || '—');
    setBusy(null);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-start gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded border ${catHue[ev.category]}`}>{ev.category}</span>
        <div className="text-xs opacity-70 ml-auto">{ts}</div>
      </div>
      <div className="mt-1 font-medium">{ev.title}</div>
      <div className="text-sm opacity-80">{ev.summary}</div>

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <button
          className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-sm disabled:opacity-50"
          onClick={crisis}
          disabled={!!busy}
          title={`Krisensitzung (Rollen: ${cats})`}
        >
          Krisensitzung
        </button>
        <button
          className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-sm disabled:opacity-50"
          onClick={delegate}
          disabled={!!busy}
        >
          Aufgabe delegieren
        </button>
        <details className="col-span-1 md:col-span-3">
          <summary className="cursor-pointer text-sm opacity-80 hover:opacity-100">Eigene Lösung vorschlagen</summary>
          <div className="mt-2 flex gap-2">
            <input
              className="flex-1 rounded bg-white/5 border border-white/10 px-2 py-1 text-sm outline-none"
              placeholder="Kurz deinen Vorschlag…
(z.B. Swap auf A320 + Crew-Rotation)"
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button
              className="px-3 py-1.5 rounded bg-[var(--brand-1)] text-sm disabled:opacity-50"
              onClick={propose}
              disabled={!!busy || !text.trim()}
            >
              Senden
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}
