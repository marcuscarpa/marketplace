import { NextResponse } from 'next/server';

import { getEdgeConfig } from '@/lib/edge-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getEdgeConfig();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch {
    return NextResponse.json(
      { bannerMessage: undefined, killSwitches: {}, featuredProducts: [] },
      { status: 200 }
    );
  }
}
