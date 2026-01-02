// Edge Function 计数器
export const config = { runtime: 'edge' };

const svg = (count) => `
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="28" role="img" aria-label="Visitor Count: ${count}">
  <linearGradient id="smooth" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="4" width="150" height="28" fill="#555"/>
  <rect rx="4" x="70" width="80" height="28" fill="#4c1"/>
  <rect rx="4" width="150" height="28" fill="url(#smooth)"/>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="12">
    <text x="35" y="18">Visitor</text>
    <text x="110" y="18">${count}</text>
  </g>
</svg>`;

export default async function handler() {
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;
  const key = 'visits:astridstark25963';

  const resp = await fetch(`${UPSTASH_REDIS_REST_URL}/incr/${key}`, {
    headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
  });

  const data = await resp.json();
  const count = typeof data.result === 'number' ? data.result : data.result || data;

  return new Response(svg(count), {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}


