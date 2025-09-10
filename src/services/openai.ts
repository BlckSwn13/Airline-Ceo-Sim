// src/services/openai.ts
export interface AiRequest {
  prompt: string;
  systemPrompt?: string;
  role?: string;
  name?: string;
  model?: string;
  temperature?: number;
}

export interface AiResponse {
  ok?: boolean;
  name?: string;
  role?: string;
  reply?: string;
  error?: string;
  detail?: string;
}

export async function callAI(req: AiRequest): Promise<AiResponse> {
  const res = await fetch('/.netlify/functions/chatgpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  const text = await res.text();

  // Netlify erwartet body=string — wir bekommen ihn hier als string und parsen selbst.
  try {
    return JSON.parse(text) as AiResponse;
  } catch {
    // Fallback: Wenn Backend plain text liefert
    return { ok: res.ok, reply: text };
  }
}
