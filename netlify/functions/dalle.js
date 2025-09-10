// This Netlify function proxies image generation requests to the OpenAI DALL·E API.
// Given a prompt and optional number of images, it returns an array of image URLs.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { prompt, n } = JSON.parse(event.body || '{}');
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: 'OpenAI API key missing' };
  }
  const numImages = n && n > 0 && n <= 3 ? n : 3;
  const resp = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ prompt, n: numImages, size: '256x256' })
  });
  if (!resp.ok) {
    const err = await resp.text();
    return { statusCode: 500, body: err };
  }
  const data = await resp.json();
  const images = data.data.map((item) => item.url);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images })
  };
};