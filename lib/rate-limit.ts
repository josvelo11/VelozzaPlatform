import { NextResponse } from 'next/server';

const WINDOW_SIZE = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 15;

const ipStore = new Map<string, { count: number; firstRequestAt: number }>();

export async function rateLimit(ip: string) {
  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record) {
    ipStore.set(ip, { count: 1, firstRequestAt: now });
    return;
  }

  if (now - record.firstRequestAt > WINDOW_SIZE) {
    ipStore.set(ip, { count: 1, firstRequestAt: now });
    return;
  }

  record.count += 1;

  if (record.count > MAX_REQUESTS) {
    throw new NextResponse('Too many requests', { status: 429 });
  }
}
