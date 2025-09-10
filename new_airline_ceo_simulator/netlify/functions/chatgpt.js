const { createParser } = require('eventsource-parser');

// ChatGPT streaming Netlify function
// This function proxies requests to the OpenAI Chat Completions API and streams
// responses back to the client using Server-Sent Events (SSE).  
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { prompt, messages } = JSON.parse(event.body || '{}');
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: 'OpenAI API key not configured.' };
  }
  const sysPrompt = `You are an Airline CEO Simulator assistant. Respond concisely and follow the provided JSON action schema when appropriate.`;
  const payload = {
    model: 'gpt-4o',
    temperature: 0.7,
    messages: [
      { role: 'system', content: sysPrompt },
      ...(messages || [])
        .filter((m) => m.role && m.content)
        .map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: prompt }
    ],
    stream: true
  };
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok || !response.body) {
    const err = await response.text();
    return { statusCode: 500, body: err };
  }
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const parser = createParser((event) => {});
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body.getReader();
      controller.enqueue(encoder.encode('data: '));
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        parser.feed(chunk);
        // Pass through raw data to client
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    }
  });
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    },
    body: stream
  };
};