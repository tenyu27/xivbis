import { SetsData } from '../types';

const ENDPOINT = '/__admin/sets';

export async function loadSets(): Promise<SetsData> {
  const res = await request(ENDPOINT, { cache: 'no-store' });
  if (!res.ok) throw new Error(await errorMessage(res));
  return (await res.json()) as SetsData;
}

export async function saveSets(data: SetsData): Promise<void> {
  const res = await request(ENDPOINT, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await errorMessage(res));
}

/**
 * The endpoint only exists while `yarn admin` is running, and a stopped server
 * surfaces as a bare "Failed to fetch" — say what to do about it instead.
 */
async function request(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch {
    throw new Error('Could not reach the admin server. Is `yarn admin` still running?');
  }
}

async function errorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    if (body.error) return body.error;
  } catch {
    // fall through to the status line
  }
  return `${res.status} ${res.statusText}`;
}
