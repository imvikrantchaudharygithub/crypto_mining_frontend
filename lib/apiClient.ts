const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    cache: 'no-store',
    ...init,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
