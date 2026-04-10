import { proxyGet } from '../../_helper';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  return proxyGet(`/detail/${params.slug}`);
}
