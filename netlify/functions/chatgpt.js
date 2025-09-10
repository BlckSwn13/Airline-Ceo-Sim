// netlify/functions/chatgpt.js
// CommonJS, damit Netlify es ohne ESM-Probleme lädt.
const ALLOWED_ORIGINS = ['*']; // Bei Bedarf auf deine Domain einschränken.

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method not allowed' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return json(500, { error: 'OPENAI_API_KEY missing' });
    }

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return json(400, { error: 'Invalid JSON body' });
    }

    const { prompt, systemPrompt, model = 'gpt-4o-mini', temperature = 0.7 } = body;
    if (!prompt) return json(400, { error: 'prompt required' });

    // Non-streamed call (stabil, simpel)
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        temperature,
        messages: [
          ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return json(resp.status, { error: 'upstream_error', detail: text });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content?.trim() || '';

    // Einheitliches Format, das das Frontend leicht parsen kann
    return json(200, {
      ok: true,
      name: body.name || 'Ava',
      role: body.role || 'Assistenz des CEO',
      reply: content
    });
  } catch (err) {
    return json(500, { error: String(err?.message || err) });
  }
};

function json(statusCode, obj) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.join(','),
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify(obj)
  };
}
