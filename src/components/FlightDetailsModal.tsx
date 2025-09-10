// src/components/FlightDetailsModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import type { Flight, ChatMessage } from '../types';
import { callAI } from '../services/openai';
import { buildPilotPrompt } from '../lib/prompts';

interface Props {
  flight: Flight;
  onClose: () => void;
}

const STORAGE_PREFIX = 'flight-chat-';

function loadThread(flightId: string): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + flightId);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function saveThread(flightId: string, msgs: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_PREFIX + flightId, JSON.stringify(msgs));
  } catch {}
}

const FlightDetailsModal: React.FC<Props> = ({ flight, onClose }) => {
  const [tab, setTab] = useState<'details' | 'comms'>('details');
  const [msgs, setMsgs] = useState<ChatMessage[]>(() => loadThread(flight.id));
  const [input, setInput] = useState('');

  useEffect(() => {
    saveThread(flight.id, msgs);
  }, [flight.id, msgs]);

  const header = useMemo(
    () =>
      `${flight.callsign} • ${flight.origin} → ${flight.destination} • ${flight.aircraftType}${
        flight.registration ? ' ' + flight.registration : ''
      }`,
    [flight]
  );

  async function send() {
    const prompt = input.trim();
    if (!prompt) return;

    setMsgs(prev => [...prev, { author: 'CEO', content: prompt, ts: Date.now() }]);
    setInput('');

    const systemPrompt = buildPilotPrompt(flight);
    const res = await callAI({
      prompt,
      systemPrompt,
      role: 'Cockpit Crew',
      name: 'Pilot/Co-Pilot'
    });

    const reply = res.reply || res.error || '—';
    // Falls AI im Dialogformat antwortet ([Pilot] / [Copilot]), splitten wir in zwei Bubbles
    const lines = reply.split('\n').filter(Boolean);
    const chunks: ChatMessage[] = [];
    if (lines.some(l => /^\s*\[(Pilot|Copilot|Co[-\s]?pilot)\]/i.test(l))) {
      for (const l of lines) {
        const m = l.match(/^\s*\[([^\]]+)\]\s*:\s*(.*)$/);
        if (m) {
          chunks.push({ author: m[1].trim(), content: m[2].trim(), ts: Date.now() });
        }
      }
    } else {
      chunks.push({ author: 'Cockpit', content: reply, ts: Date.now() });
    }
    setMsgs(prev => [...prev, ...chunks]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-semibold">{header}</div>
          <button className="text-sm opacity-80 hover:opacity-100" onClick={onClose}>Schließen</button>
        </div>

        <div className="px-4 pt-3">
          <div className="flex gap-2 mb-3">
            <button
              className={`px-3 py-1.5 rounded ${tab === 'details' ? 'bg-white/10' : ''}`}
              onClick={() => setTab('details')}
            >
              Details
            </button>
            <button
              className={`px-3 py-1.5 rounded ${tab === 'comms' ? 'bg-white/10' : ''}`}
              onClick={() => setTab('comms')}
            >
              Cockpit-Comms
            </button>
          </div>
        </div>

        {tab === 'details' && (
          <div className="p-4 grid md:grid-cols-2 gap-3">
            <Info label="Callsign" value={flight.callsign} />
            <Info label="Route" value={`${flight.origin} → ${flight.destination}`} />
            <Info label="STD / STA" value={`${flight.std} / ${flight.sta}`} />
            <Info label="Status" value={flight.status} />
            <Info label="Muster" value={flight.aircraftType} />
            <Info label="Reg." value={flight.registration || '—'} />
          </div>
        )}

        {tab === 'comms' && (
          <div className="p-4">
            <div className="h-72 overflow-auto space-y-3 mb-3">
              {msgs.map((m, i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-2">
                  {m.author && <div className="text-xs opacity-70 mb-1">{m.author}</div>}
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              ))}
              {msgs.length === 0 && (
                <div className="text-sm opacity-70">
                  Noch keine Comms. Stelle der Crew eine Frage oder gib eine Anweisung.
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
                placeholder="Nachricht an Pilot/Co-Pilot…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <button onClick={send} className="rounded-xl px-4 py-2 bg-[var(--brand-1)] hover:opacity-90">
                Senden
              </button>
            </div>
            <div className="text-xs opacity-70 mt-2">
              Hinweis: Dieser Verlauf wird <strong>nur</strong> für Flug <b>{flight.id}</b> gespeichert.
            </div>
          </div>
        )}

        <div className="p-3 border-t border-white/10 flex justify-end">
          <button className="px-4 py-2 rounded bg-white/10 hover:bg-white/20" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
      <div className="text-xs opacity-70">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

export default FlightDetailsModal;
