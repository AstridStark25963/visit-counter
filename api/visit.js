// Edge Function 计数器
export const config = { runtime: 'edge' };

const svg = (count) => `
<svg xmlns="http://www.w3.org/2000/svg" width="140" height="28">
  <rect rx="4" width="140" height="28" fill="#555"/>
  <rect rx="4" x="60" width="80" height="28" fill="#4c1"/>
  <g fill="#fff" text-anchor="middle" font-family="Verdana" font-size="12">
    <text x="30" y="18">visits</text>
    <text x="100" y="18">${count}</text>
  </g>
</svg>`;

export default async function handler() {
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;
  const key = 'visits:astridstark25963';
  const resp = await fetch(`${UPSTASH_REDIS_REST_URL}/incr/${key}`, {
    headers: { Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}` }
  });
  const count = await resp.text();
  return new Response(svg(count), {
    status: 200,
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache' },
  });
}