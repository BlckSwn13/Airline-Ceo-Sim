// netlify/functions/chatgpt.js
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  try {
    // Preflight
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 204, headers: corsHeaders, body: "" };
    }
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt ?? "";
    const contextInfo = body.contextInfo ?? ""; // optional: Airline-Name, Farben, Modus etc.
    const activeRole = body.activeRole ?? "Assistenz des CEO"; // optional: z. B. „Leiter OCC“

    if (!prompt) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing 'prompt' in request body" }),
      };
    }

    const systemPrompt = `
Du bist "Ava", die Assistentin des CEO im Airline-CEO-Simulator.
- Sprich den Nutzer als CEO an.
- Erkläre bei Bedarf die Oberfläche und nächste Schritte.
- Nutze kurze, prägnante Sätze. Modern, klar, freundlich.
- Wenn der Client 'activeRole' setzt (z. B. "Leiter OCC"), antworte im Tonfall dieser Rolle.
- Gib niemals Roh-JSON zurück, antworte nur mit Text in natürlicher Sprache.
`.trim();

    const payload = {
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...(contextInfo ? [{ role: "system", content: contextInfo }] : []),
        { role: "user", content: `Rolle: ${activeRole}\n\nFrage/Aufgabe: ${prompt}` },
      ],
      temperature: 0.7,
    };

    const resp = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return {
        statusCode: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "OpenAI error", details: errText }),
      };
    }

    const data = await resp.json();
    const replyText = data?.choices?.[0]?.message?.content ?? "";

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ava",
        role: activeRole || "Assistenz des CEO",
        reply: replyText,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: err?.message || "Internal Error" }),
    };
  }
};
