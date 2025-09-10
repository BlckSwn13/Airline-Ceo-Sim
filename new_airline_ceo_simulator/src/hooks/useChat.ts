import { useState, useRef } from 'react';

/**
 * useChat
 *
 * Provides a simple hook for streaming responses from the ChatGPT backend.  
 * It manages a list of messages and offers a `send` function.  
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  async function send(prompt: string) {
    const controller = new AbortController();
    abortRef.current = controller;
    // Optimistically update messages with the user's content.
    setMessages((prev) => [...prev, { role: 'user', content: prompt }, { role: 'assistant', content: '' }]);
    try {
      const res = await fetch('/.netlify/functions/chatgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, messages }),
        signal: controller.signal
      });
      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantContent = '';
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        if (value) {
          const chunk = decoder.decode(value);
          assistantContent += chunk;
          setMessages((prev) => {
            // Replace last assistant message with updated content.
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = { role: 'assistant', content: assistantContent };
            return updated;
          });
        }
        done = doneReading;
      }
    } catch (err) {
      console.error('Chat stream error', err);
      setMessages((prev) => {
        const updated = [...prev];
        // Replace last assistant message with error indicator.
        updated[updated.length - 1] = { role: 'assistant', content: 'Es gab ein Problem beim Abrufen der Antwort.' };
        return updated;
      });
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
  }

  return { messages, send, reset };
}