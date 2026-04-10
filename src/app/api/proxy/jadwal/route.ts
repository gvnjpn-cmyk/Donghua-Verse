import { proxyGet } from '../_helper';

export const dynamic = 'force-dynamic';

export async function GET() {
  return proxyGet('/jadwal');
}
