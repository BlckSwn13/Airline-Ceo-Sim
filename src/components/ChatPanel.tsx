import React, { useState } from 'react';

export interface ChatMessage {
  author: string;
  content: string;
}

function parseAIResponse(raw: string): ChatMessage {
  try {
    const obj = JSON.parse(raw);
    const role = obj.role ?? 'Assistent';
    const name = obj.name ?? 'Ava';
    const text = obj.reply ?? obj.content ?? obj.message ?? raw;
    return { author: `${name} — ${role}`, content: text };
  } catch {
    return { author: 'Ava — Assistenz des CEO', content: raw };
  }
}

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  async function send() {
    const prompt = input.trim();
    if (!prompt) return;

    // Nutzer‑Nachricht hinzufügen
    setMessages(prev => [...prev, { author: 'CEO', content: prompt }]);
    setInput('');

    try {
      const resp = await fetch('/.netlify/functions/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          activeRole: 'Assistenz des CEO', // später dynamisch setzen
          contextInfo: ''
        })
      });
      const raw = await resp.text();
      const parsed = parseAIResponse(raw);
      setMessages(prev => [...prev, parsed]);
    } catch (err: any) {
      setMessages(prev => [...prev, { author: 'System', content: `Fehler: ${err?.message ?? err}` }]);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto space-y-3 p-3">
        {messages.map((msg, i) => (
          <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
            {msg.author && <div className="text-xs opacity-80 mb-1">{msg.author}</div>}
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="p-3 flex gap-2 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <input
          className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"
          placeholder="Frage an Ava stellen…"
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
    </div>
  );
};

export default ChatPanel;
